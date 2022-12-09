import { Select, TextField } from "@navikt/ds-react";
import { KeyValue } from "../../data/domain";
import Section from "../section/section";
import { useFormState } from "../../data/appState";

interface Props {
  archiveSubjects: KeyValue;
}

const SubjectOfSubmission = ({archiveSubjects}: Props) => {
  const {formData, updateFormData, errors} = useFormState();

  return (
    <>
      <Section>
        <TextField
          label="Hvilken dokumentasjon vil du sende til NAV?"
          description="Gi et beskrivende navn på dokumentasjonen du ønsker å laste opp."
          name="otherDocumentationTitle"
          value={formData.otherDocumentationTitle ?? ""}
          size="medium"
          onChange={(evt) => updateFormData({"otherDocumentationTitle": evt.target.value})}
          error={errors.otherDocumentation}
        />
      </Section>

      <Section>
        <Select
          label="Velg tema for innsendingen"
          size="medium"
          name="subjectOfSubmission"
          value={formData.subjectOfSubmission}
          error={errors.subjectOfSubmission}
          onChange={(evt) => {
            updateFormData({"subjectOfSubmission": evt.target.value});
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
