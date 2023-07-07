import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./en/translation.json";
import nbTranslation from "./nb/translation.json";
import nnTranslation from "./nn/translation.json";

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    //lng: "nb", // if you"re using a language detector, do not define the lng option
    fallbackLng: "nb",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      nb: {
        translation: nbTranslation,
      },
      nn: {
        translation: nnTranslation,
      },
    },
    // if you see an error like: "Argument of type "DefaultTFuncReturn" is not assignable to parameter of type xyz"
    // set returnNull to false (and also in the i18next.d.ts options)
    // returnNull: false,
  });

export default i18n;
