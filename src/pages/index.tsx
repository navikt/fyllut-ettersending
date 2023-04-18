import "@navikt/ds-css";
import { Button, Heading, BodyShort } from "@navikt/ds-react";
import type { NextPage } from "next";
import Section from "../components/section/section";
import Layout from "../components/layout/layout";
import { useRouter } from "next/router";
import { Paths } from "../data/text";

interface Props {}

const Home: NextPage<Props> = () => {
  const router = useRouter();

  const handleClick = async (path: string) => {
    await router.push(path);
  };

  return (
    <Layout title="Sende inn dokumentasjon">
      <Heading size="large" spacing={true}>
        Hva gjelder innsendingen?
      </Heading>

      <Section>
        <BodyShort spacing={true}>
          Velg “Ettersend vedlegg” hvis du skal ettersende dokumentasjon til en søknad du har sendt tidligere.
        </BodyShort>
        <Button variant="primary" onClick={() => handleClick(Paths.formDocumentation)}>
          Ettersend vedlegg
        </Button>
      </Section>

      <Section>
        <BodyShort spacing={true}>
          Velg “Annen dokumentasjon“ hvis du vil sende dokumentasjon som ikke er knyttet til en søknad.
        </BodyShort>
        <Button variant="primary" onClick={() => handleClick(Paths.otherDocumentation)}>
          Annen dokumentasjon
        </Button>
      </Section>
    </Layout>
  );
};

export default Home;
