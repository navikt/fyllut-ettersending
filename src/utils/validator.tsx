import fnrValidator from "@navikt/fnrvalidator";
import {
  FormData,
  ErrorFormData,
  SubmissionType,
  UserData,
  initUserData,
  VelgSkjemaSubmissionType,
} from "../api/domain";

const validate = {
  socialNo: (formData: FormData) =>
    formData.submissionInvolves === SubmissionType.hasSocialNumber && formData.socialNo
      ? fnrValidator.idnr(formData.socialNo).status === "invalid"
      : false,
  hasUserData: (formData: FormData) =>
    formData.submissionInvolves === SubmissionType.noSocialNumber ? formData.userData : false,
  nameOfUploadedDocument: (formData: FormData) =>
    formData.velgSkjemaSubmissionType === VelgSkjemaSubmissionType.sendAnotherDoc
      ? !formData.nameOfUploadedDocument
      : false,
  hasNoAttachments: (formData: FormData) => window.location.href.match(/detaljer/) && formData.attachments.length === 0,
  hasSubmissionInvolves: (formData: FormData) => formData.submissionInvolves && Object.values(SubmissionType).includes(formData.submissionInvolves),
  velgSkjemaSubmissionType: (value: string) => ["forward-attachment", "send-another-doc"].includes(value),
  isSendAnotherDocSubmissionType: (value: string | undefined) => (value ? "send-another-doc".includes(value) : false),
  isForwardDocSubmissionType: (value: string | undefined) => (value ? "forward-attachment".includes(value) : false),
};

const ErrorMessages = {
  socialNo: "Fødselsnummer er ikke gyldig",
  socialNoEmpty: "Fødselsnummer må fylles ut",
  fornavn: "Fornavn må fylles ut",
  etternavn: "Etternavn må fylles ut",
  postnr: "Post nummer må fylles ut",
  poststed: "Post sted må fylles ut",
  gateAddresse: "Adressen må fylles ut",
  land: "Land må fylles ut",
  emptyInput: "Tekstfelt er tom",
  submissionInvolves: "Velg en av alternativer",
  attachments: "Velg minst et vedlegg",
};

const validateFormDataOnSubmit = (formData: FormData) => {
  let formErrors: ErrorFormData = {};
  console.log("validate form data:", formData)
  

  if (validate.hasUserData(formData)) {
    const mUserData: UserData = formData.userData!;
    console.log("validate user data:", mUserData)
    formErrors.userData = initUserData();
    console.log("formErrorsb4", formErrors);

    Object.keys(mUserData).forEach((key) => {
      console.log("...formErrors", formErrors);
      console.log("Key", key);
      console.log("Value", mUserData[key as keyof typeof formData.userData]);

      if (!mUserData[key as keyof typeof formData.userData]) {
        console.log("Caught Empty Value", key);
        formErrors.userData![key as keyof typeof formErrors.userData] = ErrorMessages[key as keyof typeof ErrorMessages];
      }

      //comparing objects
      if(JSON.stringify(formErrors.userData) === JSON.stringify(initUserData())){
        formErrors  = {}
      }

    });
  }

  if(validate.hasNoAttachments(formData)){
    formErrors.attachments = ErrorMessages.attachments;
  }

  if (validate.nameOfUploadedDocument(formData)) {
    formErrors.nameOfUploadedDocument = ErrorMessages.emptyInput;
  }

  if (!validate.hasSubmissionInvolves(formData)) {
    console.log("Insideeeeee")
    formErrors.submissionInvolves = ErrorMessages.submissionInvolves;
  }

  if (validate.socialNo(formData)) {
    formErrors.socialNo = ErrorMessages.socialNo;
  } else if (formData.submissionInvolves === SubmissionType.hasSocialNumber && !formData.socialNo) {
    formErrors.socialNo = ErrorMessages.socialNoEmpty;
  }

  console.log("formErrors", formErrors);
  return formErrors;
};

const isEmpty = (obj: {}) => {
  return Object.keys(obj).length === 0;
};

export { validateFormDataOnSubmit, isEmpty };
