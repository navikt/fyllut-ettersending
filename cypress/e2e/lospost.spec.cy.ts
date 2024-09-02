import { TestLinkText } from './testUtils';

describe('Løspost - Landingsside', () => {
  describe('No predefined submission type', () => {
    beforeEach(() => {
      cy.intercept('GET', `${Cypress.config('baseUrl')}/api/archive-subjects`).as('getArchiveSubjects');
    });

    it('Lets user choose submission type', () => {
      cy.visit('/lospost');
      cy.get('a').contains(TestLinkText.sendDigital).should('exist');
      cy.get('a').contains(TestLinkText.sendPaper).should('exist');
    });

    it('Redirects to digital with tema', () => {
      cy.visit('/lospost?tema=PEN');
      cy.get('a').contains(TestLinkText.sendDigital).click();
      cy.url().should('contain', '/lospost/digital?tema=PEN');
      cy.wait('@getArchiveSubjects');
    });

    it('Redirects to paper with tema', () => {
      cy.visit('/lospost?tema=BIL');
      cy.get('a').contains(TestLinkText.sendPaper).click();
      cy.url().should('contain', '/lospost/paper?tema=BIL');
      cy.wait('@getArchiveSubjects');
    });

    it('Redirects to paper with no tema', () => {
      cy.visit('/lospost');
      cy.get('a').contains(TestLinkText.sendPaper).click();
      cy.url().should('contain', '/lospost/paper');
      cy.wait('@getArchiveSubjects');
      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('exist');
    });
  });

  describe('Automatic redirects from submission type in query parameter', () => {
    it('Redirects to page for paper lospost', () => {
      cy.visit('/lospost?sub=paper');
      cy.findByRole('button', { name: 'Gå videre' }).should('exist');
      cy.url().should('contain', '/lospost/paper');
    });

    it('Redirects and keeps tema', () => {
      cy.visit('/lospost?sub=paper&tema=BIL');
      cy.findByRole('button', { name: 'Gå videre' }).should('exist');
      cy.url().should('contain', '/lospost/paper?tema=BIL');
    });

    it('Redirects and keeps language', () => {
      cy.visit('/en/lospost?sub=paper');
      cy.findByRole('button', { name: 'Next' }).should('exist');
      cy.url().should('contain', '/en/lospost/paper');
    });

    it('Redirects and keeps language and tema', () => {
      cy.visit('/en/lospost?sub=paper&tema=PEN');
      cy.findByRole('button', { name: 'Next' }).should('exist');
      cy.url().should('contain', '/en/lospost/paper?tema=PEN');
    });

    it('Redirects to page for digital lospost', () => {
      cy.visit('/lospost?sub=digital');
      cy.findByRole('button', { name: 'Gå videre' }).should('exist');
      cy.url().should('contain', '/lospost/digital');
    });
  });
});
