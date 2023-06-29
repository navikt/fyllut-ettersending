import "@navikt/ds-css";
import type { NextPage } from "next";
import { KeyValue, NavUnit } from "../../data/domain";
import SubjectOfSubmission from "../submission/subjectOfSubmission";
import ChooseUser from "../submission/chooseUser";
import ButtonGroup from "../button/buttonGroup";
import { Paths, ButtonText } from "../../data/text";
import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { useRouter } from "next/router";
import { Ingress } from "@navikt/ds-react";
import styles from "./other-document.module.css";

interface Props {
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
  subject?: string;
}

const OtherDocument: NextPage<Props> = (props) => {
  const router = useRouter();

  const { archiveSubjects, navUnits, subject } = props;

  return (
    <>
      <Ingress className={styles.ingress}>
        Når du skal sende dokumenter til NAV i posten må du bruke en førsteside for innsending.
        Fyll ut feltene nedenfor og klikk <b>Gå videre</b>. På neste side kan du laste ned førsteside
        til innsendingen din. Du trenger ikke ha dokumentene klare for å laste ned førsteside.
      </Ingress>
      <SubjectOfSubmission archiveSubjects={archiveSubjects} subject={subject} />
      <ChooseUser navUnits={navUnits} />

      <ButtonGroup
        buttons={[
          {
            text: ButtonText.next,
            path: Paths.downloadPage,
            validateForm: true,
            icon: <ArrowRightIcon aria-hidden />,
            iconPosition: "right",
          },
          {
            text: ButtonText.previous,
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
            text: ButtonText.cancel,
            path: Paths.base,
            variant: "tertiary",
          },
        ]}
      />
    </>
  );
};

export default OtherDocument;
