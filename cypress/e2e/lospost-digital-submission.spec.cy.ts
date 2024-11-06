import { TestButtonText } from './testUtils';

describe('Løspost - Digital submission', () => {
  const URL_FYLLUT_ETTERSENDING = Cypress.config().baseUrl;
  const URL_SEND_INN_FRONTEND = 'http://127.0.0.1:3200/send-inn-frontend';

  beforeEach(() => {
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/archive-subjects`).as('getArchiveSubjects');
  });

  describe('Creation of søknad succeeds', () => {
    beforeEach(() => {
      cy.mocksUseRouteVariant('post-lospost:success');
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/lospost`, (req) => {
        expect(req.body.soknadTittel).to.equal('Bil - Førerkort');
        expect(req.body.tema).to.equal('BIL');
      }).as('opprettLospost');
    });

    it('requires both title and subject to proceed', () => {
      cy.visit('/lospost/digital');
      cy.wait('@getArchiveSubjects');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .type('Førerkort');
      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).type('Bi{downArrow}{downArrow}{enter}');
      cy.findByRole('button', { name: TestButtonText.next }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });

    it('renders validation error when subject is missing', () => {
      cy.visit('/lospost/digital');
      cy.wait('@getArchiveSubjects');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .type('Førerkort');
      cy.findByRole('button', { name: TestButtonText.next }).click();
      cy.get('[data-cy=ValidationSummary]')
        .should('exist')
        .within(() => {
          cy.findByRole('link', { name: 'Du må velge tema for innsendingen' }).should('exist').click();
        });

      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' })
        .should('have.focus')
        .type('Bi{downArrow}{downArrow}{enter}');
      cy.findByRole('button', { name: TestButtonText.next }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });

    describe('Tema query parameter', () => {
      it('tema is prefilled from query param', () => {
        cy.visit('/lospost/digital?tema=BIL');
        cy.wait('@getArchiveSubjects');
        cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
          .should('exist')
          .type('Førerkort');
        cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('not.exist');
        cy.url().should('contain', '?tema=BIL');
        cy.findByRole('button', { name: TestButtonText.next }).click();
        cy.wait('@opprettLospost');
        cy.url().should('contain', URL_SEND_INN_FRONTEND);
      });

      it('tema is included in heading', () => {
        cy.visit('/lospost/digital?tema=PEN');
        cy.wait('@getArchiveSubjects');
        cy.findByRole('heading', { level: 1, name: 'Send dokumenter til NAV om pensjon' }).should('be.visible');
      });

      it('unknown tema in query param is ignored and removed from url', () => {
        cy.visit('/lospost/digital?tema=INVALID');
        cy.wait('@getArchiveSubjects');
        cy.findByRole('heading', { level: 1, name: 'Send dokumenter til NAV' }).should('be.visible');
        cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' }).should('exist');
        cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('exist');
        cy.url().should('not.contain', 'tema=INVALID');
      });

      it('illegal tema PER in query param is ignored and removed from url', () => {
        cy.visit('/lospost/digital?tema=PER');
        cy.wait('@getArchiveSubjects');
        cy.findByRole('heading', { level: 1, name: 'Send dokumenter til NAV' }).should('be.visible');
        cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' }).should('exist');
        cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('exist');
        cy.url().should('not.contain', 'tema=PER');
      });

      it('illegal tema TIL in query param is ignored and removed from url', () => {
        cy.visit('/lospost/digital?tema=TIL');
        cy.wait('@getArchiveSubjects');
        cy.findByRole('heading', { level: 1, name: 'Send dokumenter til NAV' }).should('be.visible');
        cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' }).should('exist');
        cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('exist');
        cy.url().should('not.contain', 'tema=TIL');
      });
    });
  });

  describe('Creation of søknad fails', () => {
    beforeEach(() => {
      cy.mocksUseRouteVariant('post-lospost:failure');
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/lospost`).as('opprettLospost');
    });

    it('renders error message', () => {
      cy.visit('/lospost/digital?tema=PEN');
      cy.wait('@getArchiveSubjects');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til NAV?' })
        .should('exist')
        .type('Pensjonsbevis');
      cy.findByRole('button', { name: TestButtonText.next }).click();
      cy.wait('@opprettLospost');
      cy.findByText('Det oppstod en feil ved innsending av dokumentasjon').should('exist');
      cy.url().should('contain', URL_FYLLUT_ETTERSENDING);
      cy.url().should('not.contain', URL_SEND_INN_FRONTEND);
    });
  });
});
