import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import { useRouter } from "next/router";
import ButtonGroup from "../components/button/buttonGroup";
import { Paths, ButtonText } from "../api/domain";

const Home: NextPage = () => {
  const router = useRouter();

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
      />
    </>
  );
};

export default Home;
