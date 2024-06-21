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
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("DINE IN").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();
    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000);

    cy.contains("FOOD").click();
    cy.contains("Sides").click();
    cy.contains("Buttered Corn").click();

    cy.contains("Payment").click().wait(2000);
    cy.get('.group.text-green-700').click()

    cy.get('#freeitem > .flex > .me-1').click()
    cy.get('#textreason').click().type("Birthdayyyy")
    cy.get('.border-blue-500').click()
    cy.get('.border-blue-500').click()
})

})