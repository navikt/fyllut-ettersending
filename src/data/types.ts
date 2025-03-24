/**
 * AllowedSubmissionType_Old skal fjernes
 */
export type AllowedSubmissionType_Old = 'PAPIR_OG_DIGITAL' | 'KUN_PAPIR' | 'KUN_DIGITAL' | 'INGEN';
export type AllowedSubmissionType = 'PAPER' | 'DIGITAL';

export type FormDataPage = 'lospost' | 'digital-lospost' | 'other';

export type MimeType = 'application/pdf' | 'application/json' | 'image/png' | 'image/jpeg';
export type UploadStatus = 'IkkeValgt' | 'LastetOpp' | 'Innsendt' | 'SendSenere' | 'SendesAvAndre' | 'SendesIkke';
export type ApplicationStatus = 'Opprettet' | 'Utfylt' | 'Innsendt' | 'SlettetAvBruker' | 'AutomatiskSlettet';
export type ArchivingStatus = 'IkkeSatt' | 'Arkivert' | 'ArkiveringFeilet';
export type ApplicationType = 'soknad' | 'ettersendelse';
export type ApplicationDisplayType = 'fyllUt' | 'dokumentinnsending' | 'ettersending';
export type LanguageCode = 'nb' | 'nn' | 'en';

export enum QuerySubmissionType {
  digital = 'digital',
  paper = 'paper',
}

export const EnvQualifier = {
  preprodIntern: 'preprodIntern',
  preprodAnsatt: 'preprodAnsatt',
  local: 'local',
} as const;

export type EnvQualifierType = (typeof EnvQualifier)[keyof typeof EnvQualifier];

export interface KeyValue {
  [key: string]: string;
}
