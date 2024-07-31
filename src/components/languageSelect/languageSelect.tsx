import { Select } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { LanguageCode } from 'src/data/domain';
import { languageCodeMap, languageSortOrder } from 'src/utils/language';

interface LanguageSelectProps {
  publishedLanguages?: LanguageCode[];
}

const LanguageSelect = ({ publishedLanguages = ['nb', 'en', 'nn'] }: LanguageSelectProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.push({ pathname, query }, asPath, { locale: event.currentTarget.value });
  };

  return (
    <Select label={t('language-select.label')} hideLabel value={locale} onChange={onChange}>
      {publishedLanguages
        ?.sort((a, b) => languageSortOrder[a] - languageSortOrder[b])
        .map((lang) => (
          <option key={lang} value={lang}>
            {languageCodeMap[lang]}
          </option>
        ))}
    </Select>
  );
};

export default LanguageSelect;
