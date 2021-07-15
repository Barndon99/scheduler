describe("Navigation", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
  
    cy.visit("/");
  
    cy.contains("Monday");
   });
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
  
  it("should book an interview", () => {
    cy.get("[alt=Add]")
     .first()
     .click();
  
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get('[alt="Sylvia Palmer"]').click();
  
    cy.contains("Save").click();
  
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
   });

   it("should Edit an interview", () => {
    cy.get("[alt=Edit]")
     .first()
     .trigger('click', {force: true});
  
    cy.get("[data-testid=student-name-input]").clear().type("Richard");
    cy.get('[alt="Tori Malcolm"]').click();
    cy.contains("Save").click();

   cy.contains(".appointment__card--show", "Richard");
   cy.contains(".appointment__card--show", "Tori Malcolm");
   });

   it("should Cancel an interview", () => {
    cy.get("[alt=Delete]")
     .first()
     .trigger('click', {force: true});
  
    cy.contains("Confirm").click();

    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen")
    .should("not.exist");
   });
});