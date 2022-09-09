describe.only(
  "sendPreviouslySubmittedApplication",
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
      cy.get('[name="search"]').click().type("førerhund");
      cy.get(".clickable").parent().click();
      cy.url().should("include", "/detaljer");
      cy.get('[type="checkbox"]').first().check();
      cy.get('[type="radio"]').check("has-social-number");
      cy.get('[name="socialSecurityNo"]').click().type("28119135003");
      cy.get("button").eq(0).click();
      cy.url().should("include", "/last-ned");
    });
  }
);
