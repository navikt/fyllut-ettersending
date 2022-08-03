import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
import { useFormData } from "../data/appState";

interface Props {}

const UploadToMyPage: NextPage<Props> = (props) => {
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
        <Button variant="primary" onClick={() => console.log("formData", formData)} size="medium">
          Last ned førsteside
        </Button>
      </div>

      <div className="section">
        <Heading level="1" size="medium" spacing>
          2. Fyll ut og last ned vedleggskjema
        </Heading>
        <BodyShort spacing>
          Dette/disse skjemaet/skjemaene må du fylle ut, skrive ut og legge ved i denne innsendingen:
          <ul>
            <li>Søknad om førerhund (åpnes i ny fane)</li>
          </ul>
        </BodyShort>
      </div>

      <div className="section">
        <Heading level="1" size="medium" spacing>
          3. Disse dokumentene må du skaffe selv
        </Heading>

        <BodyShort spacing>
          <ul>
            <li>Vedlegg B</li>
            <li>Vedlegg X</li>
          </ul>
        </BodyShort>
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

export default UploadToMyPage;
