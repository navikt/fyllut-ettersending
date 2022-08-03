import React, { Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { formDataInit, FormData } from "../api/domain";

interface AppStateType {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
}

const FormDataContext = React.createContext<AppStateType>({
  formData: formDataInit,
  setFormData: () => {},
});

export function useFormData() {
  return useContext(FormDataContext);
}

type Props = {
  children: ReactNode;
};

export function FormDataProvider({ children }: Props) {
  const [formData, setFormData] = useState<FormData>(formDataInit);

  return (
    <>
      <FormDataContext.Provider value={{ formData, setFormData }}>{children}</FormDataContext.Provider>;
    </>
  );
}
