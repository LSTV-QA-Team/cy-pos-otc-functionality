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
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("DINE IN").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("FOOD").click().wait(1000);
    cy.contains("Breakfast").click().wait(1000);
    cy.contains("BF Hotdog").click().wait(1000);
    cy.contains("BF Breakfast Steak").click().wait(1000);
    cy.contains("BF Beef Tapa").click().wait(1000);

    cy.get(":nth-child(5) > .bg-green-100").click();
    cy.get(".px-8").should("have.text", "Add discount");
    cy.get("#discde").select("20%");
    cy.get("#orderitmid").click();
    cy.get(".border-blue-500").click();

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

    const ST = 210;
    const SC_Formula = (ST / 1.12) * 0.1;
    const T3_SCharge = Number(SC_Formula.toFixed(2)); //18.75
    const Disc_Formula = ST * 0.2;
    const Discount = Disc_Formula.toFixed(2); //42.00
    const GT = Number(ST - Discount);
    const total = Number(GT + T3_SCharge);

    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T3_SCharge);
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total);

    cy.contains("Payment").click();
    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Edith ulit");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.waot(5000)
  });



})