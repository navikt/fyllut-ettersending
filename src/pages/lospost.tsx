import "@navikt/ds-css";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { KeyValue, NavUnit } from "../data/domain";
import Layout from "../components/layout/layout";
import OtherDocument from "../components/other-document/other-document";
import { fetchArchiveSubjects, fetchNavUnits } from "../api/apiClient";
import { GetServerSidePropsContext } from "next/types";
import { getServerSideTranslations } from "../utils/i18nUtil";
import { useTranslation } from "next-i18next";

interface Props {
  tema?: string;
}

const Lospost: NextPage<Props> = ({tema}) => {
  const [archiveSubjects, setArchiveSubjects] = useState<KeyValue>({});
  const [navUnits, setNavUnits] = useState<NavUnit[]>([]);
  const { t } = useTranslation("lospost");

  const fetchData = useCallback(async () => {
    const [archiveSubjectsResponse, navUnitsResponse] = await Promise.all([fetchArchiveSubjects(), fetchNavUnits()]);
    setArchiveSubjects(archiveSubjectsResponse);
    setNavUnits(navUnitsResponse);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title={t("title")}>
      <OtherDocument archiveSubjects={archiveSubjects} navUnits={navUnits} subject={tema} />
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {tema} = context.query as {tema: string};
  const translations = await getServerSideTranslations(context.locale, ["lospost", "common", "validator"]);
  if (tema) {
    return {props: {tema, ...translations}};
  }
  return {props: {...translations}};
}

export default Lospost;
