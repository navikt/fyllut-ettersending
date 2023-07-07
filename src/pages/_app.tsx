import type { AppProps } from "next/app";
import "./styles.css";
import Head from "next/head";
import { FormDataProvider } from "../data/appState";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/config";
import {useRouter} from "next/router";
import {useEffect} from "react";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const {locale} = useRouter();
  useEffect(() => {
    // TODO finne ut hvordan hindre at default språk vises før riktig språk benyttes
    i18n.changeLanguage(locale);
  }, [locale]);
  return (
    <I18nextProvider i18n={i18n}>
      <FormDataProvider>
        <Head>
          <title>FyllUt :: Ettersending</title>
        </Head>
        <Component {...pageProps} />
      </FormDataProvider>
    </I18nextProvider>
  );
};

export default MyApp;
