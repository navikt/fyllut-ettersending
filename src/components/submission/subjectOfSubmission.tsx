import { TextField } from "@navikt/ds-react";
import { KeyValue } from "../../data/domain";
import Section from "../section/section";
import { useFormState } from "../../data/appState";
import { useEffect, useMemo } from "react";
import { UNSAFE_Combobox } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

interface Props {
  archiveSubjects: KeyValue;
  subject?: string;
}

type KeyValueMap = {
  [key: string]: string;
};

const findKeyByValue = (obj: KeyValueMap, value: string): string | undefined => {
  return Object.keys(obj).find((key) => obj[key].toLowerCase() === value.toLowerCase());
};

// If subject is in query param and is valid -> update formData and don't render combobox
// If subject is in query param and is invalid -> render combobox
// If subject is not in query param -> render combobox
const SubjectOfSubmission = ({ archiveSubjects, subject }: Props) => {
  const { formData, updateFormData, errors } = useFormState();
  const { t } = useTranslation("lospost");

  const options = useMemo(() => {
    return Object.values(archiveSubjects).sort((a, b) => (a > b ? 1 : -1));
  }, [archiveSubjects]);

  // Update formdata from query param
  useEffect(() => {
    const subjectExistsAndIsValid = !!subject && !!Object.values(archiveSubjects).length && !!archiveSubjects[subject];

    if (subjectExistsAndIsValid && !formData.subjectOfSubmission) {
      updateFormData({
        subjectOfSubmission: subject,
        titleOfSubmission: archiveSubjects[subject],
      });
    }
  }, [archiveSubjects, formData.subjectOfSubmission, subject, updateFormData]);

  const renderCombobox = () => {
    const subjectExistsAndIsInvalid = !!subject && !!Object.values(archiveSubjects).length && !archiveSubjects[subject];

    if (!subject || subjectExistsAndIsInvalid) {
      return combobox();
    }

    return null;
  };

  const combobox = () => {
    return (
      <UNSAFE_Combobox
        label={t("subject-of-submission.label")}
        options={options}
        name="subjectOfSubmission"
        error={errors.subjectOfSubmission}
        isMultiSelect={false}
        selectedOptions={formData.titleOfSubmission ? [formData.titleOfSubmission] : []}
        onToggleSelected={(option, isSelected) => {
          if (isSelected) {
            updateFormData({
              subjectOfSubmission: findKeyByValue(archiveSubjects, option),
              titleOfSubmission: option,
            });
          } else {
            updateFormData({ subjectOfSubmission: undefined, titleOfSubmission: undefined });
          }
        }}
      />
    );
  };

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
      <Section>{renderCombobox()}</Section>
    </>
  );
};

export default SubjectOfSubmission;
