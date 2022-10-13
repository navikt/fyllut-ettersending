describe.only(
  "sendPreviouslySubmittedApplication",
  {
    defaultCommandTimeout: 10000,
  },
  () => {
    before(() => {
      cy.visit("/velg-skjema");
    });

    it("fill out send documentation", () => {
      cy.get("[name=\"search\"]").click().type("førerhund");
      cy.findAllByRole("link").eq(1).click();
      cy.url().should("include", "/detaljer");
      cy.get("[type=\"checkbox\"]").first().check();
      cy.get("[type=\"radio\"]").check("has-social-number");
      cy.get("[name=\"socialSecurityNo\"]").click().type("28119135003");
      cy.get("button").contains("Neste").click();
      cy.url().should("include", "/last-ned");
    });
  }
);
