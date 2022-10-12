describe.only(
  "sendPreviouslySubmittedApplication",
  {
    defaultCommandTimeout: 10000,
  },
  () => {
    before(() => {
      cy.visit("/");
    });

    it("clicks \"send i posten\" button", () => {
      cy.get("button").contains("Send i posten").click();
      cy.url().should("include", "/velg-skjema");
      cy.get("[name=\"search\"]").click().type("førerhund");
      cy.findAllByRole("link").first().click();
      cy.url().should("include", "/detaljer");
      cy.get("[type=\"checkbox\"]").first().check();
      cy.get("[type=\"radio\"]").check("has-social-number");
      cy.get("[name=\"socialSecurityNo\"]").click().type("28119135003");
      cy.get("button").contains("Neste").click();
      cy.url().should("include", "/last-ned");
    });
  }
);
