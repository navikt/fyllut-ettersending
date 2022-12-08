import fnrValidator from "@navikt/fnrvalidator";
import { ErrorMessages, FormData, KeyValue } from "../data/domain";
import {
  hasOtherAttachment,
  isPersonGroup,
  isPersonNoSocialSecurityNumber,
  isPersonSocialSecurityNumber
} from "./formDataUtil";

const validateFormData = (formData: FormData) => {
  let formErrors: KeyValue = {};

  if (hasOtherAttachment(formData) && !formData.otherDocumentationTitle) {
    formErrors.otherDocumentation = ErrorMessages.otherDocumentation;
  }

  if (isPersonSocialSecurityNumber(formData)) {
    if (!formData.userData?.socialSecurityNo
      || fnrValidator.idnr(formData.userData.socialSecurityNo).status === "invalid") {
      formErrors.socialSecurityNo = ErrorMessages.socialSecurityNo;
    }
  } else if (isPersonNoSocialSecurityNumber(formData)) {

  } else if (isPersonGroup(formData)) {

  }

  /*
  if (validate.socialSecurityNo(formData)) {
    formErrors.socialSecurityNo = ErrorMessages.socialSecurityNo;
  } else if (formData.submissionInvolves === SubmissionType.hasSocialNumber && !formData.socialSecurityNo) {
    formErrors.socialSecurityNo = ErrorMessages.socialSecurityNoIsEmpty;
  }*/

  /*if (!formData.userData?.navUnit) {
    formErrors.navUnitInContactWith = ErrorMessages.chooseOne;
  }*/

  if (formData.attachments?.length === 0) {
    formErrors.attachments = ErrorMessages.attachments;
  }

  return isEmpty(formErrors) ? undefined : formErrors;
};

const isEmpty = (obj: {}) => {
  return Object.keys(obj).length === 0;
};

export { isEmpty, validateFormData };
