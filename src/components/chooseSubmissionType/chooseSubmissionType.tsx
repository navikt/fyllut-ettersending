import { Heading, LinkPanel } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Form, SubmissionType } from 'src/data/domain';
import { Paths } from 'src/data/text';
import { areBothSubmissionTypesAllowed, isDigitalSubmissionAllowed } from 'src/utils/submissionUtil';
import Layout from '../layout/layout';
import styles from './chooseSubmissionType.module.css';

interface Props {
  form: Form;
  id: string;
}

const ChooseSubmissionType = ({ form, id }: Props) => {
  const { t } = useTranslation('detaljer');
  const router = useRouter();
  const pathWithId = Paths.details + '/' + id;

  useEffect(() => {
    const submissionType = isDigitalSubmissionAllowed(form) ? SubmissionType.digital : SubmissionType.paper;
    if (!areBothSubmissionTypesAllowed(form)) {
      router.replace(pathWithId + '?sub=' + submissionType, undefined, { shallow: true });
    }
  }, [form, router, pathWithId]);

  return areBothSubmissionTypesAllowed(form) ? (
    <Layout title={t('choose-submission-type.title')}>
      <Heading size="medium" level="2" spacing className={styles.heading}>
        {t('choose-submission-type.heading')}
      </Heading>

      <ul className={styles.linkList}>
        <NextLink href={pathWithId + '?sub=' + SubmissionType.digital} passHref legacyBehavior shallow>
          <LinkPanel border rel="noreferrer">
            <LinkPanel.Title>{t('choose-submission-type.digital-title')}</LinkPanel.Title>
            <LinkPanel.Description>{t('choose-submission-type.digital-description')}</LinkPanel.Description>
          </LinkPanel>
        </NextLink>
        <NextLink href={`${pathWithId}?sub=${SubmissionType.paper}`} passHref legacyBehavior shallow>
          <LinkPanel border rel="noreferrer">
            <LinkPanel.Title>{t('choose-submission-type.paper-title')}</LinkPanel.Title>
            <LinkPanel.Description>{t('choose-submission-type.paper-description')}</LinkPanel.Description>
          </LinkPanel>
        </NextLink>
      </ul>
    </Layout>
  ) : null;
};

export default ChooseSubmissionType;
