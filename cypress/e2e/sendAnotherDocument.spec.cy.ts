import { ButtonText } from "../../src/data/text";

describe("sendAnotherDocument", () => {
  before(() => {
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/archive-subjects`).as("getArchiveSubjects");
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/nav-units`).as("getNavUnits");
    cy.visit("/lospost");
    cy.wait("@getArchiveSubjects");
    cy.wait("@getNavUnits");
  });

  it("send another document", () => {
    //Populate velg skjema page
    cy.get('[name="otherDocumentationTitle"]').click().type("Application for parental leave");
    cy.get('[name="subjectOfSubmission"]').select("Permittering og masseoppsigelser");
    cy.findAllByRole("radio").check("noSocialNumber");
    cy.get('[name="firstName"]').click().type("Ola");
    cy.get('[name="lastName"]').click().type("Nordmann");
    cy.get('[name="streetName"]').click().type("Addresse 1");
    cy.get('[name="postalCode"]').click().type("0001");
    cy.get('[name="city"]').click().type("Oslo");
    cy.get('[name="country"]').click().type("Norway");
    cy.findAllByRole("radio").check("false");

    cy.get("button").contains(ButtonText.next).click();

    //Download page
    cy.url().should("include", "/last-ned");
  });
});
