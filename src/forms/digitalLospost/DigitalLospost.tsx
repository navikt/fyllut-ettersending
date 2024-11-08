import { BodyLong, Skeleton, TextField, UNSAFE_Combobox } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { useFormState } from '../../data/appState';
import { SubjectsState } from './archiveSubjectsReducer';
import styles from './digitalLospost.module.css';

interface Props {
  subjects: SubjectsState;
}

const DigitalLospostForm = ({ subjects }: Props) => {
  const { t } = useTranslation('digital-lospost');
  const { updateFormData, formData, errors } = useFormState();

  const ingress = useCallback(() => {
    return (
      <BodyLong size="large" className={styles.ingress}>
        {t('ingress')}
      </BodyLong>
    );
  }, [t]);

  if (subjects.status !== 'ready') {
    return (
      <>
        {ingress()}
        <Skeleton height="15rem" />
      </>
    );
  }

  return (
    <>
      {ingress()}
      <TextField
        label={t('document-title.label')}
        description={t('document-title.description')}
        name="documentTitle"
        id="documentTitle"
        value={formData.documentTitle ?? ''}
        size="medium"
        onChange={(event) => updateFormData({ documentTitle: event.target.value })}
        error={errors.documentTitle}
        className={styles.input}
      />
      {!subjects.hidden && (
        <UNSAFE_Combobox
          label={t('subject.label')}
          options={subjects.options}
          id="subject"
          name="subject"
          error={errors.subject}
          isMultiSelect={false}
          selectedOptions={formData.subject ? [subjects.map[formData.subject.value]] : []}
          onToggleSelected={(option, isSelected) => {
            updateFormData({ subject: isSelected ? { value: option, label: subjects.map[option] } : undefined });
          }}
          className={styles.input}
        />
      )}
    </>
  );
};

export default DigitalLospostForm;
