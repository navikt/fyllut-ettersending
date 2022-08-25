import "@navikt/ds-css";
import { Button, Heading, Radio, RadioGroup } from "@navikt/ds-react";
import type { NextPage } from "next";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import { getArchiveSubjects, getForms, getNavUnits } from "../api/apiService";
import { ButtonText, Form, KeyValue, NavUnit, Paths, VelgSkjemaSubmissionType } from "../api/domain";
import ButtonGroup from "../components/button/buttonGroup";
import FormSearch from "../components/search/formSearch";
import SubjectOfSubmission from "../components/submission/subjectOfSubmission";
import SubmissionRadioGroup from "../components/submission/submissionRadioGroup";
import { useFormData } from "../data/appState";

interface Props {
  forms: Form[];
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
}

const VelgSkjema: NextPage<Props> = (props) => {
  const { forms, archiveSubjects, navUnits } = props;
  const { formData, setFormData } = useFormData();

  const updateFormData = (key: string, data: any) => {
    console.log("formdatavalue", data);
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
          onChange={(value) => updateFormData("velgSkjemaSubmissionType", value)}
          value={formData.velgSkjemaSubmissionType}
        >
          <Radio name={VelgSkjemaSubmissionType.forwardAttachment} value={VelgSkjemaSubmissionType.forwardAttachment}>
            Jeg skal ettersende vedlegg til en tidligere innsendt søknad
          </Radio>
          <Radio name={VelgSkjemaSubmissionType.sendAnotherDoc} value={VelgSkjemaSubmissionType.sendAnotherDoc}>
            Jeg skal sende annen dokumentasjon til NAV
          </Radio>
        </RadioGroup>
      </div>

      {formData.velgSkjemaSubmissionType === VelgSkjemaSubmissionType.forwardAttachment && <FormSearch forms={forms} />}

      {formData.velgSkjemaSubmissionType === VelgSkjemaSubmissionType.sendAnotherDoc && (
        <>
          <SubjectOfSubmission archiveSubjects={archiveSubjects} formData={formData} updateFormData={updateFormData} />
          <SubmissionRadioGroup updateFormData={updateFormData} formData={formData} navUnits={navUnits} />

          <ButtonGroup
            primaryBtnPath={Paths.downloadPage}
            primaryBtnText={ButtonText.next}
            secondaryBtnText={ButtonText.cancel}
            validate
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
