import type { NextPage } from "next";
import Head from "next/head";
import { GetServerSidePropsContext } from "next/types";
import Layout from "../components/layout/layout";
import Header from "../components/header/header";
import Content from "../components/content/content";
import Panel from "../components/panel/panel";
import "@navikt/ds-css";
import { BodyLong, Button, Heading, Label, Link as NavLink } from "@navikt/ds-react";
import Link from "next/link";
import { useRouter } from "next/router";

interface HomeProps {
  enheter: any[];
}

const Home: NextPage<HomeProps> = (props) => {
  const { enheter } = props;
  const router = useRouter();

  return (
    <>
      <Head>
        <title>FyllUt :: Ettersending</title>
        <meta name="description" content="Ettersending av vedlegg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Layout>
        <Content>
          <NavLink href="#">Tilbake</NavLink>
          <Heading spacing level="2" size="large">
            Innsendingsvalg
          </Heading>

          <BodyLong>
            Du kan ettersende dokumentasjonen ved å laste den opp på Min Side / DittNAV eller sende det i posten.
          </BodyLong>

          <div className="button-group">
            <Button variant="primary" onClick={() => router.push("/upload-my-page")} size="medium">
              Last opp på Min Side
            </Button>

            <Button variant="secondary" onClick={() => router.push("/send-in-post")} size="medium">
              Send i posten
            </Button>
          </div>
        </Content>

        <Content>
          <Heading spacing size="large" level="2">
            Innsendingsvalg
          </Heading>
          Tester integrasjon mot FyllUt med{" "}
          <a href="https://doc.nais.io/clusters/service-discovery/">Kubernetes Service Discovery</a>: {enheter.length}{" "}
          enheter hentet
        </Content>
      </Layout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params, req, res } = context;

  console.log("Server: params", params, process.env.FYLLUT_BASE_URL);
  // Følgende fetch må kjøres på server i gcp siden vi bruker Kubernetes service discovery
  // (dvs. FYLLUT_BASE_URL er en url som refererer til fylluts applikasjonsnavn i gcp)
  // const data = await fetch(`${process.env.FYLLUT_BASE_URL}/api/enhetsliste`)
  // console.log(data);
  // const enheter = await data.json()
  const enheter = "Test";
  // console.log(`Server: fetched ${enheter.length} enheter...`)

  return {
    props: { enheter },
  };
}

export default Home;
