import type { NextPage } from "next";
import "@navikt/ds-css";
import { BodyShort, Button, Heading } from "@navikt/ds-react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { useFormState } from "../data/appState";
import { useState } from "react";
import Section from "../components/section/section";
import Layout from "../components/layout/layout";
import { downloadFrontpage } from "../api/apiClient";
import ButtonGroup from "src/components/button/buttonGroup";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { useRouter } from "next/router";
import { getServerSideTranslations } from "../utils/i18nUtil";
import { getCoverPageTitle } from "../utils/lastNedUtil";

interface Props {
  url: string;
}

const LastNed: NextPage<Props> = () => {
  const { formData } = useFormState();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation("last-ned");
  const { t: tCommon } = useTranslation("common");

  const isLospost = !formData.formId;
  const submissionType = isLospost ? "lospost" : "ettersending";

  const download = async () => {
    setLoading(true);
    const title = getCoverPageTitle(formData, t);
    try {
      await downloadFrontpage(formData, title, document.documentElement.lang);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={t(`title.${submissionType}`)}>
      <Section>
        <Heading level="2" size="medium" spacing>
          {t("section-top.title")}
        </Heading>
        <BodyShort spacing>
          {t("section-top.description")}
        </BodyShort>
      </Section>

      <Section>
        <Button variant="primary" onClick={download} size="medium" loading={loading}>
          {t("button.download-cover-page")}
        </Button>
      </Section>

      {formData.attachments && (
        <Section>
          <Heading level="2" size="medium" spacing>
            {t(`section-attachments.title.${formData.attachments.length > 1 ? "plural": "single"}`)}
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
          {t("section-last.title", {step: formData.attachments ? "3" : "2"})}
        </Heading>

        <BodyShort spacing>{t(`section-last.description.${submissionType}`)}</BodyShort>
      </div>
      <ButtonGroup
        buttons={[
          {
            text: tCommon("button.previous"),
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
            text: tCommon("button.exit"),
            path: process.env.NEXT_PUBLIC_NAV_URL || "https://nav.no",
            variant: "tertiary",
            external: true,
          },
        ]}
      />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({locale}) => {
  const translations = await getServerSideTranslations(locale, ["common", "last-ned"]);
  return {props: {...translations}};
}

export default LastNed;
