import type { NextPage } from "next";
import { GetServerSidePropsContext } from "next/types";
import "@navikt/ds-css";
import { Checkbox, CheckboxGroup, Heading, } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { getArchiveSubjects, getForm, getNavUnits } from "../api/apiService";
import { Form, NavUnit } from "../api/domain";

interface Props {
  form: Form;
  navUnits: NavUnit[];
}

const Detaljer: NextPage<Props> = (props) => {
  const {form, navUnits} = props;
  const [submissionType, setSubmissionType] = useState("ettersende-vedlegg");
  const [showSearch, setShowSearch] = useState(false);
  const [showAttachmentsToSend, setShowAttachmentsToSend] = useState(false);

  useEffect(() => {
    switch (submissionType) {
      case "ettersende-vedlegg":
        setShowSearch(true);
        break;
      default:
        setShowSearch(false);
    }
  }, [submissionType]);

  return (
    <>
      <Heading spacing size="large" level="2">
        Sende dokumentasjon i posten
      </Heading>

      {showAttachmentsToSend && (
        <CheckboxGroup
          legend="Velg vedlegg du skal ettersende"
          onChange={(val: any[]) => console.log(val)}
          size="medium"
        >
          <Checkbox value="res1">Result 1 From array</Checkbox>
          <Checkbox value="res2">Result 2 From array</Checkbox>
        </CheckboxGroup>
      )}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const form = await getForm("lo0001"); // TODO: Legg inn form path.
  const navUnits = await getNavUnits();
  const archiveSubjects = {}; // await getArchiveSubjects();

  return {
    props: {
      form,
      navUnits,
      archiveSubjects,
    },
  };
}

export default Detaljer;
