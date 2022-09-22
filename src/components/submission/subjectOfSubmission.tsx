import { Label, Select, TextField } from "@navikt/ds-react";
import { FormData, KeyValue } from "../../api/domain";
import Section from "../section/section";

interface Props {
  archiveSubjects: KeyValue;
  updateFormData: any;
  formData: FormData;
}

const SubjectOfSubmission = ({ archiveSubjects, updateFormData, formData }: Props) => {
  return (
    <>
      <Section>
        <TextField
          label="Hvilken dokumentasjon vil du sende til NAV?"
          description="Gi et beskrivende navn på dokumentasjonen du ønsker å laste opp."
          name="nameOfUploadedDocument"
          value={formData.nameOfUploadedDocument}
          size="medium"
          onChange={(evt) => updateFormData("nameOfUploadedDocument", evt.target.value)}
          error={formData.errors?.nameOfUploadedDocument}
        />
      </Section>

      <Section>
        <Select
          label="Velg tema for innsendingen"
          size="medium"
          name="subjectOfSubmission"
          value={formData.subjectOfSubmission}
          error={formData.errors?.subjectOfSubmission}
          onChange={(evt) => {
            updateFormData("subjectOfSubmission", evt.target.value);
          }}
        >
          <option></option>
          {Object.keys(archiveSubjects)
            .sort((a, b) => (a > b ? 1 : -1))
            .map((subject, index) => (
              <option key={index} value={subject}>
                {archiveSubjects[subject]}
              </option>
            ))}
        </Select>
      </Section>
    </>
  );
};

export default SubjectOfSubmission;
