import "@navikt/ds-css";
import type { NextPage } from "next";
import { KeyValue, NavUnit } from "../../data/domain";
import SubjectOfSubmission from "../submission/subjectOfSubmission";
import ChooseUser from "../submission/chooseUser";
import ButtonGroup from "../button/buttonGroup";
import { Paths, ButtonText } from "../../data/text";
import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { useRouter } from "next/router";

interface Props {
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
}

const OtherDocument: NextPage<Props> = (props) => {
  const router = useRouter();

  const { archiveSubjects, navUnits } = props;

  return (
    <>
      <SubjectOfSubmission archiveSubjects={archiveSubjects} />
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
