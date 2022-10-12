describe("Axe testing for main page", () => {
  before(() => {
    cy.visit("/");
    cy.injectAxe();
  });

  it("tests axe for the entire website", () => {
    cy.findByRole("main").should("exist");
    cy.checkA11y(".main");
    cy.get("button").contains("Send i posten").click();
    cy.url().should("include", "/velg-skjema");
    cy.findByRole("main").should("exist");
    cy.checkA11y(".main");
    cy.get("[type=\"radio\"]").eq(1).check();
    cy.get("[name=\"nameOfUploadedDocument\"]").click().type("Application for parental leave");
    cy.get("[type=\"radio\"]").check("has-social-number");
    cy.get("[name=\"socialSecurityNo\"]").click().type("09020479105");
    cy.findByRole("main").should("exist");
    cy.checkA11y(".main");
  });
});
