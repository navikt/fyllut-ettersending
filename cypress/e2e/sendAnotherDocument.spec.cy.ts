describe(
  "sendAnotherDocument",
  {
    defaultCommandTimeout: 10000,
  },
  () => {
    before(() => {
      cy.visit("/velg-skjema");
    });

    it("send another document", () => {
      //Populate velg skjema page
      cy.get("[type=\"radio\"]").eq(1).check();
      cy.get("[name=\"nameOfUploadedDocument\"]").click().type("Application for parental leave");
      cy.get("[name=\"subjectOfSubmission\"]").select("Permittering og masseoppsigelser");
      cy.get("[type=\"radio\"]").check("no-social-number");
      cy.get("[name=\"fornavn\"]").click().type("Ola");
      cy.get("[name=\"etternavn\"]").click().type("Nordmann");
      cy.get("[name=\"gateAddresse\"]").click().type("Addresse 1");
      cy.get("[name=\"postnr\"]").click().type("0001");
      cy.get("[name=\"poststed\"]").click().type("Oslo");
      cy.get("[name=\"land\"]").click().type("Norway");
      cy.get("button").contains("Neste").click();

      //Download page
      cy.url().should("include", "/last-ned");
    });
  }
);
