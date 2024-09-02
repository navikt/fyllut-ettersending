import { BodyLong, Skeleton, TextField, UNSAFE_Combobox } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useReducer } from 'react';
import { fetchArchiveSubjects } from '../../api/apiClient';
import { useFormState } from '../../data/appState';
import archiveSubjectsReducer from './archiveSubjectsReducer';
import styles from './digitalLospost.module.css';

interface Props {
  subject?: string;
}

const INVALID_SUBJECTS = ['TIL', 'PER'];

const DigitalLospostForm = ({ subject }: Props) => {
  const { t } = useTranslation('digital-lospost');
  const router = useRouter();
  const { updateFormData, formData, errors } = useFormState();
  const [subjects, dispatch] = useReducer(archiveSubjectsReducer, { status: 'init' }, (state) => state);

  const fetchData = useCallback(async () => {
    const archiveSubjectsResponse = await fetchArchiveSubjects();
    INVALID_SUBJECTS.forEach((code) => delete archiveSubjectsResponse[code]);
    const hideSubjectsCombobox = subject ? !!archiveSubjectsResponse[subject] : false;
    dispatch({ type: 'set', subjects: archiveSubjectsResponse, hidden: hideSubjectsCombobox });
    if (hideSubjectsCombobox) {
      updateFormData({ subject: { value: subject!, label: archiveSubjectsResponse[subject!] } });
    } else if (subject) {
      const { pathname } = router;
      router.replace(pathname, undefined, { shallow: true }).then();
    }
  }, [router, subject, updateFormData]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
