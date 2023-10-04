describe('Internationalization', () => {
  it('renders page in bokmål', () => {
    cy.visit('/lospost');
    cy.findByRole('button', { name: 'Gå videre' }).should('exist');
  });
  it('renders page in english', () => {
    cy.visit('/en/lospost');
    cy.findByRole('button', { name: 'Next' }).should('exist');
  });
  it('renders page in nynorsk', () => {
    cy.visit('/nn/lospost');
    cy.findByRole('button', { name: 'Gå vidare' }).should('exist');
  });
  it("renders page in bokmål when language is 'no'", () => {
    cy.visit('/no/lospost');
    cy.findByRole('button', { name: 'Gå videre' }).should('exist');
  });
});
