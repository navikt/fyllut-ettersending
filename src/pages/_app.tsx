import type { AppProps } from "next/app"
import "./styles.css"
import Head from "next/head";
import Layout from "../components/layout/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>FyllUt :: Ettersending</title>
        <meta name="description" content="Ettersending dokumentasjon"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp
