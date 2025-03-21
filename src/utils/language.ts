import { LanguageCode } from 'src/data';

const toValidLanguageCodes = (languages: string[]): LanguageCode[] => {
  return languages.map((lang) => toValidLanguageCode(lang));
};

/**
 * New language codes in Fyllut need to be defined here or we will get duplicate nb language in the language selector
 *
 * @param lang
 */
const toValidLanguageCode = (lang: string): LanguageCode => {
  switch (lang) {
    case 'nn':
    case 'nn-NO':
      return 'nn';
    case 'en':
      return 'en';
    default:
      return 'nb';
  }
};

const languageCodeMap = {
  nb: 'Norsk bokmål',
  nn: 'Norsk nynorsk',
  en: 'English',
} as const;

const languageSortOrder = {
  nb: 0,
  nn: 1,
  en: 2,
} as const;

export { languageCodeMap, languageSortOrder, toValidLanguageCode, toValidLanguageCodes };
