describe('Internationalization', () => {
  it('renders page in bokmål', () => {
    cy.visit('/lospost/paper');
    cy.findByRole('button', { name: 'Gå videre' }).should('exist');
  });
  it('renders page in english', () => {
    cy.visit('/en/lospost/paper');
    cy.findByRole('button', { name: 'Next' }).should('exist');
  });
  it('renders page in nynorsk', () => {
    cy.visit('/nn/lospost/paper');
    cy.findByRole('button', { name: 'Gå vidare' }).should('exist');
  });
  it("renders page in bokmål when language is 'no'", () => {
    cy.visit('/no/lospost/paper');
    cy.findByRole('button', { name: 'Gå videre' }).should('exist');
  });
});

describe('Language select', () => {
  it('is initialized with current language', () => {
    cy.visit('/en/lospost/paper');
    cy.findByRole('combobox', { name: 'Choose language' }).find('option:selected').should('have.text', 'English');
  });

  it('renders page in the selected language', () => {
    cy.visit('/en/lospost/paper');
    cy.findByRole('combobox', { name: 'Choose language' }).select('Norsk nynorsk');
    cy.findByRole('button', { name: 'Gå vidare' }).should('exist');
  });

  it('displays attachments in selected language', () => {
    cy.visit('/form2?sub=paper');
    cy.findByRole('combobox', { name: 'Velg språk' }).select('English');
    cy.findByRole('combobox', { name: 'Velg språk' }).find('option').should('have.length', 2);
    cy.findByRole('checkbox', { name: 'Statement from an ophthalmologist' }).should('exist');
  });

  it('has default language when publishedLanguages is not set in form', () => {
    cy.visit('/form1?sub=paper');
    cy.findByRole('combobox', { name: 'Velg språk' }).should('not.exist');
  });
});
