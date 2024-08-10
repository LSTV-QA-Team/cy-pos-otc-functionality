let assertionResults = [];
let failureMessages = [];

describe("Transaction 3", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];


    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with 20% discount and Service Charge", () => {
    cy.wait(2000);

    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-In").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Breakfast").click().wait(1000);
    cy.contains("BF Hotdog").click().wait(1000);
    cy.contains("BF Breakfast Steak").click().wait(1000);
    cy.contains("BF Beef Tapa").click().wait(1000);

    cy.get(":nth-child(5) > .bg-green-100").click();
    cy.get(".px-8").should("have.text", "Add discount");
    cy.get("#discde").select("20%");
    cy.get("#orderitmid").click();
    cy.get(".border-green-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : 20%"
    );
    cy.get(":nth-child(4) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : 20%"
    );
    cy.get(":nth-child(6) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : 20%"
    );

    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[2].subtotal;
      const T3_SCharge = data[2].serviceCharge
      const ServiceCharge1 = T3_SCharge.toFixed(2)
      const Discount = data[2].discount
      const Discount1 = Discount.toFixed(2)
      const GT = data[2].total
      const total1 = GT.toFixed(2)

      cy.get('.bg-black > :nth-child(1) > :nth-child(2)').should("have.text", ST + ".00");
      cy.get(":nth-child(4) > :nth-child(2)").should("have.text", ServiceCharge1);
      cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
        "have.text",
        Discount1
      );
      cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

})

    cy.contains("Payment").click();
    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Edith ulit");
    cy.get(".border-green-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.wait(5000)
  });



})