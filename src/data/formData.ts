import { Attachment } from './attachment';
import { FormDataPage, QuerySubmissionType } from './types';
import { UserData } from './user';

export type FormData = { page: FormDataPage } & OtherFormdata & DigitalLospostFormData & PaperLospostFormData;

/**
 * OtherFormdata brukes ved løspost (papir) og ettersending på valgt skjema.
 * Bør splittes opp for å tydeliggjøre hvilke skjemafelter som bruker hvor.
 *
 * @see {@link OtherFormdata}
 */
export interface OtherFormdata {
  formId?: string;
  attachments?: Attachment[];
  navUnitContact?: boolean;
  formNumber?: string;
  otherDocumentationTitle?: string;
  subjectOfSubmission?: string;
  titleOfSubmission?: string;
  submissionType?: QuerySubmissionType;
  title?: string;
  userData?: UserData;
  language?: string;
}

export interface PaperLospostFormData {
  documentationTitlePrefix?: string;
}

type Subject = { value: string; label: string };

export interface DigitalLospostFormData {
  subject?: Subject;
  documentationTitlePrefix?: string;
  documentTitle?: string;
  language?: string;
}

export interface DownloadCoverPageRequestBody {
  formData: FormData;
  title: string;
}

export interface LospostRequestBody {
  soknadTittel: string;
  tema: string;
  dokumentTittel: string;
  sprak: string;
}
