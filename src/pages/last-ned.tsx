import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
import { useFormData } from "../data/appState";
import { download } from "../api/frontPageService";
import { GetServerSidePropsContext } from "next/types";

interface Props {
  url: string;
}

const LastNed: NextPage<Props> = ({url}: Props) => {
  const { formData } = useFormData();

  return (
    <>
      <div className="section">
        <Heading spacing size="large" level="2">
          Sende dokumentasjon i posten
        </Heading>
      </div>

      <div className="section">
        <Heading level="1" size="medium" spacing>
          1. Last ned førsteside til saken din
        </Heading>
        <BodyShort spacing>
          Førstesiden inneholder viktig informasjon som NAV trenger. Den skal sendes inn sammen med dokumentene dine.
        </BodyShort>
      </div>

      <div className="section">
        <Button variant="primary" onClick={() => {download(url, formData)}} size="medium">
          Last ned førsteside
        </Button>
      </div>

      <div className="section">
        <Heading level="1" size="medium" spacing>
          2. Disse dokumentene må du skaffe selv
        </Heading>

        <ul>
          <li>Vedlegg B</li>
          <li>Vedlegg X</li>
        </ul>
      </div>

      <div className="section">
        <Heading level="1" size="medium" spacing>
          4. Send dokumentene til NAV i posten
        </Heading>

        <BodyShort spacing>
          Samle alle vedleggene fra punkt 2 og 3. Legg førstesidearket fra punkt 1 øverst. Send det hele til adressen på
          førstesidearket.
        </BodyShort>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { url: process.env.FYLLUT_BASE_URL },
  };
}

export default LastNed;
