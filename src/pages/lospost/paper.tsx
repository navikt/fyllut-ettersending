import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import '@navikt/ds-css';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { GetServerSidePropsContext } from 'next/types';
import { useCallback, useEffect, useState } from 'react';
import ButtonGroup from 'src/components/button/buttonGroup';
import { ButtonType } from 'src/components/button/buttonGroupElement';
import ValidationSummary from 'src/components/validationSummary/validationSummary';
import { Paths } from 'src/data/paths';
import { useReffererPage } from 'src/hooks/useReferrerPage';
import { fetchNavUnits } from '../../api/apiClient';
import { getArchiveSubjects } from '../../api/apiService';
import Layout from '../../components/layout/layout';
import OtherDocument from '../../components/other-document/other-document';
import { KeyValue, NavUnit } from '../../data/domain';
import { getServerSideTranslations } from '../../utils/i18nUtil';
import { excludeKeysEmpty } from '../../utils/object';
import { uncapitalize } from '../../utils/stringUtil';

interface Props {
  tema?: string;
  gjelder?: string;
  subjects?: KeyValue;
}

const PaperLospostPage: NextPage<Props> = ({ tema, subjects }) => {
  const [navUnits, setNavUnits] = useState<NavUnit[]>([]);
  const { t } = useTranslation('lospost');
  const { t: tCommon } = useTranslation('common');
  const referrerPage = useReffererPage();

  const nextButton: ButtonType = {
    text: tCommon('button.next'),
    path: Paths.downloadPage('lospost'),
    validateForm: true,
    icon: <ArrowRightIcon aria-hidden />,
    iconPosition: 'right',
  };

  const previousButton: ButtonType = {
    text: tCommon('button.previous'),
    variant: 'secondary',
    icon: <ArrowLeftIcon aria-hidden />,
    path: referrerPage,
    external: true,
  };

  const fetchData = useCallback(async () => {
    const navUnitsResponse = await fetchNavUnits();
    setNavUnits(navUnitsResponse);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = tema && subjects?.[tema] ? `${t('title-about')} ${uncapitalize(subjects[tema])}` : t('title');

  return (
    <Layout title={title} backUrl={referrerPage}>
      <ValidationSummary />
      <OtherDocument archiveSubjects={subjects ?? {}} navUnits={navUnits} subject={tema} />
      <ButtonGroup buttons={[nextButton, ...(referrerPage ? [previousButton] : [])]} />
      <ButtonGroup
        center={!!referrerPage}
        buttons={[
          {
            text: tCommon('button.cancel'),
            path: process.env.NEXT_PUBLIC_NAV_URL || 'https://nav.no',
            variant: 'tertiary',
            external: true,
          },
        ]}
      />
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, query } = context;
  const { tema, gjelder } = query as { tema: string; gjelder: string };
  const pageProps = excludeKeysEmpty({ tema, gjelder });
  const subjects = await getArchiveSubjects(locale);
  const translations = await getServerSideTranslations(context.locale, ['lospost', 'common', 'validator']);
  return { props: { subjects, ...pageProps, ...translations } };
}

export default PaperLospostPage;
