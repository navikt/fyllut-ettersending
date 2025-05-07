import { BodyShort, Link, List } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Paths } from '../../data/paths';
import { Error as ErrorComponent } from './Error';

export function InternalServerError() {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language;
  const [historyLength, setHistoryLength] = useState<number | null>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHistoryLength(window.history.length);
    }
  }, []);

  return (
    <ErrorComponent locale={locale} heading={t('error.default-heading')} errorBody={t('error.500-error-message')}>
      <>
        <BodyShort>{t('error.500-error-suggestion')}</BodyShort>
        <List>
          <List.Item>
            {`${t('error.500-error-wait')} `}
            <Link onClick={() => location.reload()}>{t('error.500-error-refresh')}</Link>
          </List.Item>
          {historyLength && historyLength > 1 && (
            <List.Item>
              <Link onClick={() => history.back()}>{t('error.500-error-previous-page')}</Link>
            </List.Item>
          )}
          <List.Item>
            <Link href={Paths.navFrontPage(locale)}>{t('error.go-to-front-page').toLowerCase()}</Link>
          </List.Item>
        </List>
        <BodyShort>
          {`${t('error.500-error-problem-persists')} `}
          <Link href={Paths.navContactUsPage(locale)} target="_blank">
            {`${t('error.500-error-contact-us-new-tab')}`}
          </Link>
        </BodyShort>
      </>
    </ErrorComponent>
  );
}
