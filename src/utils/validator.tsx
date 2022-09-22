import fnrValidator from "@navikt/fnrvalidator";
import {
  ErrorMessages, FormData, KeyValue, SubmissionType, VelgSkjemaSubmissionType
} from "../api/domain";

const validate = {
  isSendAnotherDocSubmissionType: (formData: FormData) => formData.velgSkjemaSubmissionType === VelgSkjemaSubmissionType.sendAnotherDoc ? true : false,
  hasSubmissionInvolves: (formData: FormData) =>
  formData.submissionInvolves && Object.values(SubmissionType).includes(formData.submissionInvolves),
  nameOfUploadedDocument: (formData: FormData) =>
  validate.isSendAnotherDocSubmissionType(formData)
    ? !formData.nameOfUploadedDocument
    : false,
  subjectOfSubmission: (formData: FormData) => validate.isSendAnotherDocSubmissionType(formData) && !formData.subjectOfSubmission,
  socialSecurityNo: (formData: FormData) =>
    formData.submissionInvolves === SubmissionType.hasSocialNumber && formData.socialSecurityNo
      ? fnrValidator.idnr(formData.socialSecurityNo).status === "invalid"
      : false,
  hasUserData: (formData: FormData) =>
    formData.submissionInvolves === SubmissionType.noSocialNumber ? formData.userData : false,
  hasNoAttachments: (formData: FormData) => formData.formId && formData.attachments.length === 0,
  velgSkjemaSubmissionType: (value: string) => ["forward-attachment", "send-another-doc"].includes(value),
  isForwardDocSubmissionType: (value: string | undefined) => (value ? "forward-attachment".includes(value) : false),
  navUnitInContactWith: (formData: FormData) => formData.submissionInvolves === SubmissionType.noSocialNumber && formData.beenInContactPrev && !formData.navUnitInContactWith,
  navUnitToReceiveSubmission: (formData: FormData) => formData.submissionInvolves === SubmissionType.other && !formData.navUnitToReceiveSubmission,
};

const validateFormData = (formData: FormData) => {
  let formErrors: KeyValue = {};
  if (formData.onSubmitTriggered) {
    console.log("validate form data:", formData);

    if (!validate.hasSubmissionInvolves(formData)) {
      formErrors.submissionInvolves = ErrorMessages.chooseOne;
    }

    if (validate.nameOfUploadedDocument(formData)) {
      formErrors.nameOfUploadedDocument = ErrorMessages.emptyInput;
    }

    if (validate.socialSecurityNo(formData)) {
      formErrors.socialSecurityNo = ErrorMessages.socialSecurityNo;
    } else if (formData.submissionInvolves === SubmissionType.hasSocialNumber && !formData.socialSecurityNo) {
      formErrors.socialSecurityNo = ErrorMessages.socialSecurityNoIsEmpty;
    }

    if(validate.subjectOfSubmission(formData)) {
      formErrors.subjectOfSubmission = ErrorMessages.chooseOne;
    }

    if (validate.hasUserData(formData)) {

      Object.keys(formData.userData).forEach((key) => {
        if (!formData.userData[key as keyof typeof formData.userData]) {
          formErrors[key as keyof typeof formErrors] = ErrorMessages[key as keyof typeof ErrorMessages];
        }
      });
    }

    if(validate.navUnitInContactWith(formData)){
      formErrors.navUnitInContactWith = ErrorMessages.chooseOne;
    }

    if(validate.navUnitToReceiveSubmission(formData)){
      formErrors.navUnitToReceiveSubmission = ErrorMessages.chooseOne;
    }

    if (validate.hasNoAttachments(formData)) {
      formErrors.attachments = ErrorMessages.attachments;
    }
    return formErrors;
  }
};

const isEmpty = (obj: {}) => {
  return Object.keys(obj).length === 0;
};

export { isEmpty, validateFormData };
