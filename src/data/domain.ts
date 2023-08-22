class UnauthenticatedError extends Error {}
interface Form {
  _id: string;
  modified: string;
  path: string;
  title: string;
  properties: FormProperties;
  attachments: Attachment[];
}

interface Attachment {
  label: string;
  key: string;
  description: string;
  otherDocumentation: boolean;
  attachmentTitle: string;
  attachmentCode: string;
}

type AllowedSubmissionType = "PAPIR_OG_DIGITAL" | "KUN_PAPIR" | "KUN_DIGITAL" | "INGEN";

interface FormProperties {
  formNumber?: string;
  skjemanummer?: string;
  submissionType?: AllowedSubmissionType;
  navUnitTypes?: string[];
  navUnitMustBeSelected?: boolean;
  subjectOfSubmission?: string;
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
  attachments?: Attachment[];
  navUnitContact?: boolean;
  formNumber?: string;
  otherDocumentationTitle?: string;
  subjectOfSubmission?: string;
  titleOfSubmission?: string;
  submissionType?: SubmissionType;
  title?: string;
  userData?: UserData;
}

enum SubmissionType {
  digital = "digital",
  byMail = "byMail",
}

enum UserType {
  hasSocialNumber = "hasSocialNumber",
  noSocialNumber = "noSocialNumber",
  other = "other",
}

interface UserData {
  type?: UserType;
  firstName?: string;
  lastName?: string;
  streetName?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  socialSecurityNo?: string;
  navUnitContact?: boolean;
  navUnit?: string;
}

export type { Form, NavUnit, KeyValue, UserData, FormData, Attachment };
export { UnauthenticatedError, UserType, SubmissionType };
