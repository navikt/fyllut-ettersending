import { Heading, LinkPanel } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { SubmissionType } from 'src/data/domain';
import { Paths } from 'src/data/text';
import Layout from '../layout/layout';
import styles from './chooseSubmissionType.module.css';

interface Props {
  id: string;
}

const ChooseSubmissionType = ({ id }: Props) => {
  const { t } = useTranslation('innsendings-metode');
  const pathWithId = Paths.details + '/' + id;

  return (
    <Layout title={t('title')}>
      <Heading size="medium" level="2" spacing className={styles.heading}>
        {t('heading')}
      </Heading>

      <ul className={styles.linkList}>
        <NextLink href={pathWithId + '?sub=' + SubmissionType.digital} passHref legacyBehavior>
          <LinkPanel border rel="noreferrer">
            <LinkPanel.Title>{t('digital-title')}</LinkPanel.Title>
            <LinkPanel.Description>{t('digital-description')}</LinkPanel.Description>
          </LinkPanel>
        </NextLink>
        <NextLink href={`${pathWithId}?sub=${SubmissionType.paper}`} passHref legacyBehavior>
          <LinkPanel border rel="noreferrer">
            <LinkPanel.Title>{t('paper-title')}</LinkPanel.Title>
            <LinkPanel.Description>{t('paper-description')}</LinkPanel.Description>
          </LinkPanel>
        </NextLink>
      </ul>
    </Layout>
  );
};

export default ChooseSubmissionType;
