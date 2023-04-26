describe.only("sendPreviouslySubmittedApplication", () => {
  beforeEach(() => {
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

  it("fill out and send documentation digitally", () => {
    cy.get('[name="search"]').click().type("førerhund");
    cy.get('[data-cy="searchResults"]').findByRole("link", { name: "Søknad om førerhund NAV 10-07.50" }).click();
    cy.url().should("include", "/detaljer");
    cy.get('[type="checkbox"]').first().check();
    cy.get('[type="checkbox"]').eq(2).check();
    cy.get('[type="radio"]').check("digital");
    cy.get("button").contains("Neste").click();
    cy.url().should("include", "erEttersendelse=true");
    cy.url({ decode: true }).should("include", "skjemanummer=NAV 10-07.50");
    cy.url().should("include", "vedleggsIder=L9,N6");
  });
});
