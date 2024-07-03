let assertionResults = [];
let failureMessages = [];

describe("Transaction 14", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with 10% discount", () => {
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.contains("Food").click().wait(2000);
    cy.contains("Hotdog").click().wait(2000);
    cy.contains("Cheesy Classic Jolly Hotdog").click().wait(2000);
    cy.contains("Cheesy Classic w Fries").click().wait(2000);

    cy.contains("Add Discount").click().wait(2000);
    cy.get("#discde").select("10%");
    cy.get("#orderitmid").click().wait(2000);
    cy.get(".border-blue-500").click().wait(2000);


    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : 10%"
    );
    cy.get(":nth-child(4) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : 10%"
    );

    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[13].subtotal;
      const Discount = data[13].discount
      const Discount1 = Discount.toFixed(2)
      const LVA = data[13].lessVatAdj
      const LVA1 = LVA.toFixed(2)
      const T14_SCharge = data[13].serviceCharge
      const ServiceCharge1 = T14_SCharge.toFixed(2)
      const SCharge_dsc = data[13].serviceChargeDiscount
      const SCharge_dsc1 = SCharge_dsc.toFixed(2)
      const GT = data[13].total
      const total1 = GT.toFixed(2)

      cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
        "have.text",
        ST +".00"
      );
      cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
        "have.text",
        Discount1
      );
      cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
        "have.text",
        LVA1
      );

      cy.get(":nth-child(4) > :nth-child(2)").should("have.text", ServiceCharge1);
      cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);
    
    })

    cy.contains("Payment").click();
    cy.contains("CASH").click().wait(2000);
    cy.get("#customerName").click().type("Ariana G").wait(2000);
    cy.get(".border-blue-500").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );

    cy.wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Void Transaction").click();
    cy.get(".me-2").should("have.text", "Void Transaction");
    cy.contains("INV-0000000000000014").click().wait(1500);

    cy.contains("Set void reason")
      .should("have.text", "Set void reason")
      .wait(2000);
    cy.get("#voidreason").select("Order Duplication");
    cy.get(".border-blue-500").click().wait(2000);

    cy.get(".Toastify__toast-body > :nth-child(2)").should(
      "have.text",
      "Transaction Void Successful"
    );
    cy.wait(5000)
  });

})