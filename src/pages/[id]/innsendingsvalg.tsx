import type { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { getForm } from 'src/api/apiService';
import ChooseFormSubmissionType from 'src/components/chooseSubmissionType/chooseFormSubmissionType';
import { Paths } from 'src/data/paths';
import { mergeQueryString, normalizeQueryValue } from 'src/utils/queryParams';
import { areBothSubmissionTypesAllowed } from 'src/utils/submissionUtil';
import { InternalServerError } from '../../components/error/InternalServerError';
import { EttersendelseApplication, Form } from '../../data';
import { getServerSideTranslations, localePathPrefix } from '../../utils/i18nUtil';
import logger from '../../utils/logger';

interface Props {
  id: string;
  form: Form;
  existingEttersendinger: EttersendelseApplication[];
  serverError?: boolean;
}

const Innsendingsvalg: NextPage<Props> = (props) => {
  const { id, form, serverError } = props;

  if (serverError) {
    return <InternalServerError />;
  }
  return <ChooseFormSubmissionType id={id} form={form} />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;
  const { locale, query } = context;
  const { tema, gjelder } = query as { tema?: string | string[]; gjelder?: string | string[] };
  const queryParams = { tema: normalizeQueryValue(tema), gjelder: normalizeQueryValue(gjelder) };
  const translations = await getServerSideTranslations(locale, ['common', 'innsendingsvalg']);

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
    return { notFound: true };
  }

  if (!areBothSubmissionTypesAllowed(form)) {
    return {
      redirect: {
        permanent: false,
        destination: localePathPrefix(context) + mergeQueryString(Paths.details(id), queryParams),
        locale: false,
      },
    };
  }

  return {
    props: { id, form, ...translations },
  };
}

export default Innsendingsvalg;
