import { TestButtonText } from './testUtils';

describe('sendAnotherDocument', () => {
  const SUBJECT_PER = {
    subject: 'PER',
    title: 'Permittering og masseoppsigelser',
  };

  const SUBJECT_TIL = {
    subject: 'TIL',
    title: 'Tiltak',
  };

  const NAV_UNIT = {
    name: 'Dagpenger - Grensearbeider inn',
    number: '4465',
  };

  beforeEach(() => {
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/archive-subjects`).as('getArchiveSubjects');
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/nav-units`).as('getNavUnits');
  });

  describe('form with tema=PER', () => {
    beforeEach(() => {
      cy.visit('/lospost/paper');
      cy.wait('@getArchiveSubjects');
      cy.wait('@getNavUnits');
      // Intercept: Download cover page pdf
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_PER.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_PER.title);
        expect(req.body.title).to.equal(
          'Innsendingen gjelder: Permittering og masseoppsigelser - Application for parental leave',
        );
        expect(req.body.formData.userData.navUnit.name).to.equal(NAV_UNIT.name);
        expect(req.body.formData.userData.navUnit.number).to.equal(NAV_UNIT.number);
        req.reply('mock-pdf');
      }).as('downloadForsteside');
    });

    it('should be able to fill out the form and go to next page (noSocialNumber)', () => {
      // Sjekker validering først
      cy.get('[data-cy="ValidationSummary"]').should('not.exist');
      cy.get('button').contains(TestButtonText.next).click();
      cy.focused()
        .should('have.attr', 'data-cy', 'ValidationSummary')
        .within(() => {
          cy.get('li').should('have.length', 3);
        });

      //Populate velg skjema page
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');

      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_PER.subject}{downArrow}{enter}`);

      // "Hvem gjelder innsendingen for?"
      cy.findAllByRole('radio').check('noSocialNumber');

      cy.get('button').contains(TestButtonText.next).should('be.visible').click();
      cy.focused()
        .should('have.attr', 'data-cy', 'ValidationSummary')
        .within(() => {
          cy.get('li').should('have.length', 7);
        });

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

      cy.get('[data-cy="ValidationSummary"]').should('not.exist');

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
      cy.url().should('include', '/lospost/paper');
      cy.go('forward');

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).click();
    });
  });

  describe("query param 'tema=PER'", () => {
    beforeEach(() => {
      cy.visit(`/lospost/paper?tema=${SUBJECT_PER.subject}`);
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

  describe("query param 'tema=TIL", () => {
    beforeEach(() => {
      cy.visit(`/lospost/paper?tema=${SUBJECT_TIL.subject}`);
      cy.wait('@getArchiveSubjects');
      cy.wait('@getNavUnits');
      // Intercept: Download cover page pdf
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_TIL.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_TIL.title);
        expect(req.body.title).to.equal('Innsendingen gjelder: Tiltak - Tiltak for noe');
        req.reply('mock-pdf');
      }).as('downloadForsteside');
    });
    it('should hide radio buttons, use subject from query param and be able to fill out and go to next page', () => {
      // Hvilken dokumentasjon vil du sende til NAV?
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Tiltak for noe');

      // Hva gjelder innsendingen?
      cy.get('[name="subjectOfSubmission"]').should('not.exist');

      // Hvem gjelder innsendingen for?
      cy.get('[name="userType').should('not.exist');

      // "Velg hvilken NAV-enhet som skal motta innsendingen"
      cy.get('[name="chooseUserNavUnit"]').click();
      cy.get('[name="chooseUserNavUnit"]').type(`${NAV_UNIT.name}{downArrow}{enter}`);

      cy.get('button').contains(TestButtonText.next).click();

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
    });
  });

  describe('form with tema=TIL', () => {
    beforeEach(() => {
      cy.visit('/lospost/paper');
      cy.wait('@getArchiveSubjects');
      cy.wait('@getNavUnits');
      // Intercept: Download cover page pdf
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_TIL.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_TIL.title);
        expect(req.body.title).to.equal('Innsendingen gjelder: Tiltak - Tiltak for noe');
        req.reply('mock-pdf');
      }).as('downloadForsteside');
    });

    it('should hide radio buttons and be able to fill out and go to next page', () => {
      // Hvilken dokumentasjon vil du sende til NAV?
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Tiltak for noe');

      // Hva gjelder innsendingen?
      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_TIL.title}{downArrow}{enter}`);

      // Hvem gjelder innsendingen for?
      cy.get('[name="userType').should('not.exist');

      // "Velg hvilken NAV-enhet som skal motta innsendingen"
      cy.get('[name="chooseUserNavUnit"]').click();
      cy.get('[name="chooseUserNavUnit"]').type(`${NAV_UNIT.name}{downArrow}{enter}`);

      cy.get('button').contains(TestButtonText.next).click();

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
    });
  });

  describe("query param invalid 'tema'", () => {
    beforeEach(() => {
      cy.visit('/lospost/paper?tema=invalid');
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

  describe('Navigation', () => {
    it('should redirect back to lospost on hard navigate to download-page', () => {
      cy.visit('/lospost/last-ned');
      cy.url().should('not.include', '/last-ned');
    });

    it('should navigate back from download-page and keep input data', () => {
      cy.visit('/lospost/paper?tema=BIL');
      cy.wait('@getArchiveSubjects');

      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .type('Lisenskostnader');

      cy.findByRole('group', { name: 'Hvem gjelder innsendingen for?' })
        .should('exist')
        .within(() => {
          cy.findByRole('radio', { name: 'Jeg har fødselsnummer eller d-nummer' }).should('exist').click();
        });

      cy.findByRole('textbox', { name: 'Fødselsnummer / d-nummer' }).should('exist').type('28880948417');

      // Click next to open page for cover sheet download
      cy.get('button').contains(TestButtonText.next).click();
      cy.findByRole('heading', { name: 'Send inn dokumentasjon' }).should('exist');
      cy.findByRole('button', { name: 'Last ned førsteside' }).should('exist');

      // Navigate to previous page
      cy.findByRole('button', { name: 'Gå tilbake' }).should('exist').click();
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .should('contain.value', 'Lisenskostnader');
      cy.findByRole('button', { name: 'Last ned førsteside' }).should('not.exist');
    });
  });
});
