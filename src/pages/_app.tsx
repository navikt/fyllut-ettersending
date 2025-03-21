import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import { FormDataPage } from '../data';
import { FormDataProvider } from '../data/appState';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const page = (pageProps.page as FormDataPage) || 'other';
  const documentationTitlePrefix = (pageProps.gjelder as string) || undefined;
  return (
    <FormDataProvider page={page} documentationTitlePrefix={documentationTitlePrefix}>
      <Head>
        <title>Dokument til NAV - nav.no</title>
        <meta name="google-site-verification" content="lLm_tEVoko28mgQfCVHXDqqDPg-5nalBbEmRH_wTqUc" />
        <meta name="robots" content="noindex" />
      </Head>
      <Component {...pageProps} />
    </FormDataProvider>
  );
};

export default appWithTranslation(MyApp);
