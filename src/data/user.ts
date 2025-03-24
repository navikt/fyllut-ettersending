export enum UserType {
  hasSocialNumber = 'hasSocialNumber',
  noSocialNumber = 'noSocialNumber',
  other = 'other',
  none = 'none',
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

export interface NavUnit {
  id: number;
  name: string;
  number: string;
  type: string;
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
