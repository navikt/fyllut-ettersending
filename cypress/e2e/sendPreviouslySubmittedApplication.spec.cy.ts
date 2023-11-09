import { TestButtonText, TestLinkText } from './testUtils';

describe.only('sendPreviouslySubmittedApplication', () => {
  it('fill out and send documentation by mail, should redirect to subType-page', () => {
    cy.visit('/detaljer/form2');
    cy.url().should('include', 'innsendings-metode');
    cy.get('a').contains(TestLinkText.sendPaper).click();
    cy.url().should('include', 'detaljer').should('include', '?sub=paper');
    cy.get('[type="checkbox"]').first().check();
    cy.get('[type="radio"]').check('hasSocialNumber');
    cy.get('[name="socialSecurityNo"]').click();
    cy.get('[name="socialSecurityNo"]').type('28119135003');
    cy.get('button').contains(TestButtonText.next).click();
    cy.url().should('include', '/last-ned');

    // Soft navigation check
    cy.go('back');
    cy.url().should('include', '/detaljer');
    cy.go('forward');
    cy.url().should('include', '/last-ned');
  });

  it('fill out and send documentation digitally, should redirect to subType-page', () => {
    cy.visit('/detaljer/form2');
    cy.url().should('include', 'innsendings-metode');
    cy.get('a').contains(TestLinkText.sendDigital).click();
    cy.url().should('include', 'detaljer').should('include', '?sub=digital');
    cy.findByRole('checkbox', { name: 'Legeerklæring om alminnelig helsetilstand' }).check();
    cy.findByRole('checkbox', { name: 'Annen dokumentasjon' }).check();
    cy.get('button').contains(TestButtonText.next).click();
    cy.url().should('include', '/sendinn/opprettSoknadResource?erEttersendelse=true');
    cy.url({ decode: true }).should('include', 'skjemanummer=NAV 10-07.50');
    cy.url().should('include', 'vedleggsIder=N6,L9');
  });

  it('fill out + submit, should not redirect to subType-page', () => {
    cy.visit('/detaljer/form3');
    cy.get('[type="checkbox"]').first().check();
    cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');
    cy.get('[type="radio"]').check('hasSocialNumber');
    cy.get('[name="socialSecurityNo"]').click();
    cy.get('[name="socialSecurityNo"]').type('28119135003');
    cy.get('button').contains(TestButtonText.next).click();
    cy.url().should('include', '/last-ned');
  });
});
