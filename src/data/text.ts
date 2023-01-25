enum ButtonText {
  next = "Neste",
  cancel = "Avbryt",
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

enum Paths {
  base = "/",
  details = "/detaljer",
  downloadPage = "/last-ned",
}

export { Paths, ButtonText, ErrorMessages };