describe(
  "sendAnotherDocument",
  {
    defaultCommandTimeout: 10000,
  },
  () => {
    before(() => {
      cy.visit("http://localhost:3002/");
    });

    it('clicks "send i posten" button', () => {
      cy.get("button").eq(1).click();
      cy.url().should("include", "/velg-skjema");

      //Populate velg skjema page
      cy.get('[type="radio"]').eq(1).check();
      cy.get('[name="nameOfUploadedDocument"]').click().type("Application for parental leave");
      cy.get('[name="subjectOfSubmission"]').select("Permittering og masseoppsigelser");
      cy.get('[type="radio"]').check("no-social-number");
      cy.get('[name="fornavn"]').click().type("Ola");
      cy.get('[name="etternavn"]').click().type("Nordmann");
      cy.get('[name="gateAddresse"]').click().type("Addresse 1");
      cy.get('[name="postnr"]').click().type("0001");
      cy.get('[name="poststed"]').click().type("Oslo");
      cy.get('[name="land"]').click().type("Norway");
      cy.get("button").eq(0).click();

      //Last ned page
      cy.url().should("include", "/last-ned");
      cy.get("button").eq(0).click();
    });
  }
);
