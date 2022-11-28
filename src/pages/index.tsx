import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyLong, Heading } from "@navikt/ds-react";
import ButtonGroup from "../components/button/buttonGroup";
import { ButtonText, Paths } from "../api/domain";
import Section from "../components/section/section";

const Home: NextPage = () => {
  return (
    <>
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
        }, {
          text: ButtonText.sendViaPost,
          path: Paths.selectForm,
          variant: "tertiary"
        }]}
      />
    </>
  );
};

export default Home;
