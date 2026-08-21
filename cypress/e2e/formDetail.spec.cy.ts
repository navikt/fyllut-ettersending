import FORM2 from '../../mocks/mocks/data/fyllut/form2.json';

describe('formDetail', () => {
  beforeEach(() => {
    cy.mocksRestoreRouteVariants();
  });
  afterEach(() => {
    cy.mocksRestoreRouteVariants();
  });

  describe('invalid form path', () => {
    it('should reject invalid form path containing dashes', () => {
      cy.visit('/invalid-form-path?sub=digital', { failOnStatusCode: false });
      cy.findByRole('heading', { name: 'Beklager, vi fant ikke siden' }).should('exist');
    });
    it('should reject invalid form path containing filename', () => {
      cy.visit('/index.php?sub=digital', { failOnStatusCode: false });
      cy.findByRole('heading', { name: 'Beklager, vi fant ikke siden' }).should('exist');
    });
    it('should reject invalid form path with sql injections', () => {
      cy.visit('/ext0%22XOR(if(now()=sysdate(),sleep(15),0))XOR%22Z?sub=digital', { failOnStatusCode: false });
      cy.findByRole('heading', { name: 'Beklager, vi fant ikke siden' }).should('exist');
    });
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

  describe('attachment filtering via ?filter=', () => {
    const x6 = FORM2.attachments.find((a) => a.attachmentCode === 'X6');
    const l9 = FORM2.attachments.find((a) => a.attachmentCode === 'L9');
    const n6 = FORM2.attachments.find((a) => a.attachmentCode === 'N6');

    it('shows all attachments when no filter is present', () => {
      cy.visit('/form2?sub=digital');
      cy.findByRole('checkbox', { name: x6?.label }).should('exist');
      cy.findByRole('checkbox', { name: l9?.label }).should('exist');
      cy.findByRole('checkbox', { name: n6?.label }).should('exist');
    });

    it('shows only the attachment matching a single filter code', () => {
      cy.visit('/form2?sub=digital&filter=N6');
      cy.findByRole('checkbox', { name: n6?.label }).should('exist');
      cy.findByRole('checkbox', { name: x6?.label }).should('not.exist');
      cy.findByRole('checkbox', { name: l9?.label }).should('not.exist');
    });

    it('shows all attachments matching a comma-separated list of filter codes', () => {
      cy.visit('/form2?sub=digital&filter=X6,N6');
      cy.findByRole('checkbox', { name: x6?.label }).should('exist');
      cy.findByRole('checkbox', { name: n6?.label }).should('exist');
      cy.findByRole('checkbox', { name: l9?.label }).should('not.exist');
    });

    it('shows no attachments when the filter has no matching codes', () => {
      cy.visit('/form2?sub=digital&filter=doesNotExist');
      cy.findByRole('checkbox', { name: x6?.label }).should('not.exist');
      cy.findByRole('checkbox', { name: l9?.label }).should('not.exist');
      cy.findByRole('checkbox', { name: n6?.label }).should('not.exist');
    });
  });
});
