describe.only("sendPreviouslySubmittedApplication", () => {
  before(() => {
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/forms`).as("getForms");
    cy.visit("/ettersendelse");
    cy.wait("@getForms");
  });

  it("fill out and send documentation by mail", () => {
    cy.get('[name="search"]').click().type("førerhund");
    cy.get('[data-cy="searchResults"]').findAllByRole("link").eq(0).click();
    cy.url().should("include", "/detaljer");
    cy.get('[type="checkbox"]').first().check();
    cy.get('[type="radio"]').check("byMail");
    cy.get('[type="radio"]').check("hasSocialNumber");
    cy.get('[name="socialSecurityNo"]').click().type("28119135003");
    cy.get("button").contains("Neste").click();
    cy.url().should("include", "/last-ned");
  });
});
