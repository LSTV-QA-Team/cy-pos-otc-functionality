let assertionResults = [];
let failureMessages = [];

describe("Transaction 13", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Regular Transaction", () => {
    cy.get(':nth-child(3) > .sc-blHHSb').click().wait(1000);

    cy.contains("Food").click();
    cy.contains(/^Chicken$/).click().wait(2000)
    cy.contains("1-pc Chickenjoy w/ Palabok Meal").click().wait(2000);
    cy.contains("1-pc Chickenjoy w/ Burger Steak").click().wait(2000);

    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[12].subtotal;
      const Discount = data[12].discount
      const Discount1 = Discount.toFixed(2)
      const LVA = data[12].lessVatAdj
      const LVA1 = LVA.toFixed(2)
      const T13_SCharge = data[12].serviceCharge
      const ServiceCharge1 = T13_SCharge.toFixed(2)
      const SCharge_dsc = data[12].serviceChargeDiscount
      const SCharge_dsc1 = SCharge_dsc.toFixed(2)
      const GT = data[12].total
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

    cy.contains("Payment").click().wait(2000);
    cy.contains("CASH").click().wait(2000);
    cy.get("#customerName").click().type("Ariana G");
    cy.get("#button-form-2").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700")
      .click()
      .wait(2000);
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );

    cy.get('.ant-modal-close').click()
    cy.wait(2000);

    cy.contains("Void Transaction").click().wait(1500);
    cy.get(".px-8").should("have.text", "Void Transaction").wait(1500);
    cy.contains("INV-0000000000000013").click().wait(1500);

    cy.get("#voidreason").select("Employee Mistake");
    cy.get("#button-form-2").click().wait(2000);
    cy.get(".Toastify__toast-body > :nth-child(2)").should(
      "have.text",
      "Transaction Void Successful"
    );
  });

})

