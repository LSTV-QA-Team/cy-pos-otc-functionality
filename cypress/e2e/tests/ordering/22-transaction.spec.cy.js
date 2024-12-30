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

    cy.contains("Beverages").click().wait(2000);
    cy.get(':nth-child(2) > .sc-jtQUzJ > .sc-eOzmre').click().wait(2000);
    cy.contains("Brown Sugar Milk Tea").click().wait(2000);

    cy.contains("Add Discount").click().wait(2000);
    cy.get("#discde").select("Diplomat").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get(".border-green-500").click();

    cy.get("#cardholder").click().type("Diploooo");
    cy.get("#cardno").click().type("345345");
    cy.get("#discountUser > .flex-col > #buttons > .border-green-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Diplomat"
    ).wait(2000);

    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[19].subtotal;
      const Discount = data[19].discount
      const Discount1 = Discount.toFixed(2)
      const LVA = data[19].lessVatAdj
      const LVA1 = LVA.toFixed(2)
      const T20_SCharge = data[19].serviceCharge
      const ServiceCharge1 = T20_SCharge.toFixed(2)
      const SCharge_dsc = data[19].serviceChargeDiscount
      const SCharge_dsc1 = SCharge_dsc.toFixed(2)
      const GT = data[19].total
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

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Parehko");
    cy.get(".border-green-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click().wait(2000);
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.wait(2000);
    cy.get('.ant-modal-close').click()

    cy.contains("Void Transaction").click();
    cy.get(".me-2").should("have.text", "Void Transaction");
    cy.contains("INV-0000000000000020").click().wait(1500);

    cy.contains("Set void reason").should("have.text", "Set void reason");
    cy.get("#voidreason").select("Customer Cancelled Order");
    cy.get(".border-green-500").click();

    cy.get(".Toastify__toast-body > :nth-child(2)").should(
      "have.text",
      "Transaction Void Successfull"
    );

    cy.contains("Cancel Transaction").click();
    cy.get(".border-green-500").click();
    cy.get('.ant-modal-close').click()
  });
})