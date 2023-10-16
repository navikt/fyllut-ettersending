import { TestButtonText } from './testUtils';

describe('sendAnotherDocument', () => {
  const SUBJECT_PER = {
    subject: 'PER',
    title: 'Permittering og masseoppsigelser',
  };

  const NAV_UNIT = {
    name: 'Dagpenger',
  };

  beforeEach(() => {
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/archive-subjects`).as('getArchiveSubjects');
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/nav-units`).as('getNavUnits');
  });

  describe('form', () => {
    beforeEach(() => {
      cy.visit('/lospost');
      cy.wait('@getArchiveSubjects');
      cy.wait('@getNavUnits');
      // Intercept: Download cover page pdf
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_PER.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_PER.title);
        expect(req.body.title).to.equal(
          'Innsendingen gjelder: Permittering og masseoppsigelser - Application for parental leave',
        );
        req.reply('mock-pdf');
      }).as('downloadForsteside');
    });

    it('should be able to fill out the form and go to next page (noSocialNumber)', () => {
      //Populate velg skjema page
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');

      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_PER.subject}{downArrow}{enter}`);

      // "Hvem gjelder innsendingen for?"
      cy.findAllByRole('radio').check('noSocialNumber');

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

      // "Har du vært i kontakt med NAV før?"
      cy.findAllByRole('radio').check('true');
      cy.get('[name="contactInformationNavUnit"]').click();
      cy.get('[name="contactInformationNavUnit"]').type(`${NAV_UNIT.name}{downArrow}{enter}`);

      cy.get('button').contains(TestButtonText.next).click();

      //Download page

      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
    });

    it('should be able to fill out the form and go to next page (other)', () => {
      //Populate velg skjema page
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');

      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_PER.subject}{downArrow}{enter}`);

      // "Hvem gjelder innsendingen for?"
      cy.findAllByRole('radio').check('other');

      // "Velg hvilken NAV-enhet som skal motta innsendingen"
      cy.get('[name="chooseUserNavUnit"]').click();
      cy.get('[name="chooseUserNavUnit"]').type(`${NAV_UNIT.name}{downArrow}{enter}`);

      cy.get('button').contains(TestButtonText.next).click();

      // Soft navigation check
      cy.url().should('include', '/last-ned');
      cy.go('back');
      cy.url().should('include', '/lospost');
      cy.go('forward');

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
    });
  });

  describe("query param 'tema'", () => {
    beforeEach(() => {
      cy.visit(`/lospost?tema=${SUBJECT_PER.subject}`);
      cy.wait('@getArchiveSubjects');
      cy.wait('@getNavUnits');
      // Intercept: Download cover page pdf
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_PER.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_PER.title);
        expect(req.body.title).to.equal(
          'Innsendingen gjelder: Permittering og masseoppsigelser - Application for parental leave',
        );
        req.reply('mock-pdf');
      }).as('downloadForsteside');
    });

    it('should hide combobox, use subject from query param and be able to fill out and go to next page', () => {
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');
      cy.get('[name="subjectOfSubmission"]').should('not.exist');
      cy.findAllByRole('radio').check('hasSocialNumber');
      cy.get('[name="socialSecurityNo"]').click();
      cy.get('[name="socialSecurityNo"]').type('16020256145');
      cy.get('button').contains(TestButtonText.next).click();

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
    });
  });

  describe("query param invalid 'tema'", () => {
    beforeEach(() => {
      cy.visit('/lospost?tema=invalid');
      cy.wait('@getArchiveSubjects');
      cy.wait('@getNavUnits');
      // Intercept: Download cover page pdf
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_PER.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_PER.title);
        req.reply('mock-pdf');
      }).as('downloadForsteside');
    });

    it('should show combobox for subject and be able to fill out and go to next page', () => {
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');
      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_PER.subject}{downArrow}{enter}`);
      cy.findAllByRole('radio').check('hasSocialNumber');
      cy.get('[name="socialSecurityNo"]').click();
      cy.get('[name="socialSecurityNo"]').type('16020256145');
      cy.get('button').contains(TestButtonText.next).click();

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
    });
  });

  describe('hard navigate to download-page', () => {
    it(' should redirect back to lospost', () => {
      cy.visit('/last-ned/lospost');
      cy.url().should('not.include', '/last-ned');
    });
  });
});
