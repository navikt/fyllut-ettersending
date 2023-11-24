import '@navikt/ds-css';
import { Ingress } from '@navikt/ds-react';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
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

  const { archiveSubjects, navUnits, subject } = props;

  return (
    <>
      <Ingress className={styles.ingress}>{t('ingress', { interpolation: { escapeValue: false } })}</Ingress>
      <SubjectOfSubmission archiveSubjects={archiveSubjects} subject={subject} />
      <ChooseUser navUnits={navUnits} subject={subject} />
    </>
  );
};

export default OtherDocument;
