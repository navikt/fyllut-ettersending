import type { AppProps } from "next/app"
import "./styles.css"
import Head from "next/head";
import Layout from "../components/layout/layout";
import { FormDataProvider } from "../data/appState";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <FormDataProvider>
      <Head>
        <title>FyllUt :: Ettersending</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FormDataProvider>
  )
}

export default MyApp
