import { mount } from 'cypress/react';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;

      closeConsentBanner(): Chainable<JQuery>;

      mocksUseRouteVariant(routeVariantId: string): Chainable<void>;

      mocksRestoreRouteVariants(): Chainable<void>;
    }
  }
}
