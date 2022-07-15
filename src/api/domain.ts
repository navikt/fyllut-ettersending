import { getArchiveSubjects } from "./apiService";

interface Form {
  _id: string;
  modified: string;
  path: string;
  title: string;
  properties: FormProperties;
  attachments: [];
}

interface FormProperties {
  formNumber: string;
  submissionType: string;
  navUnitTypes: string[];
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

export type {
  Form,
  NavUnit,
  KeyValue,
}