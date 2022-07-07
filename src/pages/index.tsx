import type { NextPage } from 'next'
import Head from 'next/head'
import { GetServerSidePropsContext } from "next/types";
import Layout from "../components/layout/layout";
import Header from "../components/header/header";
import Content from "../components/content/content";
import { Heading } from "@navikt/ds-react";

interface HomeProps {
  enheter: any[];
}

const Home: NextPage<HomeProps> = (props) => {
  const { enheter } = props
  return (
    <>
      <Head>
        <title>FyllUt :: Ettersending</title>
        <meta name="description" content="Ettersending av vedlegg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Header>
          <Heading spacing size="xlarge" level="1">
            Ettersende dokumentasjon
          </Heading>
        </Header>

        <Content>
          <Heading spacing size="large" level="2">
            Innsendingsvalg
          </Heading>
          Tester integrasjon mot FyllUt med <a href="https://doc.nais.io/clusters/service-discovery/">Kubernetes Service Discovery</a>: {enheter.length} enheter hentet
        </Content>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params, req, res } = context

  console.log("Server: params", params, process.env.FYLLUT_BASE_URL)
  // Følgende fetch må kjøres på server i gcp siden vi bruker Kubernetes service discovery
  // (dvs. FYLLUT_BASE_URL er en url som refererer til fylluts applikasjonsnavn i gcp)
  const data = await fetch(`${process.env.FYLLUT_BASE_URL}/api/enhetsliste`)
  console.log(data);
  const enheter = await data.json()
  console.log(`Server: fetched ${enheter.length} enheter...`)

  return {
    props: { enheter },
  }
}

export default Home
