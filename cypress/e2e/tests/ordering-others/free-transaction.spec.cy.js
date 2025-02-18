let assertionResults = [];
let failureMessages = [];

describe ("Free Transaction" , () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });


it("1 Pax with Regular Transaction" , () => {

   cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.contains("Food").click();
    cy.contains("Sides").click();
    cy.contains("Buttered Corn").click();

    cy.contains("Payment").click().wait(2000);
    cy.get('.group.text-green-700').click()

    cy.get('#freeitem > .flex > .me-1').click()
    cy.get('#textreason').click().type("Birthdayyyy")
    cy.get('.border-green-500').click()
    cy.get('.border-green-500').click()
})

})