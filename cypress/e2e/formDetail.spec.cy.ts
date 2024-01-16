beforeEach(() => {
  cy.mocksRestoreRouteVariants();
});
afterEach(() => {
  cy.mocksRestoreRouteVariants();
});

describe('redirects correctly based on existing ettersendelse applications', () => {
  it('should not redirect with 0 applications', () => {
    cy.mocksUseRouteVariant('get-ettersendingssoknader:none');
    cy.visit('/form2?sub=digital');
    cy.url().should('include', '/form2?sub=digital');
  });

  it('should redirect to send-inn with 1 application', () => {
    cy.mocksUseRouteVariant('get-ettersendingssoknader:one');
    cy.visit('/form2?sub=digital');
    cy.url().should(
      'equal',
      `${Cypress.env('NEXT_PUBLIC_SEND_INN_FRONTEND_URL')}/bd86463d-ad04-43e8-a80a-9ecd22bae7c0/`,
    );
  });

  it('should redirect to min-side varsler with 2 or more applications', () => {
    cy.mocksUseRouteVariant('get-ettersendingssoknader:two');
    cy.visit('/form2?sub=digital');
    cy.url().should('equal', `${Cypress.env('MIN_SIDE_FRONTEND_URL')}/varsler/`);
  });
});
