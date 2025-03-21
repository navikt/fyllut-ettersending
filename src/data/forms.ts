import { Attachment } from './attachment';
import { AllowedSubmissionType, LanguageCode } from './types';

export interface BasicForm {
  _id: string;
  modified: string;
  path: string;
  title: string;
}

export interface ListForm extends BasicForm {
  properties: ListFormProperties;
}

export interface ListFormProperties {
  formNumber?: string;
  allowedSubmissionTypes?: AllowedSubmissionType[];
}

export interface Form extends BasicForm {
  properties: FormProperties;
  attachments: Attachment[];
}

export interface FormProperties {
  formNumber?: string;
  skjemanummer?: string;
  allowedSubmissionTypes: AllowedSubmissionType[];
  navUnitTypes?: string[];
  navUnitMustBeSelected?: boolean;
  subjectOfSubmission?: string;
  hideUserTypes?: boolean;
  publishedLanguages?: LanguageCode[];
}
