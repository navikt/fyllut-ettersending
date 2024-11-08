import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import { FormDataProvider } from '../data/appState';
import { FormDataPage } from '../data/domain';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const page = (pageProps.page as FormDataPage) || 'other';
  return (
    <FormDataProvider page={page}>
      <Head>
        <title>Dokument til NAV - nav.no</title>
        {page !== 'lospost' && <meta name="robots" content="noindex" />}
      </Head>
      <Component {...pageProps} />
    </FormDataProvider>
  );
};

export default appWithTranslation(MyApp);
