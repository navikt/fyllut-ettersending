import { useTranslation } from 'next-i18next';
import { Error as ErrorComponent } from './Error';

export function NotFound() {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language;
  return (
    <ErrorComponent
      locale={locale}
      heading={t('error.not-found-heading')}
      errorBody={t('error.404-error-message')}
      showReportBug
      showGoToFrontPage
    />
  );
}
