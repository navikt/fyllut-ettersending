describe("Axe testing for main page", () => {
  before(() => {
    cy.visit("/");
    cy.injectAxe();
  });

  it("tests axe for the entire website", () => {
    cy.findByRole("main").should("exist");
    cy.checkA11y(".main");
    cy.get("[type=\"radio\"]").eq(1).check();
    cy.get("[name=\"otherDocumentationTitle\"]").click().type("Application for parental leave");
    cy.findByRole("main").should("exist");
    cy.checkA11y(".main");
  });
});
