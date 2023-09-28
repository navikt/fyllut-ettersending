import "@navikt/ds-css";
import type { NextPage } from "next";
import { Form } from "../data/domain";
import FormSearch from "../components/search/formSearch";
import Layout from "../components/layout/layout";
import { Paths } from "src/data/text";
import { getServerSideTranslations } from "../utils/i18nUtil";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { getForms } from "src/api/apiService";

interface Props {
  forms: Form[];
}
const Ettersendelse: NextPage<Props> = (props: Props) => {
  const { t } = useTranslation("ettersendelse");

  return (
    <Layout title={t("title")} backUrl={Paths.base}>
      <FormSearch forms={props.forms} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  if (process.env.APP_ENV === "production") {
    return { notFound: true };
  }

  const translations = await getServerSideTranslations(locale, ["common", "ettersendelse"]);
  const forms = await getForms();

  return { props: { ...translations, forms }, revalidate: 120 };
};

export default Ettersendelse;
