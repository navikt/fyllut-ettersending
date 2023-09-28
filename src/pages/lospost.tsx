import "@navikt/ds-css";
import type { GetStaticProps, NextPage } from "next";
import { KeyValue, NavUnit } from "../data/domain";
import Layout from "../components/layout/layout";
import OtherDocument from "../components/other-document/other-document";
import ButtonGroup from "src/components/button/buttonGroup";
import { Paths } from "src/data/text";
import { ButtonType } from "src/components/button/buttonGroupElement";
import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { useReffererPage } from "src/hooks/useReferrerPage";
import { getServerSideTranslations } from "../utils/i18nUtil";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { getArchiveSubjects, getNavUnits } from "src/api/apiService";

interface Props {
  navUnits: NavUnit[];
  archiveSubjects: KeyValue;
}

const Lospost: NextPage<Props> = (props: Props) => {
  const { t } = useTranslation("lospost");
  const { t: tCommon } = useTranslation("common");
  const referrerPage = useReffererPage();
  const router = useRouter();
  const tema = router.query.tema as string | undefined;

  const nextButton: ButtonType = {
    text: tCommon("button.next"),
    path: Paths.downloadPage,
    validateForm: true,
    icon: <ArrowRightIcon aria-hidden />,
    iconPosition: "right",
  };

  const previousButton: ButtonType = {
    text: tCommon("button.previous"),
    variant: "secondary",
    icon: <ArrowLeftIcon aria-hidden />,
    path: referrerPage,
    external: true,
  };

  return (
    <Layout title={t("title")} backUrl={referrerPage}>
      <OtherDocument archiveSubjects={props.archiveSubjects || {}} navUnits={props.navUnits || []} subject={tema} />
      <ButtonGroup buttons={[nextButton, ...(referrerPage ? [previousButton] : [])]} />
      <ButtonGroup
        center={!!referrerPage}
        buttons={[
          {
            text: tCommon("button.cancel"),
            path: Paths.base,
            variant: "tertiary",
          },
        ]}
      />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const [archiveSubjects, navUnits] = await Promise.all([getArchiveSubjects(), getNavUnits()]);
  const translations = await getServerSideTranslations(locale, ["lospost", "common", "validator"]);

  return { props: { ...translations, archiveSubjects, navUnits }, revalidate: 120 };
};

export default Lospost;
