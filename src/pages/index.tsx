import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import { useRouter } from "next/router";

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

      <div className="button-group">
        <Button variant="primary" onClick={() => router.push("https://www.nav.no/person/dittnav/")} size="medium">
          Last opp på Min Side
        </Button>

        <Button variant="secondary" onClick={() => router.push("/velg-skjema")} size="medium">
          Send i posten
        </Button>
      </div>
    </>
  );
};

export default Home;
