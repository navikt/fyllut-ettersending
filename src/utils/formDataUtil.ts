import { FormData } from "../data/domain";

const isPersonSocialSecurityNumber = (formData: FormData) => {
  return formData.userData?.socialSecurityNo;
};

const isPersonNoSocialSecurityNumber = (formData: FormData) => {
  return !isPersonSocialSecurityNumber(formData) && (formData.userData?.fornavn || formData.userData?.etternavn);
};

const isPersonGroup = (formData: FormData) => {
  return !isPersonNoSocialSecurityNumber(formData) && formData.userData?.navUnit;
};

const hasOtherAttachment = (formData: FormData): boolean => {
  return !!formData.attachments?.find(attachment => attachment.otherDocumentation)
}

export {
  isPersonSocialSecurityNumber,
  isPersonNoSocialSecurityNumber,
  isPersonGroup,
  hasOtherAttachment,
}