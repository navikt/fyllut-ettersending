import "@navikt/ds-css";
import type { NextPage } from "next";
import { KeyValue, NavUnit } from "../../data/domain";
import SubjectOfSubmission from "../submission/subjectOfSubmission";
import ChooseUser from "../submission/chooseUser";
import ButtonGroup from "../button/buttonGroup";
import { Paths, ButtonText } from "../../data/text";

interface Props {
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
}

const OtherDocument: NextPage<Props> = (props) => {
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
          },
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
