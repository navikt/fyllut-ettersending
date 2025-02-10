import { useTranslation } from 'next-i18next';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { validateFormData } from '../utils/validator';
import { Form, FormData, FormDataPage, KeyValue, UserData } from './domain';

interface AppStateType {
  formData: FormData;
  updateFormData: (values: Partial<FormData>) => void;
  updateUserData: (values: UserData) => void;
  updateFormDataLanguage: (language: string, form: Form) => void;
  resetFormData: (formData?: Partial<FormData>) => void;
  errors: KeyValue;
  setValidate: (valid: boolean) => boolean;
  validationSummaryRef: React.RefObject<HTMLDivElement>;
  validationSummaryFocus: () => void;
}

const FormDataContext = React.createContext<AppStateType>({} as AppStateType);

export function useFormState() {
  return useContext(FormDataContext);
}

type Props = {
  children: ReactNode;
  page: FormDataPage;
  documentationTitlePrefix?: string;
};

export function FormDataProvider({ children, page, documentationTitlePrefix }: Props) {
  const [formData, setFormData] = useState<FormData>({ page, documentationTitlePrefix });
  const [errors, setErrors] = useState<KeyValue>({});
  const [validateState, setValidateState] = useState<boolean>(false);
  const { t } = useTranslation('validator');

  const validationSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (validateState) {
      const errorMessages = validateFormData(formData, t);
      setErrors(errorMessages ?? {});
      if (!errorMessages) {
        setValidateState(false);
      }
    }
  }, [validateState, formData, t]);

  const updateFormData = (values: Partial<FormData>) => {
    setFormData((previousFormData) => ({ ...previousFormData, ...values }));
  };

  const updateFormDataLanguage = (language: string, form: Form) => {
    const attachments = (formData.attachments || []).map((attachment) => {
      const formAttachment = form.attachments.find((formAttachment) => formAttachment.key === attachment.key);
      return {
        ...attachment,
        attachmentTitle: formAttachment?.attachmentTitle || '',
        label: formAttachment?.label || '',
      };
    });
    const data = {
      ...formData,
      attachments,
      title: form.title,
      language,
    };
    setFormData(data);
  };

  const updateUserData = (values: UserData) => {
    const data = {
      ...formData,
      userData: {
        ...(formData.userData ?? {}),
        ...values,
      },
    };
    setFormData(data);
  };

  const setValidate = (validate: boolean) => {
    setValidateState(validate);
    if (validate) {
      const errorMessages = validateFormData(formData, t);
      setErrors(errorMessages ?? {});
      return !errorMessages;
    } else {
      setErrors({});
    }

    return true;
  };

  const resetFormData = (data?: Partial<FormData>) => {
    setValidateState(false);
    if (data) {
      setFormData({ page: formData.page, ...data, attachments: [] });
    } else {
      setFormData({ page: formData.page });
    }

    setErrors({});
  };

  const validationSummaryFocus = () => validationSummaryRef?.current?.focus();

  return (
    <FormDataContext.Provider
      value={{
        formData,
        resetFormData,
        updateFormData,
        updateUserData,
        updateFormDataLanguage,
        errors,
        setValidate,
        validationSummaryRef,
        validationSummaryFocus,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
}
