import { Checkbox, CheckboxGroup, TextField } from "@navikt/ds-react";
import { Form } from "../../data/domain";
import Section from "../section/section";
import styles from "../attachment/attachment.module.css";
import { useFormState } from "../../data/appState";
import { hasOtherAttachment } from "../../utils/formDataUtil";
import { useEffect, useState } from "react";

interface Props {
  form: Form;
}

const ChooseAttachments = ({form}: Props) => {
  const {formData, updateFormData, errors} = useFormState();
  const [attachmentKeys, setAttachmentKeys] = useState<string[]>([]);

  useEffect(() => {
    const formAttachmentKeys = formData.attachments?.map(attachment => attachment.key);
    if (formAttachmentKeys && formAttachmentKeys.length > 0) {
      setAttachmentKeys(formAttachmentKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {
        form.attachments?.length > 0 && (
          <Section>
            <CheckboxGroup
              legend="Hvilke vedlegg skal du ettersende?"
              value={attachmentKeys}
              onChange={values => {
                setAttachmentKeys(values);
              }}
              size="medium"
              error={errors.attachments}
            >
              {
                form.attachments
                  .map(attachment => (
                    <Checkbox key={attachment.key} value={attachment.key} name={attachment.key} onChange={e => {
                      const attachments = e.target.checked
                        ? [...formData.attachments ?? [], attachment]
                        : formData.attachments?.filter(a => a.key !== attachment.key);
                      updateFormData({attachments});
                    }}>
                      {attachment.label}
                    </Checkbox>
                  ))
              }
            </CheckboxGroup>
            {
              hasOtherAttachment(formData) && (
                <TextField
                  value={formData.otherDocumentationTitle ?? ""}
                  name="otherDocumentationTitle"
                  label="Hvilken annen dokumentasjon skal du sende?"
                  size="medium"
                  onChange={e => updateFormData({otherDocumentationTitle: e.target.value})}
                  className={styles.input}
                  error={errors.otherDocumentation}
                />
              )
            }
          </Section>
        )
      }
    </>
  );
};

export default ChooseAttachments;
