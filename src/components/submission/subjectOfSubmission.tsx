import { Select, TextField } from "@navikt/ds-react";
import { KeyValue } from "../../data/domain";
import Section from "../section/section";
import { useFormState } from "../../data/appState";
import {useEffect} from "react";

interface Props {
  archiveSubjects: KeyValue;
  subject?: string;
}

const SubjectOfSubmission = ({ archiveSubjects, subject }: Props) => {
  const { formData, updateFormData, errors } = useFormState();

  useEffect(() => {
    if (subject && Object.keys(archiveSubjects).length > 0) {
      updateFormData({subjectOfSubmission: subject, titleOfSubmission: archiveSubjects[subject]});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archiveSubjects, subject])

  return (
    <>
      <Section>
        <TextField
          label="Hvilken dokumentasjon vil du sende til NAV?"
          description="Gi et beskrivende navn på dokumentasjonen du ønsker å laste opp."
          name="otherDocumentationTitle"
          value={formData.otherDocumentationTitle ?? ""}
          size="medium"
          onChange={(evt) => updateFormData({ otherDocumentationTitle: evt.target.value })}
          error={errors.otherDocumentation}
        />
      </Section>

      { !subject &&
        <Section>
          <Select
            label="Velg tema for innsendingen"
            size="medium"
            name="subjectOfSubmission"
            value={formData.subjectOfSubmission}
            error={errors.subjectOfSubmission}
            onChange={(evt) => {
              updateFormData({
                subjectOfSubmission: evt.target.value,
                titleOfSubmission: archiveSubjects[evt.target.value],
              });
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
      }
    </>
  );
};

export default SubjectOfSubmission;
