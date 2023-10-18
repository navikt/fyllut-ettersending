import { ArrowLeftIcon } from '@navikt/aksel-icons';
import '@navikt/ds-css';
import { Heading, Link as NavLink } from '@navikt/ds-react';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { ReactNode } from 'react';
import LanguageSelect from '../button/languageSelect/languageSelect';
import styles from './layout.module.css';

interface Props {
  title?: string;
  children: ReactNode;
  backUrl?: string;
  showBackLink?: boolean;
}

const Layout = ({ title, children, backUrl, showBackLink = true }: Props) => {
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
      <header className={classNames(styles.header, styles.content)}>
        <Heading size="xlarge" level="1">
          {title ?? t('heading.default-title')}
        </Heading>
      </header>

      <hr className={styles.hr} />
      <div className={classNames(styles.content, styles.mainContent)}>
        <div className={styles.mainColumn}>
          {backLink()}
          <div className={styles.children}>{children}</div>
        </div>
        <div className={styles.sideColumn}>
          <div className={styles.children}>
            <LanguageSelect />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
