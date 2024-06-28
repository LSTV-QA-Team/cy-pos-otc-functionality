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
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("DINE IN").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000);
    cy.contains("FOOD").click().wait(2000);
    cy.contains("Chicken").click().wait(2000);
    cy.contains("1pc Chickenjoy w Fries Meal").click().wait(2000);
    cy.contains("1pc Chickenjoy w Jolly Spaghetti").click().wait(2000);

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

    const ST = 204;
    const SC_Formula = (ST / 1.12) * 0.1;
    const T2_SCharge = Number(SC_Formula.toFixed(2)); //18.21
    const Disc_Formula = ST * 0.1;
    const Discount = Disc_Formula.toFixed(2); //20.40
    const GT = Number(ST - Discount);
    const total = Number(GT + T2_SCharge);

    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T2_SCharge);
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total);

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