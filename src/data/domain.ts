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

interface DownloadCoverPageRequestBody {
  formData: FormData;
  title: string;
}

enum SubmissionType {
  digital = "digital",
  paper = "paper",
}

const getSubmissionTypeFromString = (string: string): SubmissionType => {
  if (!Object.values(SubmissionType).includes(string as SubmissionType)) {
    throw new Error(`Invalid submission type: ${string}`);
  }
  return SubmissionType[string as keyof typeof SubmissionType];
};

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

type MimeType = "application/pdf" | "application/json" | "image/png" | "image/jpeg";
type UploadStatus = "IkkeValgt" | "LastetOpp" | "Innsendt" | "SendSenere" | "SendesAvAndre" | "SendesIkke";
type ApplicationStatus = "Opprettet" | "Utfylt" | "Innsendt" | "SlettetAvBruker" | "AutomatiskSlettet";
type ArchivingStatus = "IkkeSatt" | "Arkivert" | "ArkiveringFeilet";
type ApplicationType = "soknad" | "ettersendelse";
type ApplicationDisplayType = "fyllUt" | "dokumentinnsending" | "ettersending";
interface ApplicationAttachment {
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

interface EttersendelseApplication {
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

export type { Form, NavUnit, KeyValue, UserData, FormData, Attachment, EttersendelseApplication, DownloadCoverPageRequestBody };
export { UnauthenticatedError, UserType, SubmissionType, getSubmissionTypeFromString };
