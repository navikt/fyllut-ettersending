import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFormData } from "../../data/appState";
import { isEmpty, validateFormData } from "../../utils/validator";
import styles from "./button.module.css";

export interface Props {
  type: ButtonType;
}

export interface ButtonType {
  text: string;
  path: string;
  variant?: "primary" | "secondary" | "tertiary";
  validateForm?: boolean;
}

const ButtonGroupElement = ({ type }: Props) => {
  const router = useRouter();
  const { text, path, variant, validateForm } = type;
  const { formData, setFormData } = useFormData();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    if (validateForm) {
      const updatedFormData = {...formData, onSubmitTriggered: true}
      const formDataErrors = validateFormData(updatedFormData);
      if (formDataErrors && isEmpty(formDataErrors)) {
        await router.push(path);
      } else {
        setFormData({ ...formData, errors: formDataErrors, onSubmitTriggered: true});
      }

      setLoading(false);
    } else {
      await router.push(path);
    }
  };

  return (
    <Button
      className={styles.button}
      variant={variant ?? "primary"}
      onClick={handleClick}
      loading={loading}
      size="medium"
    >
      {text}
    </Button>
  );
};

export default ButtonGroupElement;
