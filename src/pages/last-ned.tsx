import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
import { useFormData } from "../data/appState";
import { download } from "../api/frontPageService";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import Section from "../components/section/section";

interface Props {
  url: string;
}

const attachmentsHeader = {
  single: "2. Dette dokumentet må du skaffe selv",
  multiple: "2. Disse dokumentene må du skaffe selv"
};

const LastNed: NextPage<Props> = ({ url }: Props) => {
  const { formData } = useFormData();
  const [loading, setLoading] = useState<boolean>(false);

  const downloadFrontPage = async () => {
    setLoading(true);
    try {
      await download(url, formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Section>
        <Heading size="large" level="2">
          Sende dokumentasjon i posten
        </Heading>
      </Section>

      <Section>
        <Heading level="1" size="medium" spacing>
          1. Last ned førsteside til saken din
        </Heading>
        <BodyShort spacing>
          Førstesiden inneholder viktig informasjon som NAV trenger. Den skal sendes inn sammen med dokumentene dine.
        </BodyShort>
      </Section>

      <Section>
        <Button variant="primary" onClick={downloadFrontPage} size="medium" loading={loading}>
          Last ned førsteside
        </Button>
      </Section>

      <Section>
        <Heading level="1" size="medium" spacing>
          {formData.attachments.length > 1 ? attachmentsHeader.multiple : attachmentsHeader.single }
        </Heading>
        <ul>
          {formData.attachments?.map((attachment, index) => (
            <li key={index}>{attachment}</li>
          ))}
        </ul>
      </Section>

      <div className="lastSection">
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
