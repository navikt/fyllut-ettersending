import "@navikt/ds-css";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { KeyValue, NavUnit } from "../data/domain";
import Layout from "../components/layout/layout";
import OtherDocument from "../components/other-document/other-document";
import { fetchArchiveSubjects, fetchNavUnits } from "../api/apiClient";

interface Props {}

const Lospost: NextPage<Props> = () => {
  const [archiveSubjects, setArchiveSubjects] = useState<KeyValue>({});
  const [navUnits, setNavUnits] = useState<NavUnit[]>([]);

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
    <Layout title="Sende inn dokumentasjon">
      <OtherDocument archiveSubjects={archiveSubjects} navUnits={navUnits} />
    </Layout>
  );
};

export default Lospost;
