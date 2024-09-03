import { ErrorSummary } from '@navikt/ds-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormState } from 'src/data/appState';
import styles from './validationSummary.module.css';

const ValidationSummary = () => {
  const { errors, validationSummaryRef } = useFormState();
  const { t } = useTranslation('common');

  const errorEntries = Object.entries(errors);
  const hasError = !!errorEntries.length;

  useEffect(() => {
    validationSummaryRef?.current?.focus();
  }, [hasError, validationSummaryRef]);

  return hasError ? (
    <ErrorSummary
      ref={validationSummaryRef}
      className={styles.errorSummary}
      heading={t('validationSummaryTitle')}
      data-cy="ValidationSummary"
    >
      {errorEntries.map(([key, value]) => (
        <ErrorSummary.Item key={key} href={`#${key}`}>
          {value}
        </ErrorSummary.Item>
      ))}
    </ErrorSummary>
  ) : null;
};

export default ValidationSummary;
