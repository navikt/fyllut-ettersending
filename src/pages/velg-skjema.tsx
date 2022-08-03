import "@navikt/ds-css";
import { Heading, Radio, RadioGroup } from "@navikt/ds-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import { getArchiveSubjects, getForms, getNavUnits } from "../api/apiService";
import { ButtonText, Form, KeyValue, NavUnit, Paths } from "../api/domain";
import ButtonGroup from "../components/button/ButtonGroup";
import FormSearch from "../components/search/formSearch";
import SubjectOfSubmission from "../components/submission/subjectOfSubmission";
import SubmissionRadioGroup from "../components/submission/submissionRadioGroup";
import { useFormData } from "../data/appState";

interface Props {
  forms: Form[];
  archiveSubjects: KeyValue[];
  navUnits: NavUnit[];
}

const VelgSkjema: NextPage<Props> = (props) => {
  enum SubmissionType {
    forwardAttachment = "forward-attachment",
    sendAnotherDoc = "send-another-doc",
  }

  const { forms, archiveSubjects, navUnits } = props;
  const [submissionType, setSubmissionType] = useState(SubmissionType.forwardAttachment);
  const { formData, setFormData } = useFormData();

  const updateFormData = (key: string, data: any) => {
    console.log("data", data);
    setFormData({ ...formData, [key]: data });
  };

  return (
    <>
      <div className="section">
        <Heading spacing size="large" level="2">
          Sende dokumentasjon i posten
        </Heading>
      </div>

      <div className="section">
        <RadioGroup
          legend="Hva gjelder innsendingen?"
          size="medium"
          onChange={(val: any) => setSubmissionType(val)}
          value={submissionType}
        >
          <Radio value={SubmissionType.forwardAttachment}>
            Jeg skal ettersende vedlegg til en tidligere innsendt søknad
          </Radio>
          <Radio value={SubmissionType.sendAnotherDoc}>Jeg skal sende annen dokumentasjon til NAV</Radio>
        </RadioGroup>
      </div>

      {submissionType === SubmissionType.forwardAttachment && <FormSearch forms={forms} />}

      {submissionType === SubmissionType.sendAnotherDoc && (
        <>
          <SubjectOfSubmission archiveSubjects={archiveSubjects} formData={formData} updateFormData={updateFormData} />

          <SubmissionRadioGroup updateFormData={updateFormData} formData={formData} navUnits={navUnits} />

          <ButtonGroup
            primaryBtnPath={Paths.downloadPage}
            primaryBtnText={ButtonText.next}
            secondaryBtnText={ButtonText.cancel}
          />
        </>
      )}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const forms = await getForms();
  const archiveSubjects = await getArchiveSubjects();
  const navUnits = await getNavUnits();

  return {
    props: { forms, archiveSubjects, navUnits },
  };
}

export default VelgSkjema;
