import { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { getEttersendinger, getForm } from 'src/api/apiService';
import { getIdPortenTokenFromContext } from 'src/api/loginRedirect';
import Details from 'src/components/details/Details';
import { EttersendelseApplication, Form, QuerySubmissionType, UnauthenticatedError } from 'src/data';
import { getServerSideTranslations, localePathPrefix } from 'src/utils/i18nUtil';
import logger from 'src/utils/logger';
import { getLoginRedirect } from 'src/utils/login';
import {
  areBothSubmissionTypesAllowed,
  isDigitalSubmissionAllowed,
  isPaperSubmissionAllowed,
  isSubmissionAllowed,
} from 'src/utils/submissionUtil';
import { InternalServerError } from '../../components/error/InternalServerError';
import { Paths } from '../../data/paths';
import { isValidFormPath } from '../../utils/formDataUtil';

interface Props {
  form: Form;
  id: string;
  existingEttersendinger: EttersendelseApplication[];
  serverError?: boolean;
}

const IndexPage: NextPage<Props> = (props) => {
  if (props.serverError) {
    return <InternalServerError />;
  }
  return <Details {...props} />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res, query } = context;
  const id = context.params?.id as string;
  if (id && !isValidFormPath(id)) {
    logger.debug(`Invalid id parameter: '${id}'`);
    return { notFound: true };
  }

  // Set cache control header
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');

  // Attempt to verify the token and redirect to login if necessary
  let idportenToken = '';
  try {
    idportenToken = (await getIdPortenTokenFromContext(context)) as string;
  } catch (ex: unknown) {
    logger.info(`Failed to verify token`);
    if (ex instanceof UnauthenticatedError) {
      logger.info(`Failed to verify token. Redirecting to login.`);
      return redirectToLogin(context);
    }
  }

  // Fetch the form
  const { locale } = context;
  const isDigitalQuerySub = query.sub === QuerySubmissionType.digital;
  const isPaperQuerySub = query.sub === QuerySubmissionType.paper;
  const translations = await getServerSideTranslations(locale, ['common', 'detaljer', 'validator']);

  let form: Form | undefined;
  try {
    form = await getForm(id, locale);
  } catch (error) {
    logger.error(`Server error occurred while fetching form ${id} caused by ${error}`);
    return {
      props: {
        error: true,
        serverError: true,
        ...translations,
      },
    };
  }

  if (!form) {
    logger.info(`Failed to get form, returning not found`);
    return { notFound: true };
  }

  if (!isSubmissionAllowed(form)) {
    logger.info(`Form ${form.path} has no allowed submission type`);
    return {
      props: {
        form,
        error: true,
        noSubmissionType: true,
        ...translations,
      },
    };
  }

  if (isPaperQuerySub && !isPaperSubmissionAllowed(form)) {
    logger.info(`Paper submission for form ${form.path} is not allowed`);
    return {
      props: {
        form,
        error: true,
        digitalOnly: true,
        ...translations,
      },
    };
  }

  if (isDigitalQuerySub && !isDigitalSubmissionAllowed(form)) {
    logger.info(`Digital submission for form ${form.path} is not allowed`);
    return {
      props: {
        form,
        error: true,
        paperOnly: true,
        ...translations,
      },
    };
  }

  // Fetch existing ettersendinger and redirect if necessary
  let existingEttersendinger: EttersendelseApplication[] = [];
  if (idportenToken && form?.properties.formNumber) {
    existingEttersendinger = await getEttersendinger(idportenToken, form.properties.formNumber);
    logger.info('Redirecting based on existing ettersendinger');
    const redirect = redirectBasedOnExistingEttersendinger(existingEttersendinger);
    if (redirect) return redirect;
  }

  if (!query.sub && areBothSubmissionTypesAllowed(form)) {
    return {
      redirect: {
        permanent: false,
        destination: localePathPrefix(context) + Paths.submissionType(id),
        locale: false,
      },
    };
  }

  return {
    props: { form, existingEttersendinger, id, ...translations },
  };
}

const redirectBasedOnExistingEttersendinger = (existingEttersendinger: EttersendelseApplication[]) => {
  if (existingEttersendinger.length === 1) {
    return {
      redirect: {
        permanent: false,
        destination: `${process.env.NEXT_PUBLIC_SEND_INN_FRONTEND_URL}/${existingEttersendinger[0].innsendingsId}`,
      },
      props: {},
    };
  }

  if (existingEttersendinger.length > 1) {
    return {
      redirect: {
        permanent: false,
        destination: `${process.env.MIN_SIDE_FRONTEND_URL}/varsler`,
      },
      props: {},
    };
  }
};

const redirectToLogin = (context: GetServerSidePropsContext) => {
  const redirect = getLoginRedirect(context);
  logger.info("Redirecting to login page with redirect url: '" + redirect);

  return {
    redirect: {
      permanent: false,
      destination: `/oauth2/login?redirect=${encodeURIComponent(redirect)}`,
    },
    props: {},
  };
};

export default IndexPage;
