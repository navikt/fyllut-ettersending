import '@navikt/ds-css';
import type { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import ChooseSubmissionType from '../../components/chooseSubmissionType/chooseSubmissionType';
import { getServerSideTranslations } from '../../utils/i18nUtil';
import { PAPER_ONLY_SUBJECTS } from '../../utils/lospost';

interface Props {
  tema?: string;
  dokumentnavn?: string;
}

const createPageProps = ({ tema, dokumentnavn }: Props) => {
  const props = {
    ...(tema && { tema }),
    ...(dokumentnavn && { dokumentnavn }),
  };
  return {
    asQueryString: () => new URLSearchParams(props).toString(),
    asProps: () => props,
  };
};

const Lospost: NextPage<Props> = ({ tema, dokumentnavn }) => {
  const queryString = createPageProps({ tema, dokumentnavn }).asQueryString();

  return (
    <ChooseSubmissionType
      pathDigital={`/lospost/digital${queryString ? `?${queryString}` : ''}`}
      pathPaper={`/lospost/paper${queryString ? `?${queryString}` : ''}`}
    />
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, query } = context;
  const { tema, dokumentnavn, sub } = query as { tema: string; dokumentnavn: string; sub: string };
  const pageProps = createPageProps({ tema, dokumentnavn });
  const translations = await getServerSideTranslations(context.locale, ['lospost', 'common', 'innsendingsvalg']);
  const localePath = locale ? `/${locale}` : '';
  const onlyPaperAllowedForSubject = tema && PAPER_ONLY_SUBJECTS.includes(tema);
  const redirectToPaper = sub === 'paper' || onlyPaperAllowedForSubject;
  if (redirectToPaper) {
    const queryString = pageProps.asQueryString();
    return {
      redirect: {
        permanent: false,
        destination: `${localePath}/lospost/paper${queryString ? `?${queryString}` : ''}`,
      },
    };
  } else if (sub === 'digital') {
    const queryString = pageProps.asQueryString();
    return {
      redirect: {
        permanent: false,
        destination: `${localePath}/lospost/digital${queryString ? `?${queryString}` : ''}`,
      },
    };
  }
  return {
    props: {
      page: 'lospost',
      ...pageProps.asProps(),
      ...translations,
    },
  };
}

export default Lospost;
