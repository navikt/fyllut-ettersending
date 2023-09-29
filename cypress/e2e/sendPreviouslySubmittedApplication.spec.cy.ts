import { TestButtonText } from "./testUtils";

describe.only("sendPreviouslySubmittedApplication", () => {
  beforeEach(() => {
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/forms`).as("getForms");
    cy.visit("/ettersendelse");
    cy.wait("@getForms");
  });
  after(() => {
    cy.mocksRestoreRouteVariants();
  });

  it("fill out and send documentation by mail", () => {
    cy.get('[name="search"]').click().type("førerhund");
    cy.get('[data-cy="searchResults"]').findAllByRole("link").eq(1).click(); // Paper
    cy.url().should("include", "/detaljer");
    cy.get('[type="checkbox"]').first().check();
    cy.get('[type="radio"]').check("hasSocialNumber");
    cy.get('[name="socialSecurityNo"]').click().type("28119135003");
    cy.get("button").contains(TestButtonText.next).click();
    cy.url().should("include", "/last-ned");
  });

  it("fill out and send documentation digitally", () => {
    cy.get('[name="search"]').click().type("førerhund");
    cy.get('[data-cy="searchResults"]').findAllByRole("link").eq(0).click(); // Digital
    cy.url().should("include", "/detaljer");
    cy.findByRole("checkbox", { name: "Legeerklæring om alminnelig helsetilstand" }).check();
    cy.findByRole("checkbox", { name: "Annen dokumentasjon" }).check();
    cy.get("button").contains(TestButtonText.next).click();
    cy.url().should("include", "/sendinn/opprettSoknadResource?erEttersendelse=true");
    cy.url({ decode: true }).should("include", "skjemanummer=NAV 10-07.50");
    cy.url().should("include", "vedleggsIder=N6,L9");
  });
});
