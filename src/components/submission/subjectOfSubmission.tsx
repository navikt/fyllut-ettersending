import { Label, Select, TextField } from "@navikt/ds-react";
import { FormData, KeyValue } from "../../api/domain";

interface Props {
  archiveSubjects: KeyValue;
  updateFormData: any;
  formData: FormData;
}

const SubjectOfSubmission = ({ archiveSubjects, updateFormData, formData  }: Props) => {
  return (
    <>
      <div className="section">
        <Label spacing>Hvilken dokumentasjon vil du sende til NAV?</Label>
      </div>

      <div className="section">
        <TextField label="Gi et beskrivende navn på dokumentasjonen du ønsker å laste opp." name="nameOfUploadedDocument" value={formData.nameOfUploadedDocument} size="medium" onChange={(evt) => updateFormData("nameOfUploadedDocument", evt.target.value)} error={formData.errors?.nameOfUploadedDocument}/>
      </div>

      <div className="section">
        <Select label="Velg tema for innsendingen" size="medium" name="subjectOfSubmission" value={formData.subjectOfSubmission} onChange={(evt) => updateFormData("subjectOfSubmission", archiveSubjects[evt.target.value])}>
          {Object.keys(archiveSubjects).map((subject, index) => (
            <option key={index} value={archiveSubjects[subject]}>{archiveSubjects[subject]}</option>
          ))}
          <option value="tema">tema</option>
        </Select>
      </div>
    </>
  );
};

export default SubjectOfSubmission;
