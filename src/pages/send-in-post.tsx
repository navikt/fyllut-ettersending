import type { NextPage } from "next";
import Head from "next/head";
import { GetServerSidePropsContext } from "next/types";
import Layout from "../components/layout/layout";
import Header from "../components/header/header";
import Content from "../components/content/content";
import "@navikt/ds-css";
import {
  BodyLong,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  Label,
  Link as NavLink,
  Radio,
  RadioGroup,
  Search,
  Select,
} from "@navikt/ds-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formDummy } from "../data/FormDummy";

interface HomeProps {
  enheter: any[];
}

const SendInPost: NextPage<HomeProps> = (props) => {
  const { enheter } = props;
  const router = useRouter();
  const [submissionType, setSubmissionType] = useState("ettersende-vedlegg");
  const [showSearch, setShowSearch] = useState(false);
  const [showAttachmentsToSend, setShowAttachmentsToSend] = useState(false);

  useEffect(() => {
    console.log(submissionType);
    switch (submissionType) {
      case "ettersende-vedlegg":
        setShowSearch(true);
        break;
      default:
        setShowSearch(false);
    }
  }, [submissionType]);

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
            Sende dokumentasjon i posten
          </Heading>

          <RadioGroup
            legend="Hva gjelder innsendingen?"
            size="medium"
            onChange={(val: any) => setSubmissionType(val)}
            value={submissionType}
          >
            <Radio value="ettersende-vedlegg">Jeg skal ettersende vedlegg til en tidligere innsendt søknad</Radio>
            <Radio value="sende-annen-dok">Jeg skal sende annen dokumentasjon til NAV</Radio>
          </RadioGroup>

          {showSearch && (
            <>
              <Label spacing>Oppgi hvilken søknad du vil ettersende dokumentasjon til?</Label>

              <Select label="skjemanummersøk" size="medium">
                  {formDummy.map((data, index) => (
                      <option value={index}>{data.id + " " + data.navn}</option>
                  ))}
              </Select>
            </>
          )}

          {showAttachmentsToSend && (
            <CheckboxGroup
              legend="Velg vedlegg du skal ettersende"
              onChange={(val: any[]) => console.log(val)}
              size="medium"
            >
              <Checkbox value="res1">Result 1 From array</Checkbox>
              <Checkbox value="res2">Result 2 From array</Checkbox>
            </CheckboxGroup>
          )}
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

export default SendInPost;
