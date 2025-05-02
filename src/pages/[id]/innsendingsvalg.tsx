import '@navikt/ds-css';
import type { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { getForm } from 'src/api/apiService';
import ChooseFormSubmissionType from 'src/components/chooseSubmissionType/chooseFormSubmissionType';
import { Paths } from 'src/data/paths';
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
  const { locale } = context;
  const form = await getForm(id, locale);
  const translations = await getServerSideTranslations(locale, ['common', 'innsendingsvalg']);

  if (form === 'serverError') {
    logger.error(`Server error occurred while fetching form ${id}`);
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
        destination: localePathPrefix(context) + Paths.details(id),
        locale: false,
      },
    };
  }

  return {
    props: { id, form, ...translations },
  };
}

export default Innsendingsvalg;
