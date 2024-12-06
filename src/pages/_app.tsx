import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import { FormDataProvider } from '../data/appState';
import { FormDataPage } from '../data/domain';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const page = (pageProps.page as FormDataPage) || 'other';
  const documentationTitlePrefix = (pageProps.gjelder as string) || undefined;
  return (
    <FormDataProvider page={page} documentationTitlePrefix={documentationTitlePrefix}>
      <Head>
        <title>Dokument til NAV - nav.no</title>
        <meta name="google-site-verification" content="TkSFJNNqsJLOyLN5yjG04ykxf61JTorXjhbEcYQkJd8" />
        {page !== 'lospost' && <meta name="robots" content="noindex" />}
        {page === 'lospost' && !!pageProps.tema && <link rel="canonical" href="/fyllut-ettersending/lospost" />}
      </Head>
      <Component {...pageProps} />
    </FormDataProvider>
  );
};

export default appWithTranslation(MyApp);
