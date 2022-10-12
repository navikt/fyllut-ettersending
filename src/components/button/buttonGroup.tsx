import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFormData } from "../../data/appState";
import { isEmpty, validateFormData } from "../../utils/validator";
import styles from "./button.module.css";

interface Props {
  primaryBtnPath: string;
  primaryBtnText: string;
  secondaryBtnPath?: string;
  secondaryBtnText?: string;
  validate: boolean;
}

const ButtonGroup = ({ primaryBtnPath, primaryBtnText, secondaryBtnPath, secondaryBtnText, validate }: Props) => {
  const router = useRouter();
  const { formData, setFormData } = useFormData();
  const [primaryBtnLoading, setPrimaryBtnLoading] = useState(false);
  const [secondaryLoading, setSecondaryLoading] = useState(false);

  const validateAndGoToNextPage = () => {
    setPrimaryBtnLoading(true);
    if (validate) {
      const updatedFormData = {...formData, onSubmitTriggered: true}
      const formDataErrors = validateFormData(updatedFormData);
      if (formDataErrors && isEmpty(formDataErrors)) {
        router.push(primaryBtnPath);
      } else {
        setFormData({ ...formData, errors: formDataErrors, onSubmitTriggered: true});
      }
    }

    setPrimaryBtnLoading(false);
  };

  return (
    <div className={styles.buttonGroup}>
      <Button
        className={styles.button}
        variant="primary"
        onClick={validateAndGoToNextPage}
        loading={primaryBtnLoading}
        size="medium"
      >
        {primaryBtnText}
      </Button>

      {
        secondaryBtnPath && (
          <Button
            className={styles.button}
            variant="secondary"
            onClick={() => {
              setSecondaryLoading(true);
              router.push("/");
            }}
            size="medium"
            loading={secondaryLoading}
          >
            {secondaryBtnText}
          </Button>
        )
      }
    </div>
  );
};

export default ButtonGroup;
