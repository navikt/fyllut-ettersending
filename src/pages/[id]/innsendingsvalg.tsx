import '@navikt/ds-css';
import type { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { getForm } from 'src/api/apiService';
import ChooseSubmissionType from 'src/components/chooseSubmissionType/chooseSubmissionType';
import { Paths } from 'src/data/paths';
import { areBothSubmissionTypesAllowed } from 'src/utils/submissionUtil';
import { EttersendelseApplication } from '../../data/domain';
import { getServerSideTranslations, localePathPrefix } from '../../utils/i18nUtil';

interface Props {
  id: string;
  existingEttersendinger: EttersendelseApplication[];
}

const Innsendingsvalg: NextPage<Props> = (props) => {
  const { id } = props;

  return <ChooseSubmissionType id={id} />;
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
    props: { id, ...translations },
  };
}

export default Innsendingsvalg;
