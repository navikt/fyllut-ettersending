interface Form {
  _id: string;
  modified: string;
  path: string;
  title: string;
  properties: FormProperties;
  attachments: Attachments[];
}

interface Attachments {
  label: string;
  key: string;
  description: string;
}

interface FormProperties {
  formNumber?: string;
  skjemanummer?: string;
  submissionType?: string;
  navUnitTypes?: string[];
  theme?: string;
}

interface ErrorFormData {
  attachments?: string;
  userData?: UserData;
  socialNo?: string;
  submissionInvolves?: string;
  formId?: string;
  subjectOfSubmission?: string;
  nameOfUploadedDocument?: string;
  navDeviceToReceiveSubmission?: string;
}

export enum SubmissionType {
  hasSocialNumber = "has-social-number",
  noSocialNumber = "no-social-number",
  other = "other",
}


export enum VelgSkjemaSubmissionType {
  forwardAttachment = "forward-attachment",
  sendAnotherDoc = "send-another-doc",
}

interface NavUnit {
  id: number;
  name: string;
  number: string;
  type: string;
}

interface KeyValue {
  [key: string]: string;
}

interface FormData {
  formId?: string;
  attachments: string[];
  beenInContactPrev?: boolean;
  errors?: KeyValue;
  formNumber?: string;
  nameOfUploadedDocument?: string;
  onSubmitTriggered: boolean;
  socialSecurityNo?: string;
  subjectOfSubmission?: string;
  submissionInvolves?: SubmissionType;
  navUnitInContactWith: string;
  navUnitToReceiveSubmission?: string;
  theme?: string;
  title?: string;
  userData: UserData;
  velgSkjemaSubmissionType?: VelgSkjemaSubmissionType;
}

interface UserData {
  fornavn: string;
  etternavn: string;
  postnr: string;
  poststed: string;
  gateAddresse: string;
  land: string;
}

enum Paths {
  downloadPage = "/last-ned",
  selectForm = "/velg-skjema",
  navMyPage = "https://www.nav.no/person/dittnav/",
}

enum ButtonText {
  next = "Neste",
  cancel = "Avbryt",
  uploadToMyPage = "Last opp på Min Side",
  sendViaPost = "Send i posten",
}

const initUserData = () => {
  return {
    fornavn: "",
    etternavn: "",
    postnr: "",
    poststed: "",
    gateAddresse: "",
    land: "",
  };
};

const userDataInit = {
  fornavn: "",
  etternavn: "",
  postnr: "",
  poststed: "",
  gateAddresse: "",
  land: "",
};

const ErrorMessages = {
  socialSecurityNo: "Fødselsnummer er ikke gyldig",
  socialSecurityNoIsEmpty: "Fødselsnummer må fylles ut",
  fornavn: "Fornavn må fylles ut",
  etternavn: "Etternavn må fylles ut",
  postnr: "Post nummer må fylles ut",
  poststed: "Post sted må fylles ut",
  gateAddresse: "Adressen må fylles ut",
  land: "Land må fylles ut",
  emptyInput: "Tekstfelt er tom",
  chooseOne: "Velg en av alternativer",
  attachments: "Velg minst et vedlegg",
};

const clearErrorMessages = {
  socialSecurityNo: "",
  socialNoEmpty: "",
  fornavn: "",
  etternavn: "",
  postnr: "",
  poststed: "",
  gateAddresse: "",
  land: "",
  emptyInput: "",
  submissionInvolves: "",
  attachments: "",
}

const userDummyDataInit: UserData = {
  fornavn: "Ola",
  etternavn: "Nordmann",
  postnr: "0001",
  poststed: "Oslo",
  gateAddresse: "Addresse 1",
  land: "Norway",
};

const initFormData = () => {
  return {
    attachments: [],
    userData: initUserData(),
    socialSecurityNo: "",
    velgSkjemaSubmissionType: VelgSkjemaSubmissionType.forwardAttachment,
    onSubmitTriggered: false,
    beenInContactPrev: false,
    navUnitToReceiveSubmission: "",
    navUnitInContactWith: "",
    errors: {},
  };
}

const formDataInit: FormData = {
  attachments: [],
  userData: initUserData(),
  socialSecurityNo: "",
  velgSkjemaSubmissionType: VelgSkjemaSubmissionType.forwardAttachment,
  onSubmitTriggered: false,
  beenInContactPrev: false,
  navUnitToReceiveSubmission: "",
  navUnitInContactWith: "",
  errors: {},
};

export type { Form, NavUnit, KeyValue, UserData, FormData, ErrorFormData };

export { formDataInit, userDummyDataInit, initUserData, initFormData, userDataInit, Paths, ButtonText, ErrorMessages };
