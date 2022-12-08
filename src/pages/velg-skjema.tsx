import "@navikt/ds-css";
import { Radio, RadioGroup } from "@navikt/ds-react";
import type { NextPage } from "next";
import { GetServerSidePropsContext } from "next/types";
import { useEffect, useState } from "react";
import { getArchiveSubjects, getForms, getNavUnits } from "../api/apiService";
import { Form, KeyValue, NavUnit } from "../data/domain";
import FormSearch from "../components/search/formSearch";
import { useFormState } from "../data/appState";
import Section from "../components/section/section";
import Layout from "../components/layout/layout";
import OtherDocumentation from "../components/other-documentation/other-documentation";

interface Props {
  forms: Form[];
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
}

enum SubmissionType {
  documentationToForm = "documentationToForm",
  otherDocumentation = "otherDocumentation",
}

const VelgSkjema: NextPage<Props> = (props) => {
  const {forms, archiveSubjects, navUnits} = props;
  const [submissionType, setSubmissionType] = useState<SubmissionType>();
  const {resetFormData} = useFormState();

  useEffect(() => {
    resetFormData();
  }, []);

  return (
    <Layout title="Ettersende dokumentasjon i posten">
      <Section>
        <RadioGroup
          legend="Hva gjelder innsendingen?"
          size="medium"
          onChange={(value) => setSubmissionType(value)}
        >
          <Radio name={SubmissionType.documentationToForm} value={SubmissionType.documentationToForm}>
            Jeg skal ettersende vedlegg til en tidligere innsendt søknad
          </Radio>
          <Radio name={SubmissionType.otherDocumentation} value={SubmissionType.otherDocumentation}>
            Jeg skal sende annen dokumentasjon til NAV
          </Radio>
        </RadioGroup>
      </Section>

      {submissionType === SubmissionType.documentationToForm && (
        <FormSearch forms={forms} />
      )}
      {submissionType === SubmissionType.otherDocumentation && (
        <OtherDocumentation archiveSubjects={archiveSubjects} navUnits={navUnits} />
      )}
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res } = context;
  res.setHeader(
    "Cache-Control",
    "public, maxage=1800"
  );

  const forms = await getForms();
  const archiveSubjects = await getArchiveSubjects();
  const navUnits = await getNavUnits();

  return {
    props: {forms, archiveSubjects, navUnits},
  };
}

export default VelgSkjema;
