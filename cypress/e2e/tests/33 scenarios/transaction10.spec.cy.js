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
    cy.get("#postypcde").select("TAKEOUT").wait(2000);
    cy.get("#warcde").select("Jollibee 2").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("FOOD").click().wait(1000);
    cy.contains("Family Super Meals").click().wait(1000);
    cy.contains(
      "FSM A 8pc: Chickenjoy Bucket (4 Rice, 4 Sides, 4 Mini Sundaes, and 4 Regular Drinks)"
    )
      .click()
      .wait(1000);

    cy.contains("Add Discount").click();
    cy.get("#discde").select("Person with Disability");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Ariana Grande");
    cy.get("#cardno").click().type("464345");
   
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();
    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : PWD"
    );

    const ST = 799;
    const Disc_Formula = Number(200 / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2); //35.71
    const LVA = (200 / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2));
    const SC_Formula = (ST / 1.12) * 0.1;
    const T10_SCharge = Number(SC_Formula.toFixed(2)); //71.34
    const SCharge_dsc = T10_SCharge * 0.2;
    const SCharge_dsc1 = SCharge_dsc.toFixed(2);
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T10_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "799.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T10_SCharge);
    cy.get(":nth-child(5) > :nth-child(2)").should("have.text", SCharge_dsc1);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱799.00"
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
      "Service Charge " + T10_SCharge
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