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
  title?: string;
  userData?: UserData;
}

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
  userType: "Du må velge hvem gjelder innsendelsen for",
  socialSecurityNo: "Fødselsnummer / D-nummer er ikke gyldig",
  socialSecurityNoIsEmpty: "Du må fylle ut fødselsnummer / D-nummer",
  firstName: "Du må fylle ut fornavn",
  lastName: "Du må fylle ut etternavn",
  streetName: "Du må fylle ut gateadresse",
  postalCode: "Du må fylle ut postnummer",
  city: "Du må fylle ut poststed",
  country: "Du må fylle ut land",
  otherDocumentation: "Du må fylle ut hvilken dokumentasjon vil du sende til NAV",
  subjectOfSubmission: "Du må velge tema for innsendingen",
  navUnitContact: "Du må oppgi om du vært i kontakt med NAV om denne saken tidligere",
  navUnitContactSelect: "Du må velge hvilken NAV-enhet har du vært i kontakt med",
  navUnit: "Du må velge hvilken NAV-enhet som skal motta innsendingen",
  chooseOne: "Velg ett alternativ",
  attachments: "Velg minst et vedlegg",
};


export type { Form, NavUnit, KeyValue, UserData, FormData, Attachment };
export { Paths, ButtonText, ErrorMessages, UserType };
