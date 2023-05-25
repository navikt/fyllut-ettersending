import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
import { useFormState } from "../data/appState";
import { useState } from "react";
import Section from "../components/section/section";
import Layout from "../components/layout/layout";
import { downloadFrontpage } from "../api/apiClient";

interface Props {
  url: string;
}

const texts = {
  title: {
    formDocumentation: "Ettersende dokumentasjon i posten",
    otherDocumentation: "Sende inn dokumentasjon",
  },
  attachmentsHeader: {
    single: "2. Finn frem følgende dokument",
    plural: "2. Finn frem følgende dokumenter",
  },
  lastSectionBody: {
    formDocumentation:
      "Legg førstesidearket fra punkt 1 på toppen av dokumentene. Send det hele til adressen på førstesidearket.",
    otherDocumentation:
      "Legg førstesidearket fra punkt 1 på toppen av dokumentene du skal sende. Send det hele til adressen på førstesidearket.",
  },
};

const LastNed: NextPage<Props> = () => {
  const { formData } = useFormState();
  const [loading, setLoading] = useState<boolean>(false);

  const isOtherDocumentation = !formData.formId;
  const submissionType = isOtherDocumentation ? "otherDocumentation" : "formDocumentation";

  const download = async () => {
    setLoading(true);
    try {
      await downloadFrontpage(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={texts.title[submissionType]}>
      <Section>
        <Heading level="2" size="medium" spacing>
          1. Last ned førsteside til saken din
        </Heading>
        <BodyShort spacing>
          Førstesiden inneholder viktig informasjon som NAV trenger. Den skal sendes inn sammen med dokumentene dine.
        </BodyShort>
      </Section>

      <Section>
        <Button variant="primary" onClick={download} size="medium" loading={loading}>
          Last ned førsteside
        </Button>
      </Section>

      {formData.attachments && (
        <Section>
          <Heading level="2" size="medium" spacing>
            {formData.attachments.length > 1 ? texts.attachmentsHeader.plural : texts.attachmentsHeader.single}
          </Heading>
          <ul>
            {formData.attachments.map((attachment) => (
              <li key={attachment.key}>
                {attachment.otherDocumentation ? formData.otherDocumentationTitle : attachment.label}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="lastSection">
        <Heading level="2" size="medium" spacing>
          {formData.attachments ? "3" : "2"}. Send dokumentene til NAV i posten
        </Heading>

        <BodyShort spacing>{texts.lastSectionBody[submissionType]}</BodyShort>
      </div>
    </Layout>
  );
};

export default LastNed;
