import "@navikt/ds-css";
import { Radio, RadioGroup } from "@navikt/ds-react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { getArchiveSubjects, getForms, getNavUnits } from "../api/apiService";
import { Form, KeyValue, NavUnit } from "../data/domain";
import FormSearch from "../components/search/formSearch";
import { useFormState } from "../data/appState";
import Section from "../components/section/section";
import Layout from "../components/layout/layout";
import OtherDocument from "../components/other-document/other-document";

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
  const {resetFormData, formData} = useFormState();

  useEffect(() => {
    if (formData.formId) {
      resetFormData();
      setSubmissionType(SubmissionType.documentationToForm);
    } else if (Object.keys(formData).length !== 0) {
      setSubmissionType(SubmissionType.otherDocumentation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.formId]);

  return (
    <Layout title="Ettersende dokumentasjon i posten">
      <Section>
        <RadioGroup
          legend="Hva gjelder innsendingen?"
          size="medium"
          onChange={(value) => setSubmissionType(value)}
          value={submissionType ?? ""}
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
        <OtherDocument archiveSubjects={archiveSubjects} navUnits={navUnits} />
      )}
    </Layout>
  );
};

export async function getStaticProps () {
  const forms = await getForms();
  const archiveSubjects = await getArchiveSubjects();
  const navUnits = await getNavUnits();

  return {
    props: {forms, archiveSubjects, navUnits},
    revalidate: 30, // Revalidate every 30 sec
  };
}

export default VelgSkjema;
