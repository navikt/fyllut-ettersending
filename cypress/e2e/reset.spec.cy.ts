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
    // Skriv inn "test" i tekstboksen
    cy.findAllByRole("textbox").focus().type("test");

    // Klikk det første skjemaet
    cy.get('[data-cy="searchResults"]').findAllByRole("link").eq(0).click();

    // Sjekk at URLen inneholder "/detaljer"
    cy.url().should("include", "/detaljer");

    // Sjekk av checboxen
    cy.findAllByRole("checkbox").first().check();

    // Gå tilbake
    cy.findByRole("link", { name: TestButtonText.previous }).click();

    // Skriv inn "hund" i tekstboksen
    cy.findAllByRole("textbox").click().type("hund");

    // Klikk det andre skjemaet
    cy.get('[data-cy="searchResults"]').findAllByRole("link").eq(0).click();

    // Sjekk at URLen inneholder "/detaljer"
    cy.url().should("include", "/detaljer");

    // Waiting in order to trigger the bug where attachment checkbox is checked
    cy.wait(20);

    // Sjekk at checkboxen ikke er sjekket
    cy.findAllByRole("checkbox").should("not.be.checked");

    // Sjekk at ingen av checkboxene er sjekket (formet er resatt)
    cy.findAllByRole("checkbox").each(($el) => {
      cy.wrap($el).should("have.not.attr", "checked");
    });
  });
});
