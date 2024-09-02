import { TestButtonText } from './testUtils';

describe('Løspost - Paper submission', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.config('baseUrl')}/api/archive-subjects`).as('getArchiveSubjects');
  });

  it('Supports basic input and navigation', () => {
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
