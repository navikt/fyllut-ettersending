import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { Form } from "../../api/domain";

interface Props {
  form: Form;
  updateFormData: any;
}

const ChooseAttachments = ({ form, updateFormData }: Props) => {
  
  return (
    <div className="section">
    <CheckboxGroup legend="Hvilke vedlegg skal du ettersende?" onChange={(value) => updateFormData("attachments", value)} size="medium">
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
