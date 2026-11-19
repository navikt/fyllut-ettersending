/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('closeConsentBanner', () => {
  const bannerName =
    /^(Får vi samle informasjon om hvordan nav\.no brukes\?|Can we collect information about how nav\.no is used\?)$/;

  cy.findByRole('region', { name: bannerName }).within(() => {
    cy.findByRole('button', { name: /^(Ja|Yes)$/ }).click();
  });

  return cy.findByRole('region', { name: bannerName }).should('not.exist');
});

// Mocks Server admin API (default port 3110), used to switch route variants per test.
const mocksCustomRouteVariantsUrl = 'http://127.0.0.1:3110/api/mock/custom-route-variants';

Cypress.Commands.add('mocksUseRouteVariant', (routeVariantId: string) => {
  cy.request({ method: 'POST', url: mocksCustomRouteVariantsUrl, body: { id: routeVariantId }, log: false });
  cy.log(`[Mocks Server] Using route variant '${routeVariantId}'`);
});

Cypress.Commands.add('mocksRestoreRouteVariants', () => {
  cy.request({ method: 'DELETE', url: mocksCustomRouteVariantsUrl, log: false });
  cy.log('[Mocks Server] Restored route variants');
});

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
