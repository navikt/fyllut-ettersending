import { setConsentCookie, TestButtonText, TestButtonTextEn, TestButtonTextNn } from './testUtils';

describe('Løspost - Paper submission', () => {
  const SUBJECT_PER = {
    subject: 'PER',
    title: 'Permittering og masseoppsigelser',
  };

  const SUBJECT_TIL = {
    subject: 'TIL',
    title: 'Tiltak',
  };

  const SUBJECT_SYK = {
    subject: 'SYK',
    title: 'Sykepenger',
    title_nn: 'Sjukepengar',
    title_en: 'Sickness Benefits',
  };

  const NAV_UNIT = {
    name: 'Dagpenger - Grensearbeider inn',
    number: '4465',
  };

  beforeEach(() => {
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/nav-units`).as('getNavUnits');
    cy.mocksRestoreRouteVariants();
    setConsentCookie();
  });

  describe('form with tema=PER', () => {
    beforeEach(() => {
      cy.visit('/lospost/paper');
      cy.wait('@getNavUnits');
    });

    it('should be able to fill out the form and go to next page (noSocialNumber)', () => {
      // Sjekker validering først
      cy.get('[data-cy="ValidationSummary"]').should('not.exist');
      cy.get('button').contains(TestButtonText.next).click();
      cy.get('[data-cy=ValidationSummary]').within(() => {
        cy.findByRole('heading').should('have.focus');
        cy.get('li').should('have.length', 3);
      });

      //Populate velg skjema page
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');

      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_PER.subject}{downArrow}{enter}`);

      // "Hvem gjelder innsendingen for?"
      cy.findAllByRole('radio').check('noSocialNumber');

      cy.get('button').contains(TestButtonText.next).should('be.visible').click();
      cy.get('[data-cy=ValidationSummary]').within(() => {
        cy.findByRole('heading').should('have.focus');
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

      // "Har du vært i kontakt med Nav før?"
      cy.findAllByRole('radio').check('true');
      cy.get('[name="contactInformationNavUnit"]').click();
      cy.get('[name="contactInformationNavUnit"]').type(`${NAV_UNIT.name}{downArrow}{enter}`);

      cy.get('[data-cy="ValidationSummary"]').should('not.exist');

      cy.get('button').contains(TestButtonText.next).click();

      cy.url().should('include', '/last-ned');
    });

    it('should be able to fill out the form and go to next page (other)', () => {
      //Populate velg skjema page
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');

      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_PER.subject}{downArrow}{enter}`);

      // "Hvem gjelder innsendingen for?"
      cy.findAllByRole('radio').check('other');

      // "Velg hvilken Nav-enhet som skal motta innsendingen"
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

    it('does not allow title of length more than 150 characters', () => {
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
        .should('exist')
        .type(
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis pa',
        );
      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).type('Bi{downArrow}{downArrow}{enter}');
      cy.findByRole('button', { name: TestButtonText.next }).click();
      cy.get('[data-cy=ValidationSummary]').should('exist');
      cy.get('[data-cy=ValidationSummary]').within(() => {
        cy.findByRole('link', { name: 'Hvilken dokumentasjon vil du sende til Nav kan maksimalt ha 150 tegn' })
          .should('exist')
          .click();
      });
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
        .should('have.focus')
        .type('{backspace}');
      cy.findByLabelText('For å gå videre må du rette opp følgende:').should('not.exist');
    });
  });

  describe("query param 'tema=PER'", () => {
    beforeEach(() => {
      cy.visit(`/lospost/paper?tema=${SUBJECT_PER.subject}`);
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
      cy.findByRole('heading', { level: 1, name: 'Send dokumenter til Nav om permittering og masseoppsigelser' });
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
      // Hvilken dokumentasjon vil du sende til Nav?
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Tiltak for noe');

      // Hva gjelder innsendingen?
      cy.get('[name="subjectOfSubmission"]').should('not.exist');

      // Hvem gjelder innsendingen for?
      cy.get('[name="userType').should('not.exist');

      // "Velg hvilken Nav-enhet som skal motta innsendingen"
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
      // Hvilken dokumentasjon vil du sende til Nav?
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Tiltak for noe');

      // Hva gjelder innsendingen?
      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_TIL.title}{downArrow}{enter}`);

      // Hvem gjelder innsendingen for?
      cy.get('[name="userType').should('not.exist');

      // "Velg hvilken Nav-enhet som skal motta innsendingen"
      cy.get('[name="chooseUserNavUnit"]').click();
      cy.get('[name="chooseUserNavUnit"]').type(`${NAV_UNIT.name}{downArrow}{enter}`);

      cy.get('button').contains(TestButtonText.next).click();

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
    });
  });

  describe.only("query param unknown 'tema'", () => {
    beforeEach(() => {
      cy.visit('/lospost/paper?tema=ABC');
      cy.wait('@getNavUnits');
      // Intercept: Download cover page pdf
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_PER.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_PER.title);
        req.reply('mock-pdf');
      }).as('downloadForsteside');
    });

    it('should show combobox for subject and be able to fill out and go to next page', () => {
      cy.findByRole('heading', { level: 1, name: 'Send dokumenter til Nav' });
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

  describe("query param 'gjelder'", () => {
    beforeEach(() => {
      cy.visit(`/lospost/paper?tema=${SUBJECT_SYK.subject}&gjelder=Bestridelse`);
      cy.wait('@getNavUnits');
      // Intercept: Download cover page pdf
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.title).to.equal('Innsendingen gjelder: Sykepenger - Bestridelse - Min dokumentasjon');
        req.reply('mock-pdf');
      }).as('downloadForsteside');
    });

    it('should include predefined text in title', () => {
      cy.findByRole('heading', { level: 1, name: `Send dokumenter til Nav om ${SUBJECT_SYK.title.toLowerCase()}` });

      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
        .should('exist')
        .type('Min dokumentasjon');

      cy.findAllByRole('radio').check('hasSocialNumber');
      cy.get('[name="socialSecurityNo"]').click();
      cy.get('[name="socialSecurityNo"]').type('16020256145');
      cy.get('button').contains(TestButtonText.next).click();

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
    });

    it('should keep predefined text in title when navigating back from download page', () => {
      cy.findByRole('heading', { level: 1, name: `Send dokumenter til Nav om ${SUBJECT_SYK.title.toLowerCase()}` });

      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
        .should('exist')
        .type('Min dokumentasjon');

      cy.findAllByRole('radio').check('hasSocialNumber');
      cy.get('[name="socialSecurityNo"]').click();
      cy.get('[name="socialSecurityNo"]').type('16020256145');
      cy.get('button').contains(TestButtonText.next).click();

      // Navigation
      cy.url().should('include', '/last-ned');
      cy.get('button').contains(TestButtonText.previous).click();
      cy.url().should('include', '/lospost/paper');
      cy.get('button').contains(TestButtonText.next).click();
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
    });
  });

  describe('Tema description when different locale', () => {
    it('should use bokmål tema description', () => {
      cy.visit('/lospost/paper');
      cy.wait('@getNavUnits');

      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_SYK.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_SYK.title);
        expect(req.body.title).to.equal(`Innsendingen gjelder: ${SUBJECT_SYK.title} - Et eller annet`);
        req.reply('mock-pdf');
      }).as('downloadForsteside');

      // Hvilken dokumentasjon vil du sende til Nav?
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Et eller annet');

      // Hva gjelder innsendingen?
      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_SYK.title}{downArrow}{enter}`);

      // Hvem gjelder innsendingen for?
      cy.findAllByRole('radio').check('hasSocialNumber');
      cy.get('[name="socialSecurityNo"]').click();
      cy.get('[name="socialSecurityNo"]').type('16020256145');
      cy.get('button').contains(TestButtonText.next).click();

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
    });

    it('should use nynorsk tema description', () => {
      cy.visit('/nn/lospost/paper');
      cy.wait('@getNavUnits');

      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_SYK.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_SYK.title_nn);
        expect(req.body.title).to.equal(`Innsendinga gjeld: ${SUBJECT_SYK.title_nn} - Skrive noko her`);
        req.reply('mock-pdf');
      }).as('downloadForsteside');

      // Hvilken dokumentasjon vil du sende til Nav?
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Skrive noko her');

      // Hva gjelder innsendingen?
      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_SYK.title_nn}{downArrow}{enter}`);

      // Hvem gjelder innsendingen for?
      cy.findAllByRole('radio').check('hasSocialNumber');
      cy.get('[name="socialSecurityNo"]').click();
      cy.get('[name="socialSecurityNo"]').type('16020256145');
      cy.get('button').contains(TestButtonTextNn.next).click();

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonTextNn.downloadCoverPage }).should('exist').click();
    });

    it('should use english tema description', () => {
      cy.visit('/en/lospost/paper');
      cy.wait('@getNavUnits');

      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_SYK.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_SYK.title_en);
        expect(req.body.title).to.equal(`Submission regarding: ${SUBJECT_SYK.title_en} - Something`);
        req.reply('mock-pdf');
      }).as('downloadForsteside');

      // Hvilken dokumentasjon vil du sende til Nav?
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Something');

      // Hva gjelder innsendingen?
      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_SYK.title_en}{downArrow}{enter}`);

      // Hvem gjelder innsendingen for?
      cy.findAllByRole('radio').check('hasSocialNumber');
      cy.get('[name="socialSecurityNo"]').click();
      cy.get('[name="socialSecurityNo"]').type('16020256145');
      cy.get('button').contains(TestButtonTextEn.next).click();

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonTextEn.downloadCoverPage }).should('exist').click();
    });

    it('should support switching language and use correct tema description', () => {
      cy.visit('/en/lospost/paper');
      cy.wait('@getNavUnits');

      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_SYK.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_SYK.title_nn);
        expect(req.body.title).to.equal(`Innsendinga gjeld: ${SUBJECT_SYK.title_nn} - Nynorsk tittel`);
        req.reply('mock-pdf');
      }).as('downloadForsteside');

      // Hvilken dokumentasjon vil du sende til Nav?
      cy.get('[name="otherDocumentationTitle"]').click();
      cy.get('[name="otherDocumentationTitle"]').type('Nynorsk tittel');

      // Hva gjelder innsendingen?
      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_SYK.title_en}{downArrow}{enter}`);

      cy.findByRole('combobox', { name: 'Choose language' }).find('option:selected').should('have.text', 'English');
      cy.findByRole('combobox', { name: 'Choose language' }).select('Norsk nynorsk');

      // Hvem gjelder innsendingen for?
      cy.findAllByRole('radio').check('hasSocialNumber');
      cy.get('[name="socialSecurityNo"]').click();
      cy.get('[name="socialSecurityNo"]').type('16020256145');
      cy.get('button').contains(TestButtonTextNn.next).click();

      //Download page
      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonTextNn.downloadCoverPage }).should('exist').click();
    });
  });

  describe('Download front page', () => {
    beforeEach(() => {
      cy.visit('/lospost/paper');
      cy.wait('@getNavUnits');
    });

    it('sends the required data for generating front page', () => {
      // Intercept: Check request body for downloading cover page
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/download`, (req) => {
        expect(req.body.formData.subjectOfSubmission).to.equal(SUBJECT_PER.subject);
        expect(req.body.formData.titleOfSubmission).to.equal(SUBJECT_PER.title);
        expect(req.body.title).to.equal(
          'Innsendingen gjelder: Permittering og masseoppsigelser - Application for parental leave',
        );
        expect(req.body.formData.userData.navUnit.name).to.equal(NAV_UNIT.name);
        expect(req.body.formData.userData.navUnit.number).to.equal(NAV_UNIT.number);
      }).as('downloadForsteside');

      cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');
      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_PER.subject}{downArrow}{enter}`);
      cy.findAllByRole('radio').check('noSocialNumber');
      cy.get('[name="firstName"]').type('Ola');
      cy.get('[name="lastName"]').type('Nordmann');
      cy.get('[name="streetName"]').type('Addresse 1');
      cy.get('[name="postalCode"]').type('0001');
      cy.get('[name="city"]').type('Oslo');
      cy.get('[name="country"]').type('Norway');
      cy.findAllByRole('radio').check('true');
      cy.get('[name="contactInformationNavUnit"]').type(`${NAV_UNIT.name}{downArrow}{enter}`);
      cy.get('button').contains(TestButtonText.next).click();

      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
      cy.wait('@downloadForsteside');
    });

    it('handles errors', () => {
      cy.mocksUseRouteVariant('download-frontpage:error');

      cy.get('[name="otherDocumentationTitle"]').type('Application for parental leave');
      cy.get('[name="subjectOfSubmission"]').type(`${SUBJECT_PER.subject}{downArrow}{enter}`);
      cy.findAllByRole('radio').check('hasSocialNumber');
      cy.get('[name="socialSecurityNo"]').type('16020256145');
      cy.get('button').contains(TestButtonText.next).click();

      cy.url().should('include', '/last-ned');
      cy.findByRole('button', { name: TestButtonText.downloadCoverPage }).should('exist').click();
      cy.get('[data-cy=DownloadError]').should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('should redirect back to lospost on hard navigate to download-page', () => {
      cy.visit('/lospost/last-ned');
      cy.url().should('not.include', '/last-ned');
    });

    it('should navigate back from download-page and keep input data', () => {
      cy.visit('/lospost/paper?tema=BIL');

      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
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
      cy.findByRole('button', { name: TestButtonText.previous }).should('exist').click();
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
        .should('exist')
        .should('contain.value', 'Lisenskostnader');
      cy.findByRole('button', { name: 'Last ned førsteside' }).should('not.exist');
    });
  });
});
