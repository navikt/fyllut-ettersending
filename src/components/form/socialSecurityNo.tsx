import { TextField } from '@navikt/ds-react';
import { ChangeEvent } from 'react';

interface Props {
  value?: string;
  name: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}

const SocialSecurityNo = ({ value, name, id, label, onChange, placeholder, error }: Props) => {
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const targetValue = e.target.value;

    if (targetValue.match(/^\d{0,11}$/)) {
      onChange(targetValue);
    }
  };

  return (
    <>
      <TextField
        value={value}
        autoComplete="off"
        name={name}
        id={id}
        label={label}
        onChange={changeHandler}
        placeholder={placeholder}
        size="medium"
        type="text"
        pattern="\d*"
        error={error}
      />
    </>
  );
};

export default SocialSecurityNo;
