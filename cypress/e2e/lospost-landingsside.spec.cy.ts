import { TestLinkText } from './testUtils';

describe('Løspost - Landingsside', () => {
  describe('No predefined submission type', () => {
    it('Lets user choose submission type', () => {
      cy.visit('/lospost');
      cy.get('a').contains(TestLinkText.sendDigital).should('exist');
      cy.get('a').contains(TestLinkText.sendPaper).should('exist');
    });

    it('Redirects to digital with tema', () => {
      cy.visit('/lospost?tema=PEN');
      cy.get('a').contains(TestLinkText.sendDigital).click();
      cy.url().should('contain', '/lospost/digital?tema=PEN');
    });

    it('Redirects to paper with tema', () => {
      cy.visit('/lospost?tema=BIL');
      cy.get('a').contains(TestLinkText.sendPaper).click();
      cy.url().should('contain', '/lospost/paper?tema=BIL');
    });

    it('Redirects to paper with no tema', () => {
      cy.visit('/lospost');
      cy.get('a').contains(TestLinkText.sendPaper).click();
      cy.url().should('contain', '/lospost/paper');
      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('exist');
    });

    describe('Illegal tema for digital submission', () => {
      it('Redirects to paper with tema PER', () => {
        cy.visit('/lospost?tema=PER');
        cy.url().should('contain', '/lospost/paper?tema=PER');
      });

      it('Redirects to paper with tema TIL', () => {
        cy.visit('/lospost?tema=TIL');
        cy.url().should('contain', '/lospost/paper?tema=TIL');
      });
    });
  });

  describe('Predefined document title', () => {
    it('Redirects to paper with predefined document title', () => {
      cy.visit('/lospost?team=SYK&dokumentnavn=Bestridelse%3A');
      cy.get('a').contains(TestLinkText.sendPaper).click();
      cy.url().should('contain', '/lospost/paper');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .should('have.value', 'Bestridelse:');
    });

    it('Redirects to digital with predefined document title', () => {
      cy.visit('/lospost?team=SYK&dokumentnavn=Bestridelse%3A');
      cy.get('a').contains(TestLinkText.sendDigital).click();
      cy.url().should('contain', '/lospost/digital');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .should('have.value', 'Bestridelse:');
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
