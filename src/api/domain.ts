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
  applicationId?: string;
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
  formNumber?: string;
  title?: string;
  theme?: string;
  attachments: string[];
  userData?: UserData;
  socialNo?: string;
  submissionInvolves?: SubmissionType;
  velgSkjemaSubmissionType?: VelgSkjemaSubmissionType;
  applicationId?: string;
  subjectOfSubmission?: string;
  nameOfUploadedDocument?: string;
  navDeviceToReceiveSubmission?: string;
  errors?: ErrorFormData;
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

const userDummyDataInit: UserData = {
  fornavn: "Ola",
  etternavn: "Nordmann",
  postnr: "0001",
  poststed: "Oslo",
  gateAddresse: "Addresse 1",
  land: "Norway",
};

const formDataInit: FormData = {
  attachments: [],
  userData: initUserData(),
  socialNo: "",
  velgSkjemaSubmissionType: VelgSkjemaSubmissionType.forwardAttachment,
};

export type { Form, NavUnit, KeyValue, UserData, FormData, ErrorFormData };

export { formDataInit, userDummyDataInit, initUserData, Paths, ButtonText };
