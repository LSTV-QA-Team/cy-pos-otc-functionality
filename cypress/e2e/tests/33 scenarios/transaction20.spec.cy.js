let assertionResults = [];
let failureMessages = [];

describe("Transaction 20", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Diplomat Discount", () => {
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.contains("BEVERAGES").click().wait(2000);
    cy.contains("Beverages").click().wait(2000);
    cy.contains("Brown Sugar Milk Tea").click().wait(2000);

    cy.contains("Add Discount").click().wait(2000);
    cy.get("#discde").select("Diplomat").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get(".border-blue-500").click().wait(2000);

    cy.get("#cardholder").click().type("Diploooo");
    cy.get("#cardno").click().type("345345");
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Diplomat"
    ).wait(2000);

    const ST = 50;
    const Discount = 0;
    const LVA = (ST / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2));
    const SC_Formula = (ST / 1.12) * 0.1;
    const T20_SCharge = Number(SC_Formula.toFixed(2));
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T20_SCharge);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "50.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "0.00"
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T20_SCharge);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", "49.11");

    cy.contains("Payment").click();

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Parehko");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click().wait(2000);
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.wait(2000);

    cy.get("#postypcde").select("DINE IN").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Void Transaction").click();
    cy.get(".me-2").should("have.text", "Void Transaction");
    cy.contains("INV-0000000000000020").click().wait(1500);

    cy.contains("Set void reason").should("have.text", "Set void reason");
    cy.get("#voidreason").select("Customer Cancelled Order");
    cy.get(".border-blue-500").click();

    // cy.get(".Toastify__toast-body > :nth-child(2)").should(
    //   "have.text",
    //   "Transaction Void Successfull"
    // );

    cy.contains("Cancel Transaction").click();
    cy.get(".border-blue-500").click();
  });
})