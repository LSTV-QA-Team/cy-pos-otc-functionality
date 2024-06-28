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

  it("1 Pax with MEMC PWD Discount and Service Charge", () => {
    cy.wait(2000);
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("DINE IN").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("FOOD").click().wait(1000);
    cy.contains("Chicken").click().wait(1000);
    cy.contains("Chickenjoy Bucket 8pcs").click();

    cy.contains("Add Discount").click();
    cy.get("#discde").select("Person with Disability");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Nicky Minaj");
    cy.get("#cardno").click().type("98756790");

    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();
    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : PWD"
    );

    const ST = 499;
    const Disc_Formula = Number(ST / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2); //89.11
    const LVA = (ST / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2));
    const SC_Formula = (ST / 1.12) * 0.1;
    const T12_SCharge = Number(SC_Formula.toFixed(2)); //44.55
    const SCharge_dsc = T12_SCharge * 0.2;
    const SCharge_dsc1 = SCharge_dsc.toFixed(2);
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T12_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "499.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T12_SCharge);
    cy.get(":nth-child(5) > :nth-child(2)").should("have.text", SCharge_dsc1);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱499.00"
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
      "Service Charge " + T12_SCharge
    );

    cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
      "have.text",
      "SCharge Discount -" + SCharge_dsc1
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

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