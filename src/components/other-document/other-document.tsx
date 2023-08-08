import "@navikt/ds-css";
import type { NextPage } from "next";
import { KeyValue, NavUnit } from "../../data/domain";
import SubjectOfSubmission from "../submission/subjectOfSubmission";
import ChooseUser from "../submission/chooseUser";
import ButtonGroup from "../button/buttonGroup";
import { Paths } from "../../data/text";
import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { useRouter } from "next/router";
import { Ingress } from "@navikt/ds-react";
import styles from "./other-document.module.css";
import { useTranslation } from "next-i18next";

interface Props {
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
  subject?: string;
}

const OtherDocument: NextPage<Props> = (props) => {
  const router = useRouter();
  const { t } = useTranslation("lospost");
  const { t: tCommon } = useTranslation("common");

  const { archiveSubjects, navUnits, subject } = props;

  return (
    <>
      <Ingress className={styles.ingress}>
        {t("ingress", {interpolation: {escapeValue: false}})}
      </Ingress>
      <SubjectOfSubmission archiveSubjects={archiveSubjects} subject={subject} />
      <ChooseUser navUnits={navUnits} />

      <ButtonGroup
        buttons={[
          {
            text: tCommon("button.next"),
            path: Paths.downloadPage,
            validateForm: true,
            icon: <ArrowRightIcon aria-hidden />,
            iconPosition: "right",
          },
          {
            text: tCommon("button.previous"),
            variant: "secondary",
            icon: <ArrowLeftIcon aria-hidden />,
            onClick: (e) => {
              router.back();
              e.currentTarget.blur();
            },
          },
        ]}
      />
      <ButtonGroup
        center
        buttons={[
          {
            text: tCommon("button.cancel"),
            path: Paths.base,
            variant: "tertiary",
          },
        ]}
      />
    </>
  );
};

export default OtherDocument;
