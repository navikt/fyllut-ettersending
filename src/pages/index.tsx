import type { NextPage } from "next";
import { BodyLong, Heading } from "@navikt/ds-react";
import ButtonGroup from "../components/button/buttonGroup";
import { ButtonText, Paths } from "../data/domain";
import Section from "../components/section/section";
import Layout from "../components/layout/layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Heading spacing size="large" level="2">
        Innsendingsvalg
      </Heading>

      <Section>
        <BodyLong>
          Du kan ettersende dokumentasjonen ved å laste den opp på Min Side / DittNAV eller sende det i posten.
        </BodyLong>
      </Section>

      <ButtonGroup
        buttons={[{
          text: ButtonText.uploadToMyPage,
          path: Paths.navMyPage,
          external: true,
        }, {
          text: ButtonText.sendViaPost,
          path: Paths.selectForm,
          variant: "tertiary"
        }]}
      />
    </Layout>
  );
};

export default Home;
