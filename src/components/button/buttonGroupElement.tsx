import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFormState } from "../../data/appState";
import styles from "./button.module.css";

export interface Props {
  type: ButtonType;
}

export interface ButtonType {
  text: string;
  path: string;
  variant?: "primary" | "secondary" | "tertiary";
  validateForm?: boolean;
  external?: boolean;
}

const ButtonGroupElement = ({ type }: Props) => {
  const router = useRouter();
  const { text, path, variant, validateForm, external } = type;
  const { setValidate } = useFormState();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    if (external) {
      window.location.href = path;
    } else if (validateForm) {
      const valid = setValidate(true);
      if (valid) {
        await router.push(path);
      }
    } else {
      await router.push(path);
    }

    setLoading(false);
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
