import '@navikt/ds-css';
import type { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import ChooseSubmissionType from '../../components/chooseSubmissionType/chooseSubmissionType';
import { getServerSideTranslations } from '../../utils/i18nUtil';
import { PAPER_ONLY_SUBJECTS } from '../../utils/lospost';
import { excludeKeysEmpty } from '../../utils/object';

interface Props {
  tema?: string;
  gjelder?: string;
}

const Lospost: NextPage<Props> = ({ tema, gjelder }) => {
  const queryString = createPageProps({ tema, gjelder }).asQueryString();

  return (
    <ChooseSubmissionType
      pathDigital={`/lospost/digital${queryString ? `?${queryString}` : ''}`}
      pathPaper={`/lospost/paper${queryString ? `?${queryString}` : ''}`}
    />
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, query } = context;
  const { tema, gjelder, sub } = query as { tema: string; gjelder: string; sub: string };
  const pageProps = createPageProps({ tema, gjelder });
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

const createPageProps = ({ tema, gjelder }: Props) => {
  const props = excludeKeysEmpty({ tema, gjelder });
  return {
    asQueryString: () => new URLSearchParams(props).toString(),
    asProps: () => props,
  };
};

export default Lospost;
