let assertionResults = [];
let failureMessages = [];

describe("Transaction 19", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Medal of Valor Discount", () => {
    cy.get(':nth-child(3) > .sc-blHHSb').click().wait(1000);
    cy.contains("Food").click().wait(2000);
    cy.contains("Breakfast").click().wait(2000);
    cy.contains("BF 2-pc Pancake").click().wait(2000);

    cy.contains("Add Discount").click().wait(2000);
    cy.get("#discde").select("MOV").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get("#button-form-2").click();

    cy.get("#cardholder").click().type("Mingmangmeng").wait(2000);
    cy.get("#cardno").click().type("563566").wait(2000);
    cy.get('#discountUser > #button-form-div-1 > #button-form-div-2 > #button-form-2').click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : MOV"
    ).wait(2000);

    cy.fixture('ordering-scenarios.json').then((data) => {
    const ST = data[18].subtotal;
    const Discount = data[18].discount
    const Discount1 = Discount.toFixed(2)
    const LVA = data[18].lessVatAdj
    const LVA1 = LVA.toFixed(2)
    const T19_SCharge = data[18].serviceCharge
    const ServiceCharge1 = T19_SCharge.toFixed(3)
    const SCharge_dsc = data[18].serviceChargeDiscount
    const SCharge_dsc1 = SCharge_dsc.toFixed(2)
    const GT = data[18].total
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
    cy.get(":nth-child(4) > :nth-child(2)").should(
      "have.text",
      Math.round(ServiceCharge1 * 100) / 100
    );
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);
  
  })

    cy.contains("Payment").click().wait(2000);

    cy.contains("CASH").click().wait(2000);
    cy.get("#customerName").click().type("Celine").wait(2000);
    cy.get("#button-form-2").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click().wait(2000);
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.get('.ant-modal-close').click()
    cy.wait(3000);


    cy.contains("Void Transaction").click().wait(2000);
    cy.get(".me-2").should("have.text", "Void Transaction").wait(2000);
    cy.contains("INV-0000000000000019").click().wait(1500);

    cy.contains("Set void reason").should("have.text", "Set void reason");
    cy.get("#voidreason").select("Customer Cancelled Order").wait(2000);
    cy.get("#button-form-2").click();

  });

})