import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import { FormDataProvider } from '../data/appState';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <FormDataProvider>
      <Head>
        <title>FyllUt :: Ettersending</title>
      </Head>
      <Component {...pageProps} />
    </FormDataProvider>
  );
};

export default appWithTranslation(MyApp);
