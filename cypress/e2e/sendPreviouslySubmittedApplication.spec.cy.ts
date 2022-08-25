describe.only('sendPreviouslySubmittedApplication', () => {

  before(() => {
    cy.visit('http://localhost:3002/')
  });

  it('clicks "send i posten" button', () => {
    cy.get("button").eq(1).click();
    cy.url().should('include', '/velg-skjema', { timeout: 10000 })
    cy.get('[name="search"]').click().type("førerhund");
    cy.get('.clickable').parent().click()
    cy.url().should('include', '/detaljer', { timeout: 10000 })
    cy.get('[type="checkbox"]').first().check() 
    cy.get('[type="radio"]').check("has-social-number")
    cy.get('[name="socialNo"]').click().type("28119135003");
    cy.get("button").eq(0).click();
    cy.url().should('include', '/last-ned', { timeout: 10000 })
    //download pdf
    //cy.get("button").eq(0).click();
  })
})