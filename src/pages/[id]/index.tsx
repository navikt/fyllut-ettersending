import { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { getEttersendinger, getForm } from 'src/api/apiService';
import { getIdPortenTokenFromContext } from 'src/api/loginRedirect';
import Details from 'src/components/details/Details';
import { EttersendelseApplication, Form, UnauthenticatedError } from 'src/data';
import { getServerSideTranslations, localePathPrefix } from 'src/utils/i18nUtil';
import logger from 'src/utils/logger';
import { getLoginRedirect } from 'src/utils/login';
import {
  areBothSubmissionTypesAllowed,
  isDigitalValidSubmission,
  isPaperValidSubmission,
  isSubmissionAllowed,
  isValidSubmissionTypeInUrl,
} from 'src/utils/submissionUtil';
import { Paths } from '../../data/paths';

interface Props {
  form: Form;
  id: string;
  existingEttersendinger: EttersendelseApplication[];
}

const IndexPage: NextPage<Props> = (props) => {
  return <Details {...props} />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Set cache control header
  const { res, query } = context;
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
  const id = context.params?.id as string;
  const { locale } = context;
  const form = await getForm(id, locale);

  if (!form) {
    logger.info(`Failed to get form, returning not found`);
    return { notFound: true };
  }

  const hasNoSubmissionType = !isSubmissionAllowed(form);
  const isInvalidSubmission = query.sub && !isValidSubmissionTypeInUrl(form, query.sub);

  if (!isPaperValidSubmission(form, query.sub)) {
    console.log('Paper submission not allowed');
    // return {
    //   props: {
    //     error: true,
    //     paperOnly: true,
    //   },
    // };
  }

  if (!isDigitalValidSubmission(form, query.sub)) {
    console.log('Digital submission not allowed');
    // return {
    //   props: {
    //     error: true,
    //     digitalOnly: true,
    //   },
    // };
  }

  if (hasNoSubmissionType || isInvalidSubmission) {
    logger.info(
      `Submission type is not the same as the valid submission types in the form ${form.path}, returning not found`,
    );
    return { notFound: true };
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

  const translations = await getServerSideTranslations(locale, ['common', 'detaljer', 'validator']);

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
