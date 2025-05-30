import { TestButtonText, TestButtonTextEn, TestButtonTextNn } from './testUtils';

describe('Løspost - Digital submission', () => {
  const URL_FYLLUT_ETTERSENDING = Cypress.config().baseUrl;
  const URL_SEND_INN_FRONTEND = 'http://127.0.0.1:3200/send-inn-frontend';

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
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
        .should('exist')
        .type('Førerkort');
      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).type('Bi{downArrow}{downArrow}{enter}');
      cy.findByRole('button', { name: TestButtonText.next }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });

    it('does not allow title of length more than 150 characters', () => {
      cy.visit('/lospost/digital');
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

    it('renders validation error when subject is missing', () => {
      cy.visit('/lospost/digital');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
        .should('exist')
        .type('Førerkort');
      cy.findByRole('button', { name: TestButtonText.next }).click();
      cy.get('[data-cy=ValidationSummary]').should('exist');
      cy.get('[data-cy=ValidationSummary]').within(() => {
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
        cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
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
        cy.findByRole('heading', { level: 1, name: 'Send dokumenter til Nav om pensjon' }).should('be.visible');
      });

      it('unknown tema in query param is ignored and removed from url', () => {
        cy.visit('/lospost/digital?tema=ABC');
        cy.findByRole('heading', { level: 1, name: 'Send dokumenter til Nav' }).should('be.visible');
        cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' }).should('exist');
        cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('exist');
        cy.url().should('not.contain', 'tema=ABC');
      });

      it('illegal tema PER in query param is ignored and removed from url', () => {
        cy.visit('/lospost/digital?tema=PER');
        cy.findByRole('heading', { level: 1, name: 'Send dokumenter til Nav' }).should('be.visible');
        cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' }).should('exist');
        cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('exist');
        cy.url().should('not.contain', 'tema=PER');
      });

      it('illegal tema TIL in query param is ignored and removed from url', () => {
        cy.visit('/lospost/digital?tema=TIL');
        cy.findByRole('heading', { level: 1, name: 'Send dokumenter til Nav' }).should('be.visible');
        cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' }).should('exist');
        cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('exist');
        cy.url().should('not.contain', 'tema=TIL');
      });
    });
  });

  describe('Tema description when different locale', () => {
    beforeEach(() => {
      cy.mocksUseRouteVariant('post-lospost:success');
    });

    it('should use bokmål tema description', () => {
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/lospost`, (req) => {
        expect(req.body.soknadTittel).to.equal('Sykepenger - Mitt førerkort');
        expect(req.body.tema).to.equal('SYK');
      }).as('opprettLospost');

      cy.visit('/lospost/digital?tema=SYK');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
        .should('exist')
        .type('Mitt førerkort');
      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('not.exist');
      cy.url().should('contain', '?tema=SYK');
      cy.findByRole('button', { name: TestButtonText.next }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });

    it('should use nynorsk tema description', () => {
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/lospost`, (req) => {
        expect(req.body.soknadTittel).to.equal('Sjukepengar - Mitt førarkort');
        expect(req.body.tema).to.equal('SYK');
      }).as('opprettLospost');

      cy.visit('/nn/lospost/digital?tema=SYK');
      cy.findByRole('textbox', { name: 'Kva dokumentasjon vil du senda til Nav?' })
        .should('exist')
        .type('Mitt førarkort');
      cy.findByRole('combobox', { name: 'Kva gjeld innsendinga?' }).should('not.exist');
      cy.url().should('contain', '?tema=SYK');
      cy.findByRole('button', { name: TestButtonTextNn.next }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });

    it('should use english tema description', () => {
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/lospost`, (req) => {
        expect(req.body.soknadTittel).to.equal('Sickness Benefits - My driving licence');
        expect(req.body.tema).to.equal('SYK');
      }).as('opprettLospost');

      cy.visit('/en/lospost/digital?tema=SYK');
      cy.findByRole('textbox', { name: 'What documentation do you want to send to Nav?' })
        .should('exist')
        .type('My driving licence');
      cy.findByRole('combobox', { name: 'What is the submission about?' }).should('not.exist');
      cy.url().should('contain', '?tema=SYK');
      cy.findByRole('button', { name: TestButtonTextEn.next }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });

    it('should support changing language after tema is chosen, and use tema description with correct language', () => {
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/lospost`, (req) => {
        expect(req.body.soknadTittel).to.equal('Sykepenger - Mitt førerkort');
        expect(req.body.tema).to.equal('SYK');
      }).as('opprettLospost');

      cy.visit('/nn/lospost/digital?tema=SYK');
      cy.findByRole('textbox', { name: 'Kva dokumentasjon vil du senda til Nav?' }).should('exist');

      cy.findByRole('combobox', { name: 'Velg språk' }).find('option:selected').should('have.text', 'Norsk nynorsk');
      cy.findByRole('combobox', { name: 'Velg språk' }).select('Norsk bokmål');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
        .should('exist')
        .type('Mitt førerkort');

      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('not.exist');
      cy.url().should('contain', '?tema=SYK');
      cy.findByRole('button', { name: TestButtonText.next }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });
  });

  describe('Gjelder query parameter', () => {
    beforeEach(() => {
      cy.mocksUseRouteVariant('post-lospost:success');
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/lospost`, (req) => {
        expect(req.body.soknadTittel).to.equal('Sykepenger - Sykmelding del D - Legedokument');
        expect(req.body.tema).to.equal('SYK');
      }).as('opprettLospost');
    });

    it('title is prefixed with value from query param', () => {
      cy.visit('/lospost/digital?tema=SYK&gjelder=Sykmelding%20del%20D');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
        .should('exist')
        .type('Legedokument');
      cy.findByRole('combobox', { name: 'Hva gjelder innsendingen?' }).should('not.exist');
      cy.url().should('contain', '?tema=SYK&gjelder=Sykmelding%20del%20D');
      cy.findByRole('button', { name: TestButtonText.next }).click();
      cy.wait('@opprettLospost');
      cy.url().should('contain', URL_SEND_INN_FRONTEND);
    });

    it('rejects invalid value for param "gjelder"', () => {
      cy.request({ url: '/lospost/digital?tema=SYK&gjelder=(Select * from users)', failOnStatusCode: false })
        .its('status')
        .should('equal', 400);
    });

    it('rejects invalid value for param "tema"', () => {
      cy.request({ url: '/lospost/digital?tema=GRRR&gjelder=Økologi', failOnStatusCode: false })
        .its('status')
        .should('equal', 400);
    });
  });

  describe('Creation of søknad fails', () => {
    beforeEach(() => {
      cy.mocksUseRouteVariant('post-lospost:failure');
      cy.intercept('POST', `${Cypress.config('baseUrl')}/api/lospost`).as('opprettLospost');
    });

    it('renders error message', () => {
      cy.visit('/lospost/digital?tema=PEN');
      cy.findByRole('textbox', { name: 'Hvilken dokumentasjon vil du sende til Nav?' })
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
