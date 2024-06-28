let assertionResults = [];
let failureMessages = [];

describe("Transaction 18", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Athlete Discount", () => {
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.contains("FOOD").click().wait(2000);
    cy.contains("Breakfast").click().wait(2000);
    cy.contains("BF Hotdog").click().wait(2000);

    cy.contains("Add Discount").click().wait(2000);
    cy.get("#discde").select("Athlete").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get(".border-blue-500").click().wait(2000);

    cy.get("#cardholder").click().type("Tony");
    cy.get("#cardno").click().type("645734");
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10")
      .should("have.text", "Discount : Athlete")
      .wait(2000);

    const ST = 60;
    const Disc_Formula = Number(ST / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2);
    const SC_Formula = (ST / 1.12) * 0.1;
    const T18_SCharge = Number(SC_Formula.toFixed(2));
    const SCharge_dsc = T18_SCharge * 0.2;
    const SCharge_dsc1 = Number(SCharge_dsc.toFixed(2));
    const GT = Number(ST - Discount);
    const total = Number(GT + T18_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "60.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "0.00"
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T18_SCharge);
    cy.get(":nth-child(5) > :nth-child(2)").should("have.text", SCharge_dsc1);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", "53.57");

    cy.contains("Payment").click().wait(2000);

    cy.contains("CASH").click().wait(2000);
    cy.get("#customerName").click().type("Guru").wait(2000);
    cy.get(".border-blue-500").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );

    cy.wait(2000);

    cy.get("#postypcde").select("DINE IN").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Void Transaction").click();
    cy.get(".me-2").should("have.text", "Void Transaction").wait(2000);
    cy.contains("INV-0000000000000018").click().wait(1500);

    cy.contains("Set void reason").should("have.text", "Set void reason");
    cy.get("#voidreason").select("Customer Cancelled Order");
    cy.get(".border-blue-500").click();

    // cy.get(".Toastify__toast-body > :nth-child(2)").should(
    //   "have.text",
    //   "Transaction Void Successfull"
    // );
  });


})