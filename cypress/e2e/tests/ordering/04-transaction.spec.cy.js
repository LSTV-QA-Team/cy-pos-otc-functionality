let assertionResults = [];
let failureMessages = [];

describe("Transaction 2", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];


    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with 10% discount and Service Charge", () => {
    cy.wait(2000);
    // cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-In").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000);
    cy.contains("Food").click().wait(2000);
    cy.contains("Chicken").click().wait(2000);
    cy.contains("1-pc Chickenjoy w/ Fries Meal").click().wait(2000);
    cy.contains("Chicken Joy Perfect Pairs").click().wait(2000);
    cy.contains("1-pc Chickenjoy w/ Jolly Spaghetti").click().wait(2000);

    cy.contains("Add Discount").click();
    cy.get(".px-8").should("have.text", "Add discount");
    cy.get("#discde").select("10%");
    cy.get("#orderitmid").click();
    cy.get(".border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex").should(
      "have.text",
      "Discount : 10%"
    );
    cy.get(":nth-child(4) > .MuiTableCell-root > .flex").should(
      "have.text",
      "Discount : 10%"
    );

    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[1].subtotal;
      const T2_SCharge = data[1].serviceCharge
      const ServiceCharge1 = T2_SCharge.toFixed(2)
      const Discount = data[1].discount
      const Discount1 = Discount.toFixed(2)
      const GT = data[1].total
      const total1 = GT.toFixed(2)

      cy.get('.bg-black > :nth-child(1) > :nth-child(2)').should("have.text", ST + ".00");
      cy.get(":nth-child(4) > :nth-child(2)").should("have.text", ServiceCharge1);
      cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
        "have.text",
        Discount1
      );
      cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

})


    cy.get(":nth-child(13) > .bg-green-100").click();
    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Debong");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );

    cy.wait(5000)
  });


})