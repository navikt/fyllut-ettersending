import "@navikt/ds-css";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { KeyValue, NavUnit } from "../data/domain";
import Layout from "../components/layout/layout";
import OtherDocument from "../components/other-document/other-document";
import { fetchArchiveSubjects, fetchNavUnits } from "../api/apiClient";
import { GetServerSidePropsContext } from "next/types";
import ButtonGroup from "src/components/button/buttonGroup";
import { ButtonText, Paths } from "src/data/text";
import { ButtonType } from "src/components/button/buttonGroupElement";
import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { useReffererPage } from "src/hooks/useReferrerPage";

interface Props {
  tema?: string;
}

const Lospost: NextPage<Props> = ({ tema }) => {
  const [archiveSubjects, setArchiveSubjects] = useState<KeyValue>({});
  const [navUnits, setNavUnits] = useState<NavUnit[]>([]);
  const referrerPage = useReffererPage();

  const nextButton: ButtonType = {
    text: ButtonText.next,
    path: Paths.downloadPage,
    validateForm: true,
    icon: <ArrowRightIcon aria-hidden />,
    iconPosition: "right",
  };

  const previousButton: ButtonType = {
    text: ButtonText.previous,
    variant: "secondary",
    icon: <ArrowLeftIcon aria-hidden />,
    path: referrerPage,
    external: true,
  };

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
    <Layout title="Sende dokumenter til NAV" backUrl={referrerPage}>
      <OtherDocument archiveSubjects={archiveSubjects} navUnits={navUnits} subject={tema} />
      <ButtonGroup buttons={[nextButton, ...(referrerPage ? [previousButton] : [])]} />
      <ButtonGroup
        center={!!referrerPage}
        buttons={[
          {
            text: ButtonText.cancel,
            path: Paths.base,
            variant: "tertiary",
          },
        ]}
      />
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { tema } = context.query as { tema: string };
  if (tema) {
    return { props: { tema } };
  }
  return { props: {} };
}

export default Lospost;
