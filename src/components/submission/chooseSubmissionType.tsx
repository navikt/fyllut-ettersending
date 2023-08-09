import Section from "../section/section";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { useFormState } from "../../data/appState";
import { SubmissionType } from "../../data/domain";
import { useTranslation } from "next-i18next";

const ChooseSubmissionType = () => {
  const { formData, updateFormData } = useFormState();
  const { t } = useTranslation("detaljer");

  return (
    <Section>
      <RadioGroup
        legend={t("submission-type-radio.legend")}
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
          {t("submission-type-radio.choice-digital")}
        </Radio>
        <Radio name={SubmissionType.byMail} value={SubmissionType.byMail}>
          {t("submission-type-radio.choice-by-mail")}
        </Radio>
      </RadioGroup>
    </Section>
  );
};

export default ChooseSubmissionType;
