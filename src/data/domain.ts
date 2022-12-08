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
  attachmentCode: string,
}

interface FormProperties {
  formNumber?: string;
  skjemanummer?: string;
  submissionType?: string;
  navUnitTypes?: string[];
  theme?: string;
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
  beenInContactPrev?: boolean;
  formNumber?: string;
  otherDocumentationTitle?: string;
  subjectOfSubmission?: string;
  theme?: string;
  title?: string;
  userData?: UserData;

  socialSecurityNo?: string;
  navUnitInContactWith?: string;
  navUnitToReceiveSubmission?: string;
}

interface UserData {
  fornavn?: string;
  etternavn?: string;
  postnr?: string;
  poststed?: string;
  gateAddresse?: string;
  land?: string;
  socialSecurityNo?: string;
  navUnit?: string;
}

enum Paths {
  base = "/",
  details = "/detaljer",
  downloadPage = "/last-ned",
  selectForm = "/velg-skjema",
  navMyPage = "https://www.nav.no/person/dittnav/",
}

enum ButtonText {
  next = "Neste",
  cancel = "Avbryt",
  uploadToMyPage = "Last opp på Min Side",
  sendViaPost = "Send i posten",
}

const ErrorMessages = {
  socialSecurityNo: "Fødselsnummer / D-nummer er ikke gyldig",
  socialSecurityNoIsEmpty: "Du må fylle ut fødselsnummer / D-nummer",
  fornavn: "Du må fylle ut fornavn",
  etternavn: "Du må fylle ut etternavn",
  postnr: "Du må fylle ut postnummer",
  poststed: "Du må fylle ut poststed",
  gateAddresse: "Du må fylle ut gateadresse",
  land: "Du må fylle ut land",
  otherDocumentation: "Du må fylle ut hvilken dokumentasjon vil du sende til NAV",
  chooseOne: "Velg ett alternativ",
  attachments: "Velg minst et vedlegg",
};


export type { Form, NavUnit, KeyValue, UserData, FormData, Attachment };
export { Paths, ButtonText, ErrorMessages };
