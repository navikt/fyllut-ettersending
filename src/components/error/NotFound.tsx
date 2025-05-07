import { Link, List } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { Paths } from '../../data/paths';
import { Error as ErrorComponent } from './Error';

export function NotFound() {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language;
  return (
    <ErrorComponent
      locale={locale}
      heading={t('error.not-found-heading')}
      errorBody={t('error.404-error-message')}
      showMyPage
      showReportBug
    >
      <>
        <List>
          <List.Item>
            <Link href={Paths.navFrontPage(locale)} target="_blank" rel="noreferrer">
              {t('error.go-to-front-page')}
            </Link>
          </List.Item>
        </List>
      </>
    </ErrorComponent>
  );
}
