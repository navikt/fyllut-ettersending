import { TestButtonText } from "./testUtils";

describe("reset", () => {
  before(() => {
    cy.intercept("GET", `${Cypress.config("baseUrl")}/api/forms`).as("getForms");
    cy.visit("/ettersendelse", {
      onBeforeLoad(win) {
        Object.defineProperty(win.document, "referrer", {
          get() {
            return Cypress.config("baseUrl") + "/ettersendelse";
          },
        });
      },
    });
    cy.wait("@getForms");
  });
  after(() => {
    cy.mocksRestoreRouteVariants();
  });

  it("resets formData when a different form is selected than the one previously selected", () => {
    // Write "test" in the textbox
    cy.findAllByRole("textbox").focus().type("test");

    // Click the second form in the list (digital)
    cy.get('[data-cy="searchResults"]').findAllByRole("link").eq(0).click();

    // Check that the URL contains "/detaljer"
    cy.url().should("include", "/detaljer");

    // Check the checbox
    cy.findAllByRole("checkbox").first().check();

    // Go back
    cy.findByRole("link", { name: TestButtonText.previous }).click();

    // Write "hund" in the textbox
    cy.findAllByRole("textbox").click().type("hund");

    // Click the second form in the list (paper)
    cy.get('[data-cy="searchResults"]').findAllByRole("link").eq(1).click();

    // Check that the URL contains "detaljer"
    cy.url().should("include", "/detaljer");

    // Waiting in order to trigger the bug where attachment checkbox is checked
    cy.wait(20);

    // Check that the checbox isn't checked
    cy.findAllByRole("checkbox").should("not.be.checked");

    // Check that none of the checkboxes are checked (the form is reset)
    cy.findAllByRole("checkbox").each(($el) => {
      cy.wrap($el).should("have.not.attr", "checked");
    });
  });
});
