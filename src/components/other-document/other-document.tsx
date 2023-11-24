import '@navikt/ds-css';
import { Ingress } from '@navikt/ds-react';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useFormState } from 'src/data/appState';
import { KeyValue, NavUnit } from '../../data/domain';
import ChooseUser from '../submission/chooseUser';
import SubjectOfSubmission from '../submission/subjectOfSubmission';
import styles from './other-document.module.css';

interface Props {
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
  subject?: string;
}

const OtherDocument: NextPage<Props> = (props) => {
  const { t } = useTranslation('lospost');
  const { formData } = useFormState();

  const { archiveSubjects, navUnits, subject } = props;

  const chosenSubject = subject ? subject : formData.subjectOfSubmission;

  // If subject is TIL (tiltak), we don't need to render the radio buttons
  const shouldRenderRadioButtons = chosenSubject !== 'TIL';

  // If subject is TIL (tiltak), we only want fylke, lokal and tiltak units
  const navUnitOptions = () => {
    let options: NavUnit[] | undefined;

    if (chosenSubject === 'TIL') {
      const tiltakUnitTypes = ['FYLKE', 'LOKAL', 'TILTAK'];
      options = navUnits?.filter((navUnit) => tiltakUnitTypes.includes(navUnit.type)) ?? [];
    } else {
      options = navUnits;
    }

    return options?.sort((a, b) => (a.name > b.name ? 1 : -1)).map((navUnit) => navUnit.name) ?? [];
  };

  return (
    <>
      <Ingress className={styles.ingress}>{t('ingress', { interpolation: { escapeValue: false } })}</Ingress>
      <SubjectOfSubmission archiveSubjects={archiveSubjects} subject={subject} />
      <ChooseUser navUnitOptions={navUnitOptions()} shouldRenderRadioButtons={shouldRenderRadioButtons} />
    </>
  );
};

export default OtherDocument;
