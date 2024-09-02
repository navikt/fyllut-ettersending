import { TestButtonText, TestLinkText } from './testUtils';

describe('Axe testing for main page', () => {
  before(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('tests axe for the entire website', () => {
    cy.findByRole('main').should('exist');
    cy.checkA11y('.main');
    cy.contains('button', TestButtonText.otherDocumentation).click();
    cy.get('a').contains(TestLinkText.sendPaper).click();
    cy.get('[name="otherDocumentationTitle"]').click();
    cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');
    cy.findByRole('main').should('exist');
    cy.checkA11y('.main');
  });
});
