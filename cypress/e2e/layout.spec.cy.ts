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

  it('Should keep query params when navigating to previous page', () => {
    const baseUrl = Cypress.config('baseUrl')!;
    cy.visit('/lospost/digital?tema=SYK&gjelder=Bestridelse&referrer=' + encodeURIComponent(`${baseUrl}/lospost`));
    cy.findByRole('link', { name: TestButtonText.previous }).should('exist').click();
    cy.url().should('equal', `${baseUrl}/lospost?tema=SYK&gjelder=Bestridelse`);
  });
});
