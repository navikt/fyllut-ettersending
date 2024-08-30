import '@navikt/ds-css';
import type { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { getForm } from 'src/api/apiService';
import ChooseFormSubmissionType from 'src/components/chooseSubmissionType/chooseFormSubmissionType';
import { Paths } from 'src/data/paths';
import { areBothSubmissionTypesAllowed } from 'src/utils/submissionUtil';
import { EttersendelseApplication, Form } from '../../data/domain';
import { getServerSideTranslations, localePathPrefix } from '../../utils/i18nUtil';

interface Props {
  id: string;
  form: Form;
  existingEttersendinger: EttersendelseApplication[];
}

const Innsendingsvalg: NextPage<Props> = (props) => {
  const { id, form } = props;

  return <ChooseFormSubmissionType id={id} form={form} />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;
  const { locale } = context;
  const form = await getForm(id, locale);

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

  const translations = await getServerSideTranslations(locale, ['common', 'innsendingsvalg']);

  return {
    props: { id, form, ...translations },
  };
}

export default Innsendingsvalg;
