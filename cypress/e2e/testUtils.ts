enum TestButtonText {
  next = 'Gå videre',
  previous = 'Gå tilbake',
  otherDocumentation = 'Annen dokumentasjon',
  downloadCoverPage = 'Last ned førsteside',
}

enum TestButtonTextNn {
  next = 'Gå vidare',
  previous = 'Gå tilbake',
  otherDocumentation = 'Annen dokumentasjon',
  downloadCoverPage = 'Last ned førsteside',
}

enum TestButtonTextEn {
  next = 'Next',
  previous = 'Previous',
  otherDocumentation = 'Other documentation',
  downloadCoverPage = 'Download cover sheet',
}

enum TestLinkText {
  sendDigital = 'Logg inn og send digitalt',
  sendPaper = 'Send i posten',
}

function setConsentCookie() {
  cy.setCookie(
    'navno-consent',
    JSON.stringify({
      consent: { analytics: false, surveys: false },
      userActionTaken: true,
      meta: { createdAt: '2025-02-04T14:50:17.096Z', updatedAt: '2025-02-04T14:50:17.096Z', version: 1 },
    }),
  );
}

export { TestButtonText, TestButtonTextEn, TestButtonTextNn, TestLinkText, setConsentCookie };
