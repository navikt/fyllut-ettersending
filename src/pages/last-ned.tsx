import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
import { useFormState } from "../data/appState";
import { useState } from "react";
import Section from "../components/section/section";
import Layout from "../components/layout/layout";
import { downloadFrontpage } from "../api/apiClient";
import ButtonGroup from "src/components/button/buttonGroup";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { ButtonText } from "src/data/text";
import { useRouter } from "next/router";

interface Props {
  url: string;
}

const texts = {
  title: {
    ettersending: "Ettersende dokumentasjon i posten",
    lospost: "Sende inn dokumentasjon",
  },
  attachmentsHeader: {
    single: "2. Finn frem følgende dokument",
    plural: "2. Finn frem følgende dokumenter",
  },
  lastSectionBody: {
    ettersending:
      "Legg førstesidearket fra punkt 1 på toppen av dokumentene. Send det hele til adressen på førstesidearket.",
    lospost:
      "Legg førstesidearket fra punkt 1 på toppen av dokumentene du skal sende. Send det hele til adressen på førstesidearket.",
  },
};

const LastNed: NextPage<Props> = () => {
  const { formData } = useFormState();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const isLospost = !formData.formId;
  const submissionType = isLospost ? "lospost" : "ettersending";

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
      <ButtonGroup
        buttons={[
          {
            text: ButtonText.previous,
            variant: "secondary",
            icon: <ArrowLeftIcon aria-hidden />,
            onClick: (e) => {
              router.back();
              e.currentTarget.blur();
            },
          },
        ]}
      />
      <ButtonGroup
        buttons={[
          {
            text: ButtonText.exit,
            path: process.env.NEXT_PUBLIC_NAV_URL || "https://nav.no",
            variant: "tertiary",
            external: true,
          },
        ]}
      />
    </Layout>
  );
};

export default LastNed;
