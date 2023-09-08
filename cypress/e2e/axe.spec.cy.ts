import {TestButtonText} from "./testUtils";

describe("Axe testing for main page", () => {
  before(() => {
    cy.visit("/");
    cy.injectAxe();
  });

  it("tests axe for the entire website", () => {
    cy.findByRole("main").should("exist");
    cy.checkA11y(".main");
    cy.contains("button", TestButtonText.otherDocumentation).click()
    cy.get("[name=\"otherDocumentationTitle\"]").click().type("Application for parental leave");
    cy.findByRole("main").should("exist");
    cy.checkA11y(".main");
  });
});
