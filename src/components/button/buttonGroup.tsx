import styles from "./button.module.css";
import ButtonGroupElement, { ButtonType } from "./buttonGroupElement";

interface Props {
  buttons: ButtonType[];
}

const ButtonGroup = ({ buttons }: Props) => {
  return (
    <div className={styles.buttonGroup}>
      {
        buttons && buttons.map(type => <ButtonGroupElement type={type} key={type.path} />)
      }
    </div>
  );
};

export default ButtonGroup;
