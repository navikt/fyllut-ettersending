describe("Testing layout component", () => {
  it("Should not show back button on front page", () => {
    cy.visit("/");
    cy.contains("button", "Gå tilbake").should("not.exist");
  });

  it("Should show back button after going to 'lospost' page", () => {
    cy.visit("/");
    cy.contains("button", "Annen dokumentasjon").click();
    cy.contains("button", "Gå tilbake").should("exist");
  });
});
