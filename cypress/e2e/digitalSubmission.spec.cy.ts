import FORM2 from '../../mocks/data/fyllut/form2.json';
import { EttersendingRequestBody } from '../../src/data/domain';
import { uncapitalize } from '../../src/utils/stringUtil';
import { TestButtonText } from './testUtils';

beforeEach(() => {
  cy.mocksRestoreRouteVariants();
});
afterEach(() => {
  cy.mocksRestoreRouteVariants();
});

// InnsendingsId from the backend (ettersending.json)
const innsendingsId = 'bd86463d-ad04-43e8-a80a-9ecd22bae7c0';

const n6 = FORM2.attachments.find((a) => a.attachmentCode === 'N6');
const l9 = FORM2.attachments.find((a) => a.attachmentCode === 'L9');

describe('digital submission for form2', () => {
  beforeEach(() => {
    cy.intercept('POST', `${Cypress.config('baseUrl')}/api/ettersending`, (req) => {
      const body = req.body as EttersendingRequestBody;

      expect(body.tittel).to.equal(FORM2.title);
      expect(body.skjemanr).to.equal(FORM2.properties.skjemanummer);
      expect(body.tema).to.equal(FORM2.properties.tema);
      expect(body.sprak).to.equal('nb');
      expect(body.vedleggsListe.length).to.equal(2);

      const l9Body = body.vedleggsListe.find((v) => v.vedleggsnr === 'L9');
      expect(l9Body?.tittel).to.equal(l9?.label);

      const n6Body = body.vedleggsListe.find((v) => v.vedleggsnr === 'N6');
      expect(n6Body?.tittel).to.equal(n6?.label);
    }).as('postEttersending');
  });

  it('should create ettersending with expected data and redirect to sendinn', () => {
    cy.mocksUseRouteVariant('post-ettersending:success');
    cy.visit('/form2?sub=digital');

    cy.findByRole('heading', { level: 1, name: `Ettersend dokumentasjon til ${uncapitalize(FORM2.title)}` });
    // Choose attachments
    cy.findByRole('checkbox', { name: n6?.label }).check();
    cy.findByRole('checkbox', { name: l9?.label }).check();

    // Click next
    cy.get('button').contains(TestButtonText.next).click();

    cy.wait('@postEttersending');

    cy.url().should('include', `/send-inn-frontend/${innsendingsId}`);
  });

  it('should show error message when request fails', () => {
    cy.mocksUseRouteVariant('post-ettersending:failure');

    cy.visit('/form2?sub=digital');

    // Choose attachments
    cy.findByRole('checkbox', { name: n6?.label }).check();
    cy.findByRole('checkbox', { name: l9?.label }).check();

    // Click next
    cy.get('button').contains(TestButtonText.next).click();

    cy.wait('@postEttersending');

    cy.url().should('not.include', `/send-inn-frontend/${innsendingsId}`);
    cy.findByText('Det oppstod en feil ved ettersending av dokumentasjon').should('be.visible');
  });
});
