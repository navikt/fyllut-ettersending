describe("Testing layout component", () => {
  it("Should not show back button when referrer doesn't exists", () => {
    cy.visit("/lospost");
    cy.findByRole("link", { name: "Gå tilbake" }).should("not.exist");
  });

  it("Should show back button when document.referrer exists", () => {
    cy.visit("/lospost", {
      onBeforeLoad(win) {
        Object.defineProperty(win.document, "referrer", {
          get() {
            return Cypress.config("baseUrl");
          },
        });
      },
    });
    cy.findByRole("link", { name: "Gå tilbake" }).should("exist");
  });

  it("Should show back button when qs referrer exists", () => {
    cy.visit("/lospost?referrer=" + Cypress.config("baseUrl"));
    cy.findByRole("link", { name: "Gå tilbake" }).should("exist");
  });
});
