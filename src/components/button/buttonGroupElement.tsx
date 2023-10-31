import { Button, ButtonProps } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useFormState } from '../../data/appState';
import styles from './button.module.css';

export interface Props {
  type: ButtonType;
}

export type ButtonType = {
  text: string;
  path?: string;
  validateForm?: boolean;
  external?: boolean;
} & Omit<ButtonProps, 'className' | 'loading' | 'size' | 'children'>;

const ButtonGroupElement = ({ type }: Props) => {
  const router = useRouter();
  const { text, path, validateForm, external, onClick, ...rest } = type;
  const { setValidate, validationSummaryFocus } = useFormState();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);

    if (validateForm) {
      const valid = setValidate(true);

      if (!valid) {
        validationSummaryFocus();
        setLoading(false);
        return;
      }
    }

    if (onClick) {
      onClick(e);
    } else if (path) {
      if (external) {
        window.location.href = path;
      } else {
        await router.push(path);
      }
    }

    setLoading(false);
  };

  return (
    <Button className={styles.button} onClick={handleClick} loading={loading} size="medium" {...rest}>
      {text}
    </Button>
  );
};

export default ButtonGroupElement;
