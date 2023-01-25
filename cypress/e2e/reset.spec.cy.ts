describe("reset", () => {
  before(() => {
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/forms`).as("getForms");
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/archive-subjects`).as("getArchiveSubjects");
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/nav-units`).as("getNavUnits");
    cy.visit("/");
    cy.wait("@getForms");
    cy.wait("@getArchiveSubjects");
    cy.wait("@getNavUnits");
  });

  it("resets formData when a different form is selected than the one previously selected",
    () => {
      cy.findAllByRole("radio").eq(0).check();
      cy.findAllByRole("textbox").focus().type("test");
      cy.findAllByRole("link").eq(1).click();
      cy.url().should("include", "/detaljer");
      cy.findAllByRole("checkbox").first().check();
      cy.findByRole("link").click();
      cy.findAllByRole("textbox").click().type("form2");
      cy.findAllByRole("link").eq(1).click();
      cy.url().should("include", "/detaljer");
      cy.findAllByRole("checkbox").should("not.be.checked");
      cy.findAllByRole("checkbox").each(($el) => {
        cy.wrap($el).should("have.not.attr", "checked");
      });
    }
  );
});
