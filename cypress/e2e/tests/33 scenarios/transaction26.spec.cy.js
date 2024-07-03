let assertionResults = [];
let failureMessages = [];

describe("Transaction 26", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Senior Discount", () => {
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.contains("Food").click();
    cy.contains("Chicken").click();
    cy.contains("1pc Chickenjoy w Burger Steak").click();

    cy.contains("Add Discount").click().wait(2000);

    cy.get("#discde").select("Senior Citizen").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get(".border-blue-500").click().wait(2000);

    cy.get("#cardholder").click().type("Winter").wait(2000);
    cy.get("#cardno").click().type("4569084").wait(2000);
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10")
      .should("have.text", "Discount : Senior")
      .wait(2000);

    cy.contains("Payment").click();
    cy.contains("CASH").click().wait(2000);
    cy.get("#customerName").click().type("Ningning").wait(2000);
    cy.get(".border-blue-500").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700")
      .click()
      .wait(2000);
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );

    cy.wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Refund Transaction").click().wait(2000);
    cy.get('#usrcde').click().type("lstv")
    cy.get('#usrpwd').click().type("lstventures")
    cy.get('.sc-guDLey').click()

    cy.get(".px-8").should("have.text", "Refund Transaction").wait(1500);
    cy.get("#refundreason").select("Food Quality Issue").wait(2000);
    cy.get(".border-blue-500").click().wait(2000);

    cy.get(".me-2").should("have.text", "REF-0000000000000004");
    cy.get(".justify-between > .group").click().wait(1500);
    cy.contains("INV-0000000000000026").click().wait(1500);

    cy.get(".css-1ex1afd-MuiTableCell-root")
      .should("have.text", "1pc Chickenjoy w Burger Steak")
      .wait(2000);
    cy.get("#refundqty").clear().type("1").wait(2000);
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(4)")
      .should("have.text", "89.29")
      .wait(2000);
    cy.contains("Next").click();

    cy.get(".h-full > .justify-between > .font-bold").should(
      "have.text",
      "TOTAL : 89.29"
    );
    cy.get(":nth-child(3) > .group").click();
    cy.contains("Proceed").click();
    cy.contains("Transaction Refunded.").should(
      "have.text",
      "Transaction Refunded."
    );
    cy.wait(5000)
  });

})