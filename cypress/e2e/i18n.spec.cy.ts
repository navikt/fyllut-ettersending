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

describe('Language select', () => {
  it('is initialized with current language', () => {
    cy.visit('/en/lospost');
    cy.findByRole('combobox', { name: 'Choose language' }).find('option:selected').should('have.text', 'English');
  });

  it('renders page in the selected language', () => {
    cy.visit('/en/lospost');
    cy.findByRole('combobox', { name: 'Choose language' }).select('Norsk nynorsk');
    cy.findByRole('button', { name: 'Gå vidare' }).should('exist');
  });
});
