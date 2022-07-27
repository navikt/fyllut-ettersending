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

interface UserData {
  fornavn: string;
  etternavn: string;
  postnr: string;
  poststed: string;
  gateAddresse: string;
  land: string;
}

export const userDataInit:UserData = {
  fornavn: "",
  etternavn: "",
  postnr: "",
  poststed: "",
  gateAddresse: "",
  land: ""
};

export type {
  Form,
  NavUnit,
  KeyValue,
  UserData
}