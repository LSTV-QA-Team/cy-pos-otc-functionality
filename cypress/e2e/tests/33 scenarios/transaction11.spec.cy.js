let assertionResults = [];
let failureMessages = [];

describe("Transaction 10", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];www

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with MEMC Senior Discount and Service Charge", () => {
    cy.wait(2000);
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("DINE IN").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("FOOD").click().wait(1000);
    cy.contains("Chicken").click().wait(1000);
    cy.contains("Chickenjoy Bucket 6pcs").click();

    cy.contains("Add Discount").click();
    cy.get("#discde").select("Senior");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Jessie J");
    cy.get("#cardno").click().type("3452435");

    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();
    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Senior"
    );

    const ST = 399;
    const Disc_Formula = Number(ST / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2); //71.25
    const LVA = (ST / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2));
    const SC_Formula = (ST / 1.12) * 0.1;
    const T11_SCharge = Number(SC_Formula.toFixed(3)); //35.625
    const SCharge_dsc = T11_SCharge * 0.2;
    const SCharge_dsc1 = SCharge_dsc.toFixed(2);
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T11_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "399.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should(
      "have.text",
      Math.round(T11_SCharge * 100) / 100
    );
    cy.get(":nth-child(5) > :nth-child(2)").should(
      "have.text",
      Math.round(SCharge_dsc1 * 100) / 100
    );
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1 + "0");

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱399.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-" + Discount
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-" + LVA1
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + Math.round(T11_SCharge * 100) / 100
    );

    cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
      "have.text",
      "SCharge Discount -" + Math.round(SCharge_dsc1 * 100) / 100
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1 + "0");

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Ariana G");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
  });

})