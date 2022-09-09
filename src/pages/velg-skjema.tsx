import "@navikt/ds-css";
import { Heading, Radio, RadioGroup } from "@navikt/ds-react";
import type { NextPage } from "next";
import { GetServerSidePropsContext } from "next/types";
import { useEffect } from "react";
import { getArchiveSubjects, getForms, getNavUnits } from "../api/apiService";
import { ButtonText, Form, initFormData, KeyValue, NavUnit, Paths, VelgSkjemaSubmissionType } from "../api/domain";
import ButtonGroup from "../components/button/buttonGroup";
import FormSearch from "../components/search/formSearch";
import SubjectOfSubmission from "../components/submission/subjectOfSubmission";
import SubmissionRadioGroup from "../components/submission/submissionRadioGroup";
import { useFormData } from "../data/appState";
import { validateFormData } from "../utils/validator";
import { useRouter } from "next/router";

interface Props {
  forms: Form[];
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
}

const VelgSkjema: NextPage<Props> = (props) => {
  const { forms, archiveSubjects, navUnits } = props;
  const { formData, setFormData } = useFormData();
  const router = useRouter();

  useEffect(() => {});

  const updateFormData = (key: string, data: any) => {
    let updatedFormData = { ...formData, [key]: data };
    const errorMsg = validateFormData(updatedFormData);
    setFormData({ ...formData, [key]: data, errors: errorMsg });

    if (key === "velgSkjemaSubmissionType" && data === VelgSkjemaSubmissionType.sendAnotherDoc) {
      resetFormData(data);
    }
  };

  const onLinkPanelClicked = (clickedFormNumber: string) => {
    resetFormData(VelgSkjemaSubmissionType.forwardAttachment, clickedFormNumber);
    router.push(`detaljer/${clickedFormNumber}`);
  };

  const resetFormData = (_velgSkjemaSubmissionType: VelgSkjemaSubmissionType, clickedFormNumber?: string) => {
    switch (_velgSkjemaSubmissionType) {
      case VelgSkjemaSubmissionType.forwardAttachment:
        if (formData.formNumber && !(formData.formId === clickedFormNumber)) {
          setFormData({ ...initFormData(), velgSkjemaSubmissionType: _velgSkjemaSubmissionType });
        }
        break;
      case VelgSkjemaSubmissionType.sendAnotherDoc:
        if (formData.formId) {
          setFormData({ ...initFormData(), velgSkjemaSubmissionType: _velgSkjemaSubmissionType });
        }
        break;
    }
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

      {formData.velgSkjemaSubmissionType === VelgSkjemaSubmissionType.forwardAttachment && (
        <FormSearch forms={forms} onLinkPanelClicked={onLinkPanelClicked} />
      )}
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