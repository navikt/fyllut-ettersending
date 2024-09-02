import { TestButtonText } from './testUtils';

describe('Testing layout component', () => {
  it("Should not show back button when referrer doesn't exists", () => {
    cy.visit('/lospost/paper');
    cy.findByRole('link', { name: TestButtonText.previous }).should('not.exist');
  });

  it('Should show back button when document.referrer exists', () => {
    cy.visit('/lospost/paper', {
      onBeforeLoad(win) {
        Object.defineProperty(win.document, 'referrer', {
          get() {
            return Cypress.config('baseUrl');
          },
        });
      },
    });
    cy.findByRole('link', { name: TestButtonText.previous }).should('exist');
  });

  it('Should show back button when qs referrer exists', () => {
    cy.visit('/lospost/paper?referrer=' + encodeURIComponent(Cypress.config('baseUrl')!));
    cy.findByRole('link', { name: TestButtonText.previous }).should('exist');
  });

  it("Should show back button when qs referrer exists, and subdomain doesn't match", () => {
    cy.visit('/lospost/paper?referrer=' + encodeURIComponent('www.' + Cypress.config('baseUrl')));
    cy.findByRole('link', { name: TestButtonText.previous }).should('exist');
  });

  it("Should not show back button when referrer doesn't match", () => {
    cy.visit('/lospost/paper?referrer=' + encodeURIComponent('https://nrk.no'));
    cy.findByRole('link', { name: TestButtonText.previous }).should('not.exist');
  });
});
