import "@navikt/ds-css";
import { Loader, Radio, RadioGroup } from "@navikt/ds-react";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Form, KeyValue, NavUnit } from "../data/domain";
import FormSearch from "../components/search/formSearch";
import { useFormState } from "../data/appState";
import Section from "../components/section/section";
import Layout from "../components/layout/layout";
import OtherDocument from "../components/other-document/other-document";
import { fetchArchiveSubjects, fetchForms, fetchNavUnits } from "../api/apiClient";

interface Props {
  forms: Form[];
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
}

enum SubmissionType {
  documentationToForm = "documentationToForm",
  otherDocumentation = "otherDocumentation",
}

const Home: NextPage<Props> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [submissionType, setSubmissionType] = useState<SubmissionType>();
  const [forms, setForms] = useState<Form[]>([]);
  const [archiveSubjects, setArchiveSubjects] = useState<KeyValue>({});
  const [navUnits, setNavUnits] = useState<NavUnit[]>([]);
  const { resetFormData, formData } = useFormState();

  const fetchData = useCallback(async () => {
    const [formsResponse, archiveSubjectsResponse, navUnitsResponse] = await Promise.all([
      fetchForms(),
      fetchArchiveSubjects(),
      fetchNavUnits(),
    ]);
    setForms(formsResponse);
    setArchiveSubjects(archiveSubjectsResponse);
    setNavUnits(navUnitsResponse);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

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
    <Layout title="Sende inn dokumentasjon">
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
      {submissionType === SubmissionType.documentationToForm &&
        (loading ? (
          <div className="loader">
            <Loader size="xlarge" title="Henter data..." />
          </div>
        ) : (
          <FormSearch forms={forms} />
        ))}

      {submissionType === SubmissionType.otherDocumentation && (
        <OtherDocument archiveSubjects={archiveSubjects} navUnits={navUnits} />
      )}
    </Layout>
  );
};

export default Home;
