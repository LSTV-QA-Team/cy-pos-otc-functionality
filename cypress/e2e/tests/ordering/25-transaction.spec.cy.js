let assertionResults = [];
let failureMessages = [];

describe("Transaction 23", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Regular Transaction", () => {
    cy.get(':nth-child(3) > .sc-blHHSb').click().wait(1000);
    cy.get('.sc-dntaoT').click().wait(2000)
    cy.get('#postypcde').select("Dine-In").wait(1000)
    cy.get('#warcde').select("Jollibee 1").wait(1000)
    cy.get('#button-form-2').click().wait(1000)

    cy.contains("Food").click();
    cy.contains(/^Chicken$/).click();
    cy.contains("1-pc Chickenjoy w/ Fries Meal").click();

    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[22].subtotal;
      const Discount = data[22].discount
      const Discount1 = Discount.toFixed(2)
      const LVA = data[22].lessVatAdj
      const LVA1 = LVA.toFixed(2)
      const T23_SCharge = data[22].serviceCharge
      const ServiceCharge1 = T23_SCharge.toFixed(2)
      const SCharge_dsc = data[22].serviceChargeDiscount
      const SCharge_dsc1 = SCharge_dsc.toFixed(2)
      const GT = data[22].total
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
      /* cy.checkToastifyVisibility('#postTransactionV2', '1000', 'Check if the toast will appear', 'Transaction Complete', assertionResults, failureMessages) */

    cy.get('.ant-modal-close').click()
    cy.wait(3000);

    cy.contains("Refund Transaction").click().wait(1500);
    cy.get('#usrcde').click().type("lstv")
    cy.get('#usrpwd').click().type("lstventures")
    cy.get('.mt-8 > .sc-gtLWhw').click()

    cy.get(".px-8").should("have.text", "Refund Transaction").wait(1500);
    cy.get("#refundreason").select("Customer Complaint").wait(2000);
    cy.get("#button-form-2").click().wait(2000);

    cy.get(".px-8").should("have.text", "REF-0000000000000001");
    cy.get(".justify-between > .group").click().wait(2000);
    cy.contains("INV-0000000000000023").click().wait(2000);
/* 
    cy.get(".css-1ex1afd-MuiTableCell-root")
      .should("have.text", "1-pc Chickenjoy w/ Fries Meal")
      .wait(2000); */
    cy.get("#refundqty").clear().type("1").wait(2000);
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(4)")
      .should("have.text", "114.37")
      .wait(2000);
    cy.contains("Next").click();

    cy.get(".h-full > .justify-between > .font-bold").should(
      "have.text",
      "TOTAL : 114.37"
    );
    cy.get(":nth-child(3) > .group").click();
    cy.contains("Proceed").click();
    cy.contains("Transaction Refunded.").should(
      "have.text",
      "Transaction Refunded."
    );
    cy.wait(5000)
  });


})