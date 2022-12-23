describe.only("sendPreviouslySubmittedApplication", () => {
  const startUrl = "/velg-skjema";
  before(() => {
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/forms`).as("getForms");
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/archive-subjects`).as("getArchiveSubjects");
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/nav-units`).as("getNavUnits");
    cy.visit(startUrl);
    cy.wait("@getForms");
    cy.wait("@getArchiveSubjects");
    cy.wait("@getNavUnits");
  });

  it("fill out send documentation", () => {
    cy.findAllByRole("radio").eq(0).check();
    cy.get("[name=\"search\"]").click().type("førerhund");
    cy.findAllByRole("link").eq(1).click();
    cy.url().should("include", "/detaljer");
    cy.get("[type=\"checkbox\"]").first().check();
    cy.get("[type=\"radio\"]").check("hasSocialNumber");
    cy.get("[name=\"socialSecurityNo\"]").click().type("28119135003");
    cy.get("button").contains("Neste").click();
    cy.url().should("include", "/last-ned");
  });
});
