import fnrValidator from "@navikt/fnrvalidator";
import { ErrorMessages, FormData, KeyValue, UserType } from "../data/domain";
import { hasOtherAttachment } from "./formDataUtil";

const validateFormData = (formData: FormData) => {
  let formErrors: KeyValue = {};

  if ((!formData.formId || hasOtherAttachment(formData)) && !formData.otherDocumentationTitle) {
    formErrors.otherDocumentation = ErrorMessages.otherDocumentation;
  }

  if (!formData.userData?.type) {
    formErrors.userType = ErrorMessages.userType;
  } else if (formData.userData?.type === UserType.hasSocialNumber) {
    if (!formData.userData?.socialSecurityNo) {
      formErrors.socialSecurityNo = ErrorMessages.socialSecurityNoIsEmpty;
    } else if (fnrValidator?.idnr(formData.userData.socialSecurityNo).status === "invalid") {
      formErrors.socialSecurityNo = ErrorMessages.socialSecurityNo;
    }
  } else if (formData.userData?.type === UserType.noSocialNumber) {
    if (!formData.userData?.firstName) {
      formErrors.firstName = ErrorMessages.firstName;
    }
    if (!formData.userData?.lastName) {
      formErrors.lastName = ErrorMessages.lastName;
    }
    if (!formData.userData?.streetName) {
      formErrors.streetName = ErrorMessages.streetName;
    }
    if (!formData.userData?.postalCode) {
      formErrors.postalCode = ErrorMessages.postalCode;
    }
    if (!formData.userData?.city) {
      formErrors.city = ErrorMessages.city;
    }
    if (!formData.userData?.country) {
      formErrors.country = ErrorMessages.country;
    }

    if (formData.userData?.navUnitContact === undefined) {
      formErrors.navUnitContact = ErrorMessages.navUnitContact;
    } else if (formData.userData?.navUnitContact && !formData.userData?.navUnit) {
      formErrors.navUnit = ErrorMessages.navUnitContactSelect;
    }
  } else if (formData.userData?.type === UserType.other) {
    if (!formData.userData?.navUnit) {
      formErrors.navUnit = ErrorMessages.navUnit;
    }
  }

  if (!formData.formId && !formData.subjectOfSubmission) {
    formErrors.subjectOfSubmission = ErrorMessages.subjectOfSubmission;
  }

  if (formData.formId && (!formData.attachments || formData.attachments.length === 0)) {
    formErrors.attachments = ErrorMessages.attachments;
  }

  console.log(formData, formErrors);

  return Object.keys(formErrors).length === 0 ? undefined : formErrors;
};

export { validateFormData };
