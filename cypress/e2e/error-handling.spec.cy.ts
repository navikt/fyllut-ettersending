describe('displays correct error messages', () => {
  beforeEach(() => {
    cy.mocksRestoreRouteVariants();
  });

  it('should display error message for digital only', () => {
    cy.visit('/paperonly?sub=digital');
    cy.contains('Det er bare mulig å ettersende vedlegg til dette skjemaet i posten.').should('be.visible');
  });

  it('should display error message for paper only', () => {
    cy.visit('/digitalonly?sub=paper');
    cy.contains('Det er bare mulig å ettersende digitalt til dette skjemaet. Du blir bedt om å logge inn.').should(
      'be.visible',
    );
  });

  it('send documents not allowed form without subsequentSubmissionTypes', () => {
    cy.visit('/noattachmentsallowed?sub=digital');
    cy.contains(
      'Det er ikke mulig å ettersende vedlegg til dette skjemaet. Hvis du har klikket på en lenke som førte deg hit, setter vi pris på om du melder fra om hvilken lenke du klikket på.',
    ).should('be.visible');
  });

  it('should display 404 error page for invalid url', () => {
    cy.visit('/dfgdfg?sub=digital', { failOnStatusCode: false });
    cy.contains('Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.').should('be.visible');
  });

  it('should display 500 error page', () => {
    cy.mocksUseRouteVariant('get-digital-only:failure');
    cy.visit('/digitalonly?sub=digital', { failOnStatusCode: false });
    cy.contains(
      'En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du gjorde.',
    ).should('be.visible');
  });
});
