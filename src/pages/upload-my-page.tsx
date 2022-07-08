import type { NextPage } from "next";
import Head from "next/head";
import { GetServerSidePropsContext } from "next/types";
import Layout from "../components/layout/layout";
import Header from "../components/header/header";
import Content from "../components/content/content";
import Panel from "../components/panel/panel";
import "@navikt/ds-css";
import { BodyLong, Button, Heading, Link as NavLink } from "@navikt/ds-react";

interface HomeProps {
  enheter: any[];
}

const UploadToMyPage: NextPage<HomeProps> = (props) => {

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
          <NavLink href="/">Tilbake</NavLink>
          <Heading spacing size="large" level="3">
              Tittel
          </Heading>

        </Content>
      </Layout>
    </>
  );
};

export default UploadToMyPage;
