import '@navikt/ds-css';
import type { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import ChooseSubmissionType from '../../components/chooseSubmissionType/chooseSubmissionType';
import { getServerSideTranslations } from '../../utils/i18nUtil';

interface Props {
  tema?: string;
}

const Lospost: NextPage<Props> = ({ tema }) => {
  const temaQueryString = tema ? `?tema=${tema}` : '';

  return (
    <ChooseSubmissionType
      pathDigital={`/lospost/digital${temaQueryString}`}
      pathPaper={`/lospost/paper${temaQueryString}`}
    />
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, query } = context;
  const { tema, sub } = query as { tema: string; sub: string };
  const translations = await getServerSideTranslations(context.locale, ['lospost', 'common', 'innsendingsvalg']);
  const localePath = locale ? `/${locale}` : '';
  if (sub) {
    switch (sub) {
      case 'paper':
        return {
          redirect: {
            permanent: false,
            destination: `${localePath}/lospost/paper${tema ? `?tema=${tema}` : ''}`,
          },
        };
      case 'digital':
        return {
          redirect: {
            permanent: false,
            destination: `${localePath}/lospost/digital${tema ? `?tema=${tema}` : ''}`,
          },
        };
    }
  }
  return {
    props: {
      ...(tema && { tema }),
      ...translations,
    },
  };
}

export default Lospost;
