import { MimeType, UploadStatus } from './types';

export interface Attachment {
  label: string;
  key: string;
  description: string;
  otherDocumentation: boolean;
  attachmentTitle: string;
  attachmentCode: string;
  attachmentForm?: string;
}

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
