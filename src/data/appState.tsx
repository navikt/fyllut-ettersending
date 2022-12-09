import React, { ReactNode, useContext, useState } from "react";
import { FormData, KeyValue, UserData } from "./domain";
import { validateFormData } from "../utils/validator";

interface AppStateType {
  formData: FormData;
  updateFormData: (values: FormData) => void;
  updateUserData: (values: UserData) => void;
  resetFormData: (formData?: FormData) => void;
  errors: KeyValue;
  setValidate: (valid: boolean) => boolean;
}

const FormDataContext = React.createContext<AppStateType>({} as AppStateType);

export function useFormState() {
  return useContext(FormDataContext);
}

type Props = {
  children: ReactNode;
};

export function FormDataProvider({ children }: Props) {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<KeyValue>({});
  const [validateState, setValidateState] = useState<boolean>(false);

  const updateFormData = (values: FormData) => {
    const data = {
      ...formData,
      ...values
    };
    setFormData(data);
    if (validateState) {
      const errorMessages = validateFormData(data);
      setErrors(errorMessages ?? {});
    }
  };

  const updateUserData = (values: UserData) => {
    const data = {
      ...formData,
      userData: {
        ...formData.userData ?? {},
        ...values
      },
    };
    setFormData(data);
    if (validateState) {
      const errorMessages = validateFormData(data);
      setErrors(errorMessages ?? {});
    }
  };

  const setValidate = (validate: boolean) => {
    setValidateState(validate);
    if (validate) {
      const errorMessages = validateFormData(formData);
      setErrors(errorMessages ?? {});
      return !errorMessages;
    } else {
      setErrors({});
    }

    return true;
  }

  const resetFormData = (formData?: FormData) => {
    setValidateState(false);
    if (formData) {
      setFormData(formData);
    } else {
      setFormData({});
    }

    setErrors({});
  }

  return (
    <FormDataContext.Provider value={{ formData, resetFormData, updateFormData, updateUserData, errors, setValidate }}>
      {children}
    </FormDataContext.Provider>
  );
}
