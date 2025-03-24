import { ApplicationAttachment } from './attachment';
import { ApplicationDisplayType, ApplicationStatus, ApplicationType, ArchivingStatus } from './types';

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
