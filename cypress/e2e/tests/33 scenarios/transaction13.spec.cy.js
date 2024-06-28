let assertionResults = [];
let failureMessages = [];

describe("Transaction 13", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Regular Transaction", () => {
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("DINE IN").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();
    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000);
    cy.contains("FOOD").click();
    cy.contains("Chicken").click();
    cy.contains("1pc Chickenjoy w Palabok Meal").click();
    cy.contains("1pc Chickenjoy w Burger Steak").click();

    cy.contains("Payment").click().wait(2000);
    cy.contains("CASH").click().wait(2000);
    cy.get("#customerName").click().type("Ariana G");
    cy.get(".border-blue-500").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700")
      .click()
      .wait(2000);
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );

    cy.wait(2000);
    cy.get(".px-8").should("have.text", "Select Pricelist");
    cy.get("#postypcde").select("DINE IN");
    cy.get("#warcde").select("Jollibee 1");
    cy.contains("Proceed").click();

    cy.contains("Void Transaction").click().wait(1500);
    cy.get(".px-8").should("have.text", "Void Transaction").wait(1500);
    cy.contains("INV-0000000000000013").click().wait(1500);

    cy.get("#voidreason").select("Employee Mistake");
    cy.get(".border-blue-500").click().wait(2000);
    // cy.get(".Toastify__toast-body > :nth-child(2)").should(
    //   "have.text",
    //   "Transaction Void Successfull"
    // );
    cy.wait(5000)
  });

})