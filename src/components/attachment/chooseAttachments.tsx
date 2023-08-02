import { Checkbox, CheckboxGroup, TextField } from "@navikt/ds-react";
import { Form } from "../../data/domain";
import Section from "../section/section";
import styles from "../attachment/attachment.module.css";
import { useFormState } from "../../data/appState";
import { hasOtherAttachment } from "../../utils/formDataUtil";
import { isSubmissionTypeByMail } from "../../utils/submissionUtil";

interface Props {
  form: Form;
}

const ChooseAttachments = ({ form }: Props) => {
  const { formData, updateFormData, errors } = useFormState();

  return (
    <>
      {form.attachments?.length > 0 && (
        <Section>
          <CheckboxGroup
            legend="Hvilke vedlegg skal du ettersende?"
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
          {hasOtherAttachment(formData) && isSubmissionTypeByMail(formData) && (
            <TextField
              value={formData.otherDocumentationTitle ?? ""}
              name="otherDocumentationTitle"
              label="Hvilken annen dokumentasjon skal du sende?"
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
