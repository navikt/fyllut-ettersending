import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyLong, Heading } from "@navikt/ds-react";
import ButtonGroup from "../components/button/buttonGroup";
import { ButtonText, Paths } from "../api/domain";

const Home: NextPage = () => {

  return (
    <>
      <Heading spacing size="large" level="2">
        Innsendingsvalg
      </Heading>

      <BodyLong>
        Du kan ettersende dokumentasjonen ved å laste den opp på Min Side / DittNAV eller sende det i posten.
      </BodyLong>

      <ButtonGroup
        primaryBtnPath={Paths.navMyPage}
        primaryBtnText={ButtonText.uploadToMyPage}
        secondaryBtnText={ButtonText.sendViaPost}
        secondaryBtnPath={Paths.selectForm}
        validate={false}
      />
    </>
  );
};

export default Home;
