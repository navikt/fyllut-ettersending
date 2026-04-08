describe('Upgrade smoke checks', () => {
  it('renders the home page', () => {
    cy.visit('/');
    cy.closeConsentBanner();
    cy.findByRole('heading', { name: 'Send inn dokumentasjon' }).should('exist');
  });

  it('renders english lospost page', () => {
    cy.visit('/en/lospost/paper');
    cy.findByRole('button', { name: 'Next' }).should('exist');
  });

  it('reports readiness endpoint as healthy', () => {
    cy.request('/api/internal/isready').its('status').should('eq', 200);
  });
});
