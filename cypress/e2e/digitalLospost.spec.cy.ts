describe('Digital løspost', () => {
  const URL_FYLLUT_ETTERSENDING = Cypress.config().baseUrl;
  const URL_SEND_INN_FRONTEND = 'http://127.0.0.1:3200/send-inn-frontend';

  beforeEach(() => {
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/archive-subjects`).as('getArchiveSubjects');
  });

  describe('Creation of søknad succeeds', () => {
    beforeEach(() => {
      cy.mocksUseRouteVariant('post-lospost:success');
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/lospost`).as('opprettLospost');
    });

    it('requires both title and subject to proceed', () => {
      cy.visit('/digital-lospost');
      cy.wait('@getArchiveSubjects');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .type('Førerkort');
      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).type('Bi{downArrow}{downArrow}{enter}');
      cy.findByRole('button', { name: 'Gå videre' }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });

    it('renders validation error when subject is missing', () => {
      cy.visit('/digital-lospost');
      cy.wait('@getArchiveSubjects');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .type('Førerkort');
      cy.findByRole('button', { name: 'Gå videre' }).click();
      cy.findByRole('region', { name: 'For å gå videre må du rette opp følgende:' })
        .should('exist')
        .within(() => {
          cy.findByRole('link', { name: 'Du må velge tema for innsendingen' }).should('exist').click();
        });

      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' })
        .should('have.focus')
        .type('Bi{downArrow}{downArrow}{enter}');
      cy.findByRole('button', { name: 'Gå videre' }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });

    it('tema is prefilled from query param', () => {
      cy.visit('/digital-lospost?tema=BIL');
      cy.wait('@getArchiveSubjects');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .type('Førerkort');
      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('not.exist');
      cy.findByRole('button', { name: 'Gå videre' }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });

    it('illegal tema in query param is ignored', () => {
      cy.visit('/digital-lospost?tema=INVALID');
      cy.wait('@getArchiveSubjects');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' }).should('exist');
      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('exist');
    });
  });

  describe('Creation of søknad fails', () => {
    beforeEach(() => {
      cy.mocksUseRouteVariant('post-lospost:failure');
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/lospost`).as('opprettLospost');
    });

    it('renders error message', () => {
      cy.visit('/digital-lospost?tema=PEN');
      cy.wait('@getArchiveSubjects');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .type('Pensjonsbevis');
      cy.findByRole('button', { name: 'Gå videre' }).click();
      cy.wait('@opprettLospost');
      cy.findByText('Det oppstod en feil ved innsending av dokumentasjon').should('exist');
      cy.url().should('contain', URL_FYLLUT_ETTERSENDING);
      cy.url().should('not.contain', URL_SEND_INN_FRONTEND);
    });
  });
});
