import React, { Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { FormData, initFormData } from "../api/domain";

interface AppStateType {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
}

const FormDataContext = React.createContext<AppStateType>({
  formData: initFormData(),
  setFormData: () => {},
});

export function useFormData() {
  return useContext(FormDataContext);
}

type Props = {
  children: ReactNode;
};

export function FormDataProvider({ children }: Props) {
  const [formData, setFormData] = useState<FormData>(initFormData());

  return (
    <>
      <FormDataContext.Provider value={{ formData, setFormData }}>{children}</FormDataContext.Provider>
    </>
  );
}
