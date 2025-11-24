import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Heading, HStack, Link as NavLink } from '@navikt/ds-react';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import { LanguageCode } from 'src/data';
import LanguageSelect from '../languageSelect/languageSelect';
import styles from './layout.module.css';

interface Props {
  title?: string;
  children: ReactNode;
  backUrl?: string;
  showBackLink?: boolean;
  publishedLanguages?: LanguageCode[];
  hideTitle?: boolean;
}

const Layout = ({ title, hideTitle, children, backUrl, showBackLink = true, publishedLanguages }: Props) => {
  const { t } = useTranslation('common');

  const backLink = () => {
    if (backUrl && showBackLink) {
      return (
        <Link href={backUrl} passHref legacyBehavior>
          <NavLink className={styles.backLink}>
            <ArrowLeftIcon className={styles.backLinkIcon} aria-hidden={true} />
            {t('button.previous')}
          </NavLink>
        </Link>
      );
    }
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{title ?? t('heading.default-title')}</title>
      </Head>

      <header className={classNames(styles.header, styles.content)}>
        <HStack className={classNames(styles.headerActions)} justify="space-between">
          {(!publishedLanguages || publishedLanguages.length > 1) && (
            <div className={styles.children}>
              <LanguageSelect publishedLanguages={publishedLanguages} />
            </div>
          )}
          {backLink()}
        </HStack>
        {!hideTitle && <Heading size="xlarge">{title ?? t('heading.default-title')}</Heading>}
      </header>

      <div className={classNames(styles.content, styles.mainContent)}>
        <div className={styles.mainColumn}>
          <div className={styles.children}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
