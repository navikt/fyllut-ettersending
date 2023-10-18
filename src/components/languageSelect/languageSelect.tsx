import { Select } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

const LanguageSelect = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.push({ pathname, query }, asPath, { locale: event.currentTarget.value });
  };

  return (
    <Select label={t('language-select.label')} hideLabel value={locale} onChange={onChange}>
      <option value="nb">Bokmål</option>
      <option value="nn">Nynorsk</option>
      <option value="en">English</option>
    </Select>
  );
};

export default LanguageSelect;
