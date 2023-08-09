import "@navikt/ds-css";
import { Loader } from "@navikt/ds-react";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Form } from "../data/domain";
import FormSearch from "../components/search/formSearch";
import Layout from "../components/layout/layout";
import { fetchForms } from "../api/apiClient";
import { getServerSideTranslations } from "../utils/i18nUtil";
import { GetStaticProps } from "next";

interface Props {}

const Ettersendelse: NextPage<Props> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [forms, setForms] = useState<Form[]>([]);

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
    <Layout title="Ettersende dokumentasjon">
      {loading ? (
        <div className="loader">
          <Loader size="xlarge" title="Henter data..." />
        </div>
      ) : (
        <FormSearch forms={forms} />
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({locale}) => {
  const translations = await getServerSideTranslations(locale, ["common"]);
  return {props: {...translations}};
}

export default Ettersendelse;
