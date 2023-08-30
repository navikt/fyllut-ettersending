import "@navikt/ds-css";
import type { NextPage } from "next";
import { KeyValue, NavUnit } from "../../data/domain";
import SubjectOfSubmission from "../submission/subjectOfSubmission";
import ChooseUser from "../submission/chooseUser";
import { Ingress } from "@navikt/ds-react";
import styles from "./other-document.module.css";

interface Props {
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
  subject?: string;
}

const OtherDocument: NextPage<Props> = (props) => {
  const { archiveSubjects, navUnits, subject } = props;

  return (
    <>
      <Ingress className={styles.ingress}>
        Når du skal sende dokumenter til NAV i posten må du bruke en førsteside for innsending. Fyll ut feltene nedenfor
        og klikk <b>Gå videre</b>. På neste side kan du laste ned førsteside til innsendingen din. Du trenger ikke ha
        dokumentene klare for å laste ned førsteside.
      </Ingress>
      <SubjectOfSubmission archiveSubjects={archiveSubjects} subject={subject} />
      <ChooseUser navUnits={navUnits} />
    </>
  );
};

export default OtherDocument;
