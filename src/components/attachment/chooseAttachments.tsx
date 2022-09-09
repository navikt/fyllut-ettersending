import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { Form } from "../../api/domain";
import { FormData } from "../../api/domain";

interface Props {
  form: Form;
  updateFormData: any;
  formData: FormData;
}

const ChooseAttachments = ({ form, updateFormData, formData }: Props) => {
  
  return (
    <div className="section">
    <CheckboxGroup legend="Hvilke vedlegg skal du ettersende?" value={formData.attachments} onChange={(value) => updateFormData("attachments", value)} size="medium" error={formData.errors?.attachments}>
      {form.attachments.map((attachment) => (
        <Checkbox key={attachment.key} value={attachment.label} name={attachment.label}>
          {attachment.label}
        </Checkbox>
      ))}
    </CheckboxGroup>
  </div>

  );
};

export default ChooseAttachments;
