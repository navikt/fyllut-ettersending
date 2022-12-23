import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
import { useFormState } from "../data/appState";
import { useState } from "react";
import Section from "../components/section/section";
import Layout from "../components/layout/layout";
import FileSaver from "file-saver";
import { getFileName } from "../utils/formDataUtil";

interface Props {
  url: string;
}

const attachmentsHeader = {
  single: "2. Dette dokumentet må du skaffe selv",
  plural: "2. Disse dokumentene må du skaffe selv"
};

const LastNed: NextPage<Props> = () => {
  const { formData } = useFormState();
  const [loading, setLoading] = useState<boolean>(false);

  const downloadFrontPage = async () => {
    setLoading(true);
    try {
      const b64 = await fetch("/api/download", {
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json; charset=utf8",
        },
        method: "POST",
      });
      FileSaver.saveAs(await b64.blob(), getFileName(formData));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Ettersende dokumentasjon i posten">
      <Section>
        <Heading level="2" size="medium" spacing>
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

      {
        formData.attachments && (
          <Section>
            <Heading level="2" size="medium" spacing>
              {formData.attachments.length > 1 ? attachmentsHeader.plural : attachmentsHeader.single }
            </Heading>
            <ul>
              {formData.attachments.map((attachment) => (
                <li key={attachment.key}>
                  {attachment.otherDocumentation ? formData.otherDocumentationTitle : attachment.label}
                </li>
              ))}
            </ul>
          </Section>
        )
      }

      <div className="lastSection">
        <Heading level="2" size="medium" spacing>
          {
            formData.attachments ? "3" : "2"
          }. Send dokumentene til NAV i posten
        </Heading>

        <BodyShort spacing>
          Samle alle vedleggene fra punkt 2 og 3. Legg førstesidearket fra punkt 1 øverst. Send det hele til adressen på
          førstesidearket.
        </BodyShort>
      </div>
    </Layout>
  );
};

export default LastNed;
