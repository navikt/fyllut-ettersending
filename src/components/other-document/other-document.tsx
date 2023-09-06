import "@navikt/ds-css";
import type { NextPage } from "next";
import { KeyValue, NavUnit } from "../../data/domain";
import SubjectOfSubmission from "../submission/subjectOfSubmission";
import ChooseUser from "../submission/chooseUser";
import { Ingress } from "@navikt/ds-react";
import styles from "./other-document.module.css";
import { useTranslation } from "next-i18next";

interface Props {
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
  subject?: string;
}

const OtherDocument: NextPage<Props> = (props) => {
  const { t } = useTranslation("lospost");

  const { archiveSubjects, navUnits, subject } = props;

  return (
    <>
      <Ingress className={styles.ingress}>
        {t("ingress", {interpolation: {escapeValue: false}})}
      </Ingress>
      <SubjectOfSubmission archiveSubjects={archiveSubjects} subject={subject} />
      <ChooseUser navUnits={navUnits} />
    </>
  );
};

export default OtherDocument;
