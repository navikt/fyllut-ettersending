import {TestButtonText} from "./testUtils";

describe("Testing layout component", () => {
  it("Should not show back button on front page", () => {
    cy.visit("/");
    cy.findByRole("link", { name: TestButtonText.previous }).should("not.exist");
  });

  it("Should show back button after going to 'lospost' page", () => {
    cy.visit("/lospost");
    cy.findByRole("link", { name: TestButtonText.previous }).should("exist");
  });
});
