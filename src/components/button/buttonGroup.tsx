import classNames from 'classnames';
import styles from './button.module.css';
import ButtonGroupElement, { ButtonType } from './buttonGroupElement';

interface Props {
  buttons: ButtonType[];
  center?: boolean;
}

const ButtonGroup = ({ buttons, center = false }: Props) => {
  return (
    <div className={classNames(styles.buttonGroup, { [styles.center]: center })}>
      {buttons && buttons.map((type) => <ButtonGroupElement type={type} key={type.text} />)}
    </div>
  );
};

export default ButtonGroup;
