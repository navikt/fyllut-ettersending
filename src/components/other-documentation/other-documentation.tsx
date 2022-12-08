import "@navikt/ds-css";
import type { NextPage } from "next";
import { ButtonText, KeyValue, NavUnit, Paths } from "../../data/domain";
import SubjectOfSubmission from "../submission/subjectOfSubmission";
import ChooseUser from "../submission/chooseUser";
import ButtonGroup from "../button/buttonGroup";

interface Props {
  archiveSubjects: KeyValue;
  navUnits: NavUnit[];
}

const OtherDocumentation: NextPage<Props> = (props) => {
  const {archiveSubjects, navUnits} = props;

  return (
    <>
      <SubjectOfSubmission archiveSubjects={archiveSubjects} />
      <ChooseUser navUnits={navUnits}/>

      <ButtonGroup
        buttons={[{
          text: ButtonText.next,
          path: Paths.downloadPage,
          validateForm: true
        }, {
          text: ButtonText.cancel,
          path: Paths.base,
          variant: "tertiary"
        }]}
      />
    </>
  );
};

export default OtherDocumentation;
