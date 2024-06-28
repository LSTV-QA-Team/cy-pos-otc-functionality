let assertionResults = [];
let failureMessages = [];

describe("Transaction 8", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];www

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Diplomat Discount and Service Charge", () => {
    cy.wait(2000);
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("DINE IN").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("FOOD").click().wait(1000);
    cy.contains("Super Meals").click().wait(1000);
    cy.contains(
      "Chickenjoy, Burger Steak, Half Jolly Spaghetti, Rice and Drink"
    )
      .click()
      .wait(1000);
    cy.contains("Add Discount").click();

    cy.get("#discde").select("Diplomat");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Karina");
    cy.get("#cardno").click().type("678656");
    
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Diplomat"
    );
    const ST = 150;
    const Discount = 0;
    const LVA = (ST / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2)); //16.07
    const SC_Formula = (ST / 1.12) * 0.1;
    const T8_SCharge = Number(SC_Formula.toFixed(2)); //13.39
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T8_SCharge);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "150.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "0.00"
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T8_SCharge);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱150.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-0.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-" + LVA1
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + T8_SCharge
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Kaaarrrllll");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
  });

})