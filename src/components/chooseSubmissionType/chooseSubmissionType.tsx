import { Heading, LinkCard } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { LanguageCode } from 'src/data';
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

      <ul className={styles.linkList}>
        <li>
          <LinkCard className={styles.linkCard}>
            <LinkCard.Title as="h3" className={styles.linkCardTitle}>
              <LinkCard.Anchor asChild>
                <NextLink href={pathDigital}>{t('digital-title')}</NextLink>
              </LinkCard.Anchor>
            </LinkCard.Title>
            <LinkCard.Description>{t('digital-description')}</LinkCard.Description>
          </LinkCard>
        </li>
        <li>
          <LinkCard className={styles.linkCard}>
            <LinkCard.Title as="h3" className={styles.linkCardTitle}>
              <LinkCard.Anchor asChild>
                <NextLink href={pathPaper}>{t('paper-title')}</NextLink>
              </LinkCard.Anchor>
            </LinkCard.Title>
            <LinkCard.Description>{t('paper-description')}</LinkCard.Description>
          </LinkCard>
        </li>
      </ul>
    </Layout>
  );
};

export default ChooseSubmissionType;
