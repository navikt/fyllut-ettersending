import { Select, TextField } from "@navikt/ds-react";
import { KeyValue } from "../../data/domain";
import Section from "../section/section";
import { useFormState } from "../../data/appState";
import {useCallback, useEffect} from "react";
import {useTranslation} from "next-i18next";

interface Props {
  archiveSubjects: KeyValue;
  subject?: string;
}

const SubjectOfSubmission = ({ archiveSubjects, subject }: Props) => {
  const { formData, updateFormData, errors } = useFormState();
  const { t } = useTranslation("lospost");

  const updateSubjectInFormData = useCallback((subject: string) => {
    updateFormData({subjectOfSubmission: subject, titleOfSubmission: archiveSubjects[subject]});
  }, [archiveSubjects, updateFormData]);

  useEffect(() => {
    if (subject && Object.keys(archiveSubjects).length > 0 && subject !== formData.subjectOfSubmission) {
      updateSubjectInFormData(subject);
    }
  }, [archiveSubjects, formData.subjectOfSubmission, subject, updateSubjectInFormData])

  return (
    <>
      <Section>
        <TextField
          label={t("other-documentation-title.label")}
          description={t("other-documentation-title.description")}
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
            label={t("subject-of-submission.label")}
            size="medium"
            name="subjectOfSubmission"
            value={formData.subjectOfSubmission}
            error={errors.subjectOfSubmission}
            onChange={(evt) => updateSubjectInFormData(evt.target.value)}
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
