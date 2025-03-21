import { TextField, UNSAFE_Combobox } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { KeyValue, UserType } from '../../data';
import { useFormState } from '../../data/appState';
import Section from '../section/section';

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
  const { t, i18n } = useTranslation('lospost');

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
        userData: { type: subject === 'TIL' ? UserType.other : formData.userData?.type },
      });
    }
  }, [archiveSubjects, formData.subjectOfSubmission, formData.userData?.type, subject, updateFormData]);

  useEffect(() => {
    if (formData.subjectOfSubmission) {
      const subjectDescription = archiveSubjects[formData.subjectOfSubmission];
      if (formData.titleOfSubmission !== subjectDescription) {
        updateFormData({ titleOfSubmission: subjectDescription });
      }
    }
  }, [archiveSubjects, formData.subjectOfSubmission, formData.titleOfSubmission, i18n.language, updateFormData]);

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
        label={t('subject-of-submission.label')}
        options={options}
        name="subjectOfSubmission"
        id="subjectOfSubmission"
        error={errors.subjectOfSubmission}
        isMultiSelect={false}
        selectedOptions={formData.titleOfSubmission ? [formData.titleOfSubmission] : []}
        onToggleSelected={(option, isSelected) => {
          if (isSelected) {
            const subject = findKeyByValue(archiveSubjects, option);
            updateFormData({
              subjectOfSubmission: subject,
              titleOfSubmission: option,
              userData: { type: subject === 'TIL' ? UserType.other : formData.userData?.type },
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
          label={t('other-documentation-title.label')}
          description={t('other-documentation-title.description')}
          name="otherDocumentationTitle"
          id="otherDocumentationTitle"
          value={formData.otherDocumentationTitle ?? ''}
          size="medium"
          onChange={(evt) => updateFormData({ otherDocumentationTitle: evt.target.value })}
          error={errors.otherDocumentationTitle}
        />
      </Section>
      <Section>{renderCombobox()}</Section>
    </>
  );
};

export default SubjectOfSubmission;
