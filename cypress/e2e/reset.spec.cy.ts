describe("velgskjema.tsx", () => {
  before(() => {
    cy.visit("/velg-skjema");
  });

  it("resets formData when a different form is selected than the one previously selected",
    {
      defaultCommandTimeout: 10000,
    },
    () => {
      cy.get('[name="search"]').click().type("nav150002");
      cy.get(".clickable").parent().click();
      cy.url().should("include", "/detaljer");
      cy.get('[type="checkbox"]').first().check();
      cy.get('[type="checkbox"]').check("Avtale om delt bosted");
      cy.get("a").click();
      cy.url().should("include", "/velg-skjema");
      cy.get('[name="search"]').click().type("nav100750");
      cy.get(".clickable").parent().click();
      cy.url().should("include", "/detaljer");
      cy.get('[type="checkbox"]').should("not.be.checked");
      cy.get('[type="checkbox"]').each(($el) => {
        cy.wrap($el).should("have.not.attr", "checked");
      });
    }
  );
});
