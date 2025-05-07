import { BugIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, VStack } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Paths } from '../../data/paths';
import Layout from '../layout/layout';
import styles from './error.module.css';

type ErrorProps = {
  heading: string;
  errorBody?: string;
  showGoToFrontPage?: boolean;
  children?: ReactNode;
  showReportBug?: boolean;
  locale: string;
};

export function Error({ heading, errorBody, showGoToFrontPage, showReportBug, locale = 'nb', children }: ErrorProps) {
  const { t } = useTranslation('common');
  return (
    <Layout title={heading} hideTitle>
      <Box paddingBlock="20">
        <VStack gap="16">
          <VStack gap="8" align="start">
            <div>
              <Heading size="large" spacing>
                {heading}
              </Heading>
              {errorBody && <BodyShort spacing>{errorBody}</BodyShort>}
              {children}
            </div>
            {showReportBug && (
              <Link className={styles.bugLink} href={Paths.navReportBugPage(locale)} target="_blank">
                <BugIcon aria-hidden />
                {t('error.report-error')}
              </Link>
            )}
            {showGoToFrontPage && (
              <Button as="a" href={Paths.navFrontPage(locale)}>
                {t('error.go-to-front-page')}
              </Button>
            )}
          </VStack>
        </VStack>
      </Box>
    </Layout>
  );
}
