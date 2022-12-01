interface Form {
  _id: string;
  modified: string;
  path: string;
  title: string;
  properties: FormProperties;
  attachments: Attachments[];
}

interface Attachments {
  label: string;
  key: string;
  description: string;
}

interface FormProperties {
  formNumber?: string;
  skjemanummer?: string;
  submissionType?: string;
  navUnitTypes?: string[];
  theme?: string;
}

export enum SubmissionType {
  hasSocialNumber = "has-social-number",
  noSocialNumber = "no-social-number",
  other = "other",
}


export enum VelgSkjemaSubmissionType {
  forwardAttachment = "forward-attachment",
  sendAnotherDoc = "send-another-doc",
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
  attachments: string[];
  beenInContactPrev?: boolean;
  errors?: KeyValue;
  formNumber?: string;
  nameOfUploadedDocument?: string;
  onSubmitTriggered: boolean;
  socialSecurityNo?: string;
  subjectOfSubmission?: string;
  submissionInvolves?: SubmissionType;
  navUnitInContactWith: string;
  navUnitToReceiveSubmission?: string;
  theme?: string;
  title?: string;
  userData: UserData;
  velgSkjemaSubmissionType?: VelgSkjemaSubmissionType;
}

interface UserData {
  fornavn: string;
  etternavn: string;
  postnr: string;
  poststed: string;
  gateAddresse: string;
  land: string;
}

enum Paths {
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

const initUserData = () => {
  return {
    fornavn: "",
    etternavn: "",
    postnr: "",
    poststed: "",
    gateAddresse: "",
    land: "",
  };
};

const ErrorMessages = {
  socialSecurityNo: "Fødselsnummer / D-nummer er ikke gyldig",
  socialSecurityNoIsEmpty: "Du må fylle ut fødselsnummer / D-nummer",
  fornavn: "Du må fylle ut fornavn",
  etternavn: "Du må fylle ut etternavn",
  postnr: "Du må fylle ut postnummer",
  poststed: "Du må fylle ut poststed",
  gateAddresse: "Du må fylle ut gateadresse",
  land: "Du må fylle ut land",
  nameOfUploadedDocument: "Du må fylle ut hvilken dokumentasjon vil du sende til NAV",
  chooseOne: "Velg ett alternativ",
  attachments: "Velg minst et vedlegg",
};

const initFormData = () => {
  return {
    attachments: [],
    userData: initUserData(),
    socialSecurityNo: "",
    velgSkjemaSubmissionType: undefined,
    onSubmitTriggered: false,
    beenInContactPrev: false,
    navUnitToReceiveSubmission: "",
    navUnitInContactWith: "",
    errors: {},
  };
}

export type { Form, NavUnit, KeyValue, UserData, FormData };
export { initUserData, initFormData, Paths, ButtonText, ErrorMessages };
