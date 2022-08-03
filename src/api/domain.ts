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
}

interface NavUnit {
  id: number,
  name: string,
  number: string,
  type: string,
}

interface KeyValue {
 [key: string]: string,
}

interface FormData {
  attachments?: string[];
  userData?: UserData;
  socialNo?: string;
  submissionInvolves?: string;
  applicationId?: string;
  subjectOfSubmission?: string;
  nameOfUploadedDocument?: string;
  navDeviceToReceiveSubmission?: string
}

interface UserData {
  fornavn: string;
  etternavn: string;
  postnr: string;
  poststed: string;
  gateAddresse: string;
  land: string;
}

export enum Paths {
  downloadPage = "/last-ned",
  selectForm = "/velg-skjema",
  navMyPage = "https://www.nav.no/person/dittnav/"
}

export enum ButtonText {
  next = "Neste",
  cancel = "Avbryt",
  uploadToMyPage = "Last opp på Min Side",
  sendViaPost = "Send i posten"
}

export const userDataInit:UserData = {
  fornavn: "",
  etternavn: "",
  postnr: "",
  poststed: "",
  gateAddresse: "",
  land: ""
};

export const userDummyDataInit:UserData =  {
  fornavn: "Ola",
  etternavn: "Nordmann",
  postnr: "0001",
  poststed: "Oslo",
  gateAddresse: "Addresse 1",
  land: "Norway",
}

export const formDataInit:FormData = {
  attachments: [],
  userData: userDataInit,
  socialNo: "",
  submissionInvolves: ""
};

export type {
  Form,
  NavUnit,
  KeyValue,
  UserData,
  FormData
}