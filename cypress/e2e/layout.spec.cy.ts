describe("Testing layout component", () => {
  it("Should not show back button on front page", () => {
    cy.visit("/");
    cy.findByRole("link", { name: "Gå tilbake" }).should("not.exist");
  });

  it("Should show back button after going to 'lospost' page", () => {
    cy.visit("/lospost");
    cy.findByRole("link", { name: "Gå tilbake" }).should("exist");
  });
});
