describe("Navigation", () => {
  //Stylistic difference in tests due to Cypress lacking the "test" key word
  it("should visit root", () => {
    cy.visit("/");
  });

  it("should navigate to Tuesday", () => {
    cy.visit("/");
    
    cy.contains("[data-testid=day]", "Tuesday")
    .click()
    .should("have.class", "day-list__item--selected");
  });
  
});