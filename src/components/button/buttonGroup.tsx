import { Button, Loader } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Paths } from "../../api/domain";
import { useFormData } from "../../data/appState";
import { isEmpty, validateFormDataOnSubmit } from "../../utils/validator";
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
      const formDataErrors = validateFormDataOnSubmit(formData);
      if (isEmpty(formDataErrors)) {
        router.push(primaryBtnPath);
      } else {
        setFormData({ ...formData, errors: formDataErrors });
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

      <Button
        className={styles.button}
        variant="secondary"
        onClick={() =>
          secondaryBtnPath ? (router.push(secondaryBtnPath), setSecondaryLoading(true)) : console.log("secondaryBtnPath", secondaryBtnPath)
        }
        size="medium"
        loading={secondaryLoading}
      >
        {secondaryBtnText}
      </Button>
    </div>
  );
};

export default ButtonGroup;
