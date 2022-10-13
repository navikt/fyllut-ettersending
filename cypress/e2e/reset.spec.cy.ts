describe("velgskjema.tsx", () => {
  before(() => {
    cy.visit("/velg-skjema");
  });

  it("resets formData when a different form is selected than the one previously selected",
    {
      defaultCommandTimeout: 10000,
    },
    () => {
      cy.findAllByRole("textbox").focus().type("test");
      cy.findAllByRole("link").eq(1).click();
      cy.url().should("include", "/detaljer");
      cy.findAllByRole("checkbox").first().check();
      cy.findByRole("link").click();
      cy.url().should("include", "/velg-skjema");
      cy.findAllByRole("textbox").click().type("form2");
      cy.findAllByRole("link").eq(1).click();
      cy.url().should("include", "/detaljer");
      cy.findAllByRole("checkbox").should("not.be.checked");
      cy.findAllByRole("checkbox").each(($el) => {
        cy.wrap($el).should("have.not.attr", "checked");
      });
    }
  );
});
