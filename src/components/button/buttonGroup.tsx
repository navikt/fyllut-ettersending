import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import styles from "./button.module.css";


interface Props {
  primaryBtnPath: string
  primaryBtnText: string
  secondaryBtnPath?: string
  secondaryBtnText?: string
}

const ButtonGroup = ({ primaryBtnPath, primaryBtnText, secondaryBtnPath, secondaryBtnText }: Props) => {
  const router = useRouter();
  
  return (
    <div className={styles.buttonGroup}>
    <Button className={styles.button} variant="primary" onClick={() => router.push(primaryBtnPath)} size="medium">
      {primaryBtnText}
    </Button>

    <Button
      className={styles.button}
      variant="secondary"
      onClick={() => secondaryBtnPath ? router.push(secondaryBtnPath) : console.log("secondaryBtnPath", secondaryBtnPath)}
      size="medium"
    >
      {secondaryBtnText}
    </Button>
  </div>
  );
};

export default ButtonGroup;
