import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import ButtonGroup from "../components/button/buttonGroup";
import { Paths, ButtonText } from "../api/domain";
import { Components, fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";

interface Props {
  decorator: Components;
}

const Home: NextPage<Props> = ({decorator}: Props) => {

  return (
    <>
      <decorator.Header />
      <Heading spacing size="large" level="2">
        Innsendingsvalg
      </Heading>xde

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

export async function getServerSideProps() {

  const decorator = await fetchDecoratorReact({
    env: process.env.NODE_ENV === "production" ? "prod" : "dev",
    simple: true,
    chatbot: false
  });

  return { props: { decorator: JSON.parse(JSON.stringify(decorator)) }};
}

export default Home;
