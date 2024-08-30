import { Heading, LinkPanel } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { LanguageCode } from 'src/data/domain';
import Layout from '../layout/layout';
import styles from './chooseSubmissionType.module.css';

interface Props {
  pathDigital: string;
  pathPaper: string;
  languages?: LanguageCode[];
}

const ChooseSubmissionType = ({ pathDigital, pathPaper, languages }: Props) => {
  const { t } = useTranslation('innsendingsvalg');

  return (
    <Layout title={t('title')} publishedLanguages={languages}>
      <Heading size="medium" level="2" spacing className={styles.heading}>
        {t('heading')}
      </Heading>

      <div className={styles.linkList}>
        <LinkPanel as={NextLink} border href={pathDigital} rel="noreferrer">
          <LinkPanel.Title>{t('digital-title')}</LinkPanel.Title>
          <LinkPanel.Description>{t('digital-description')}</LinkPanel.Description>
        </LinkPanel>
        <LinkPanel as={NextLink} border href={pathPaper} rel="noreferrer">
          <LinkPanel.Title>{t('paper-title')}</LinkPanel.Title>
          <LinkPanel.Description>{t('paper-description')}</LinkPanel.Description>
        </LinkPanel>
      </div>
    </Layout>
  );
};

export default ChooseSubmissionType;
