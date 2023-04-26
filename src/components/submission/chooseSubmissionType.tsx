import Section from "../section/section";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { useFormState } from "../../data/appState";
import { SubmissionType } from "../../data/domain";

const ChooseSubmissionType = () => {
  const { formData, updateFormData, errors } = useFormState();

  return (
    <Section>
      <RadioGroup
        legend={"Vil du sende dokumentasjonen digitalt eller i posten?"}
        size="medium"
        onChange={(submissionType: SubmissionType) => {
          updateFormData({
            submissionType,
          });
        }}
        name="submissionType"
        value={formData.submissionType ?? ""}
      >
        <Radio name={SubmissionType.digital} value={SubmissionType.digital}>
          Send digitalt
        </Radio>
        <Radio name={SubmissionType.byMail} value={SubmissionType.byMail}>
          Send i posten
        </Radio>
      </RadioGroup>
    </Section>
  );
};

export default ChooseSubmissionType;
