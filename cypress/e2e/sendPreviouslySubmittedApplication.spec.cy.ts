import { TestButtonText, TestLinkText } from './testUtils';

const FORM2 = {
  formId: 'form2',
  formNumber: 'NAV 10-07.50',
  title: 'Søknad om førerhund',
  tema: 'HJE',
};

const NAV_UNIT = {
  name: 'Dagpenger - Grensearbeider inn',
  number: '4465',
};

describe('downloading forsteside pdf', () => {
  beforeEach(() => {
    // Intercept: Download cover page pdf
    cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
      expect(req.body.formData.formId).to.equal(FORM2.formId);
      expect(req.body.formData.formNumber).to.equal(FORM2.formNumber);
      expect(req.body.formData.title).to.equal(FORM2.title);
      expect(req.body.formData.userData.navUnit.number).to.equal(NAV_UNIT.number);
      expect(req.body.formData.userData.navUnit.name).to.equal(NAV_UNIT.name);
      req.reply('mock-pdf');
    }).as('downloadForsteside');
  });
  it('should fill out fields and download pdf with correct information', () => {
    cy.visit('/form2');
    cy.url().should('include', 'innsendingsvalg');
    cy.get('a').contains(TestLinkText.sendPaper).click();
    cy.url().should('include', '?sub=paper');
    cy.get('[type="checkbox"]').first().check();

    // "Hvem gjelder innsendingen for?"
    cy.get('[type="radio"]').check('noSocialNumber');

    cy.get('[name="firstName"]').click();
    cy.get('[name="firstName"]').type('Ola');

    cy.get('[name="lastName"]').click();
    cy.get('[name="lastName"]').type('Nordmann');

    cy.get('[name="streetName"]').click();
    cy.get('[name="streetName"]').type('Addresse 1');

    cy.get('[name="postalCode"]').click();
    cy.get('[name="postalCode"]').type('0001');

    cy.get('[name="city"]').click();
    cy.get('[name="city"]').type('Oslo');

    cy.get('[name="country"]').click();
    cy.get('[name="country"]').type('Norway');

    // "Har du vært i kontakt med NAV om denne saken tidligere?"
    cy.findAllByRole('radio').check('true');

    // "Velg hvilken NAV-enhet som skal motta innsendingen"
    cy.get('[name="contactInformationNavUnit"]').click();
    cy.get('[name="contactInformationNavUnit"]').type(`${NAV_UNIT.name}{downArrow}{enter}`);

    cy.get('button').contains(TestButtonText.next).click();

    // Download page
    cy.url().should('include', '/last-ned');
    cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
  });
});

describe('sendPreviouslySubmittedApplication', () => {
  it('fill out and send documentation by mail, should redirect to subType-page', () => {
    cy.visit('/form2');
    cy.url().should('include', 'innsendingsvalg');
    cy.get('a').contains(TestLinkText.sendPaper).click();
    cy.url().should('include', '?sub=paper');
    cy.get('[type="checkbox"]').first().check();
    cy.get('[type="radio"]').check('hasSocialNumber');
    cy.get('[name="socialSecurityNo"]').click();
    cy.get('[name="socialSecurityNo"]').type('28119135003');
    cy.get('button').contains(TestButtonText.next).click();
    cy.url().should('include', '/last-ned');

    // Soft navigation check
    cy.go('back');
    cy.url().should('not.include', '/last-ned');
    cy.go('forward');
    cy.url().should('include', '/last-ned');
  });

  it('fill out and send documentation digitally, should redirect to subType-page', () => {
    cy.visit('/form2');
    cy.url().should('include', 'innsendingsvalg');
    cy.get('a').contains(TestLinkText.sendDigital).click();
    cy.url().should('include', '?sub=digital');
    cy.findByRole('checkbox', { name: 'Legeerklæring om alminnelig helsetilstand' }).check();
    cy.findByRole('checkbox', { name: 'Annen dokumentasjon' }).check();
    cy.get('button').contains(TestButtonText.next).click();
    cy.url().should('include', '/sendinn/bd86463d-ad04-43e8-a80a-9ecd22bae7c0');
  });

  it('fill out + submit, should not redirect to subType-page', () => {
    cy.visit('/form3');
    cy.get('[type="checkbox"]').first().check();
    cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');
    cy.get('[type="radio"]').check('hasSocialNumber');
    cy.get('[name="socialSecurityNo"]').click();
    cy.get('[name="socialSecurityNo"]').type('28119135003');
    cy.get('button').contains(TestButtonText.next).click();
    cy.url().should('include', '/last-ned');
  });
});
