import { TestButtonText } from './testUtils';

describe('reset', () => {
  before(() => {
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/forms`).as('getForms');
    cy.visit('/ettersendelse', {
      onBeforeLoad(win) {
        Object.defineProperty(win.document, 'referrer', {
          get() {
            return Cypress.config('baseUrl') + '/ettersendelse';
          },
        });
      },
    });
    cy.wait('@getForms');
  });
  after(() => {
    cy.mocksRestoreRouteVariants();
  });

  it('resets formData when a different form is selected than the one previously selected', () => {
    // Write "test" in the textbox
    cy.findAllByRole('textbox').focus();
    cy.findAllByRole('textbox').type('test');

    // Click the second form in the list (digital)
    cy.get('[data-cy="searchResults"]').findByRole('link', { name: 'Testskjema (digital) Testnummer' }).click();

    // Check that the URL contain the form
    cy.url().should('include', '/form1');

    // Check the checbox
    cy.findAllByRole('checkbox').first().check();

    // Go back
    cy.findByRole('link', { name: TestButtonText.previous }).click();

    // Write "hund" in the textbox
    cy.findAllByRole('textbox').click();
    cy.findAllByRole('textbox').type('hund');

    // Click the second form in the list (paper)
    cy.get('[data-cy="searchResults"]')
      .findAllByRole('link', { name: 'Søknad om førerhund (papir) NAV 10-07.50' })
      .click();

    // Check that the URL contain the form
    cy.url().should('include', '/form2');

    // Check that the checbox isn't checked
    cy.findAllByRole('checkbox').should('not.be.checked');

    // Check that none of the checkboxes are checked (the form is reset)
    cy.findAllByRole('checkbox').each(($el) => {
      cy.wrap($el).should('have.not.attr', 'checked');
    });
  });
});
