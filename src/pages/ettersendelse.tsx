import "@navikt/ds-css";
import { Loader } from "@navikt/ds-react";
import type { GetServerSideProps, NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Form } from "../data/domain";
import FormSearch from "../components/search/formSearch";
import Layout from "../components/layout/layout";
import { fetchForms } from "../api/apiClient";
import { Paths } from "src/data/text";
import { getServerSideTranslations } from "../utils/i18nUtil";
import { useTranslation } from "next-i18next";

interface Props {}

const Ettersendelse: NextPage<Props> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [forms, setForms] = useState<Form[]>([]);
  const { t } = useTranslation("ettersendelse");

  const fetchData = useCallback(async () => {
    const [formsResponse] = await Promise.all([fetchForms()]);
    setForms(formsResponse);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title={t("title")} backUrl={Paths.base}>
      {loading ? (
        <div className="loader">
          <Loader size="xlarge" title={t("loading-text")} />
        </div>
      ) : (
        <FormSearch forms={forms} />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  if (process.env.APP_ENV === "production") {
    return { notFound: true };
  }

  const translations = await getServerSideTranslations(locale, ["common", "ettersendelse"]);
  return { props: { ...translations } };
};

export default Ettersendelse;
