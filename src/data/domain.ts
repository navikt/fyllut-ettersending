export class UnauthenticatedError extends Error {}

export interface BasicForm {
  _id: string;
  modified: string;
  path: string;
  title: string;
}
// From fyllut /forms endpoint
export interface FyllutListForm extends BasicForm {
  properties: FyllutListFormProperties;
}

export interface FyllutListFormProperties {
  skjemanummer?: string;
  innsending?: AllowedSubmissionType;
  ettersending?: AllowedSubmissionType;
}

// For the FormSearch component
export interface ListForm extends BasicForm {
  properties: ListFormProperties;
}

export interface ListFormProperties {
  formNumber?: string;
  submissionType?: AllowedSubmissionType;
}

export interface Form extends BasicForm {
  properties: FormProperties;
  attachments: Attachment[];
}
export interface Attachment {
  label: string;
  key: string;
  description: string;
  otherDocumentation: boolean;
  attachmentTitle: string;
  attachmentCode: string;
}

export type AllowedSubmissionType = 'PAPIR_OG_DIGITAL' | 'KUN_PAPIR' | 'KUN_DIGITAL' | 'INGEN';

export interface FormProperties {
  formNumber?: string;
  skjemanummer?: string;
  submissionType?: AllowedSubmissionType;
  navUnitTypes?: string[];
  navUnitMustBeSelected?: boolean;
  subjectOfSubmission?: string;
}

export interface ApiNavUnit {
  enhetId: number;
  navn: string;
  enhetNr: string;
  antallRessurser: number;
  status: string;
  orgNivaa: string;
  type: string;
  organisasjonsnummer: string;
  underEtableringDato: string;
  aktiveringsdato: string;
  underAvviklingDato: string;
  nedleggelsesdato: string;
  oppgavebehandler: boolean;
  versjon: number;
  sosialeTjenester: string;
  kanalstrategi: string;
  orgNrTilKommunaltNavKontor: string;
}

export interface NavUnit {
  id: number;
  name: string;
  number: string;
  type: string;
}

export interface KeyValue {
  [key: string]: string;
}

export interface FormData {
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
  language?: string;
}

export interface DownloadCoverPageRequestBody {
  formData: FormData;
  title: string;
}

export interface EttersendingRequestBody {
  tittel?: string;
  skjemanr: string;
  sprak: string;
  tema: string;
  vedleggsListe: EttersendingVedlegg[];
}

export interface EttersendingVedlegg {
  vedleggsnr: string;
  tittel?: string;
  url?: string;
}

export enum SubmissionType {
  digital = 'digital',
  paper = 'paper',
}

export const getSubmissionTypeFromString = (string: string): SubmissionType => {
  if (!Object.values(SubmissionType).includes(string as SubmissionType)) {
    throw new Error(`Invalid submission type: ${string}`);
  }
  return SubmissionType[string as keyof typeof SubmissionType];
};

export enum UserType {
  hasSocialNumber = 'hasSocialNumber',
  noSocialNumber = 'noSocialNumber',
  other = 'other',
}

export interface UserData {
  type?: UserType;
  firstName?: string;
  lastName?: string;
  streetName?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  socialSecurityNo?: string;
  navUnitContact?: boolean;
  navUnit?: NavUnit;
}

export type MimeType = 'application/pdf' | 'application/json' | 'image/png' | 'image/jpeg';
export type UploadStatus = 'IkkeValgt' | 'LastetOpp' | 'Innsendt' | 'SendSenere' | 'SendesAvAndre' | 'SendesIkke';
export type ApplicationStatus = 'Opprettet' | 'Utfylt' | 'Innsendt' | 'SlettetAvBruker' | 'AutomatiskSlettet';
export type ArchivingStatus = 'IkkeSatt' | 'Arkivert' | 'ArkiveringFeilet';
export type ApplicationType = 'soknad' | 'ettersendelse';
export type ApplicationDisplayType = 'fyllUt' | 'dokumentinnsending' | 'ettersending';
export interface ApplicationAttachment {
  id?: number;
  vedleggsnr: string;
  tittel: string;
  label: string;
  beskrivelse: string;
  uuid: string;
  mimetype: MimeType;
  document?: string;
  erHoveddokument: boolean;
  erVariant: boolean;
  erPdfa: boolean;
  erPakrevd: boolean;
  skjemaurl?: string;
  opplastingsStatus: UploadStatus;
  opprettetdato: string;
  innsendtdato?: string;
  formioId?: string;
}

export interface EttersendelseApplication {
  id?: number;
  innsendingsId: string;
  ettersendingsId: string;
  brukerId: string;
  skjemanr: string;
  tittel: string;
  spraak: string;
  status: ApplicationStatus;
  endretDato: string;
  opprettetDato: string;
  innsendtDato?: string;
  vedleggsListe: ApplicationAttachment[];
  visningsSteg?: number;
  visningsType?: ApplicationDisplayType;
  innsendingsFristDato?: string;
  forsteInnsendingsDato?: string;
  fristForEttersendelse?: number;
  arkiveringsStatus?: ArchivingStatus;
  erSystemGenerert?: boolean;
  soknadstype?: ApplicationType;
}
