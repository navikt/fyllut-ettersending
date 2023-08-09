import {TestButtonText} from "./testUtils";

describe("sendAnotherDocument", () => {

  const SUBJECT_PER = {
    subject: "PER",
    title: "Permittering og masseoppsigelser"
  }

  beforeEach(() => {
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/archive-subjects`).as("getArchiveSubjects");
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/nav-units`).as("getNavUnits");
  });

  describe("form", () => {
    beforeEach(() => {
      cy.visit("/lospost");
      cy.wait("@getArchiveSubjects");
      cy.wait("@getNavUnits");
      // Intercept: Download cover page pdf
      cy.intercept("POST", `${Cypress.config("baseUrl")}/api/download`, (req) => {
        expect(req.body.subjectOfSubmission).to.equal(SUBJECT_PER.subject);
        expect(req.body.titleOfSubmission).to.equal(SUBJECT_PER.title);
        req.reply("mock-pdf");
      }).as("downloadForsteside");
    });

    it("accepts data provided by user when requesting cover page", () => {
      //Populate velg skjema page
      cy.get('[name="otherDocumentationTitle"]').click().type("Application for parental leave");
      cy.get('[name="subjectOfSubmission"]').select(SUBJECT_PER.title);
      cy.findAllByRole("radio").check("noSocialNumber");
      cy.get('[name="firstName"]').click().type("Ola");
      cy.get('[name="lastName"]').click().type("Nordmann");
      cy.get('[name="streetName"]').click().type("Addresse 1");
      cy.get('[name="postalCode"]').click().type("0001");

      cy.get('[name="city"]').click().type("Oslo");
      cy.get('[name="country"]').click().type("Norway");
      cy.findAllByRole("radio").check("false");

      cy.get("button").contains(TestButtonText.next).click();

      //Download page
      cy.url().should("include", "/last-ned");
      cy.findByRole("button", {name: TestButtonText.downloadCoverPage}).should("exist").click();
    });

  });

  describe("query param 'tema'", () => {

    beforeEach(() => {
      cy.visit(`/lospost?tema=${SUBJECT_PER.subject}`);
      cy.wait("@getArchiveSubjects");
      cy.wait("@getNavUnits");
      // Intercept: Download cover page pdf
      cy.intercept("POST", `${Cypress.config("baseUrl")}/api/download`, (req) => {
        expect(req.body.subjectOfSubmission).to.equal(SUBJECT_PER.subject);
        expect(req.body.titleOfSubmission).to.equal(SUBJECT_PER.title);
        req.reply("mock-pdf");
      }).as("downloadForsteside");
    });

    it("uses subject from query param, user provides rest of data", () => {
      cy.get('[name="otherDocumentationTitle"]').click().type("Application for parental leave");
      cy.get('[name="subjectOfSubmission"]').should("not.exist");
      cy.findAllByRole("radio").check("hasSocialNumber");
      cy.get('[name="socialSecurityNo"]').click().type("16020256145");
      cy.get("button").contains(TestButtonText.next).click();

      //Download page
      cy.url().should("include", "/last-ned");
      cy.findByRole("button", {name: TestButtonText.downloadCoverPage}).should("exist").click();
    });

  });
});
