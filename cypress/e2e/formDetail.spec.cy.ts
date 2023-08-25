beforeEach(() => {
  cy.mocksRestoreRouteVariants();
});
afterEach(() => {
  cy.mocksRestoreRouteVariants();
});

describe("shows submission type correctly", () => {
  it("should show submission type without sub query param", () => {
    cy.visit("/detaljer/form2");
    cy.get('[type="radio"]').should("exist");
  });

  it("should show submission type with sub query param other than digital/paper", () => {
    cy.visit("/detaljer/form2?sub=other");
    cy.get('[type="radio"]').should("exist");
  });

  it("should not show submission type with sub query param equal to paper", () => {
    cy.visit("/detaljer/form2?sub=paper");
    cy.get('[type="radio"]').should("not.exist");
  });

  it("should not show submission type with sub query param equal to digital", () => {
    cy.visit("/detaljer/form2?sub=digital");
    cy.get('[type="radio"]').should("not.exist");
  });
});

describe("redirects correctly based on existing ettersendelse applications", () => {
  it("should not redirect with 0 applications", () => {
    cy.mocksSetCollection("base");
    cy.mocksUseRouteVariant("get-ettersendingssoknader:none");
    cy.visit("/detaljer/form2?sub=digital");
    cy.url().should("include", "/detaljer/form2?sub=digital");
  });

  it("should redirect to send-inn with 1 application", () => {
    cy.mocksSetCollection("base");
    cy.mocksUseRouteVariant("get-ettersendingssoknader:one");
    cy.visit("/detaljer/form2?sub=digital");
    cy.url().should("include", "/bd86463d-ad04-43e8-a80a-9ecd22bae7c0");
  });

  it("should redirect to min-side varsler with 2 or more applications", () => {
    cy.mocksSetCollection("base");
    cy.mocksUseRouteVariant("get-ettersendingssoknader:two");
    cy.visit("/detaljer/form2?sub=digital");
    cy.url().should("include", "/varsler");
  });
});
