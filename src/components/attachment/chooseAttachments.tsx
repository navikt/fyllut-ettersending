import { Checkbox, CheckboxGroup, TextField } from "@navikt/ds-react";
import { Form } from "../../data/domain";
import Section from "../section/section";
import styles from "../attachment/attachment.module.css";
import { useFormState } from "../../data/appState";
import { hasOtherAttachment } from "../../utils/formDataUtil";
import { isSubmissionTypePaper } from "../../utils/submissionUtil";
import { useTranslation } from "next-i18next";

interface Props {
  form: Form;
}

const ChooseAttachments = ({ form }: Props) => {
  const { formData, updateFormData, errors } = useFormState();
  const { t } = useTranslation("detaljer");

  return (
    <>
      {form.attachments?.length > 0 && (
        <Section>
          <CheckboxGroup
            legend={t("attachments-checkbox.legend")}
            value={formData.attachments ? formData.attachments.map((attachment) => attachment.key) : []}
            size="medium"
            onChange={(checked) => {
              const attachments = form.attachments?.filter((attachment) => checked.includes(attachment.key));
              updateFormData({ attachments });
            }}
            error={errors.attachments}
          >
            {form.attachments.map((attachment) => (
              <Checkbox key={attachment.key} value={attachment.key} name={attachment.key}>
                {attachment.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
          {hasOtherAttachment(formData) && isSubmissionTypePaper(formData) && (
            <TextField
              value={formData.otherDocumentationTitle ?? ""}
              name="otherDocumentationTitle"
              label={t("attachments-checkbox.other-documentation-label")}
              size="medium"
              onChange={(e) => updateFormData({ otherDocumentationTitle: e.target.value })}
              className={styles.input}
              error={errors.otherDocumentation}
            />
          )}
        </Section>
      )}
    </>
  );
};

export default ChooseAttachments;
