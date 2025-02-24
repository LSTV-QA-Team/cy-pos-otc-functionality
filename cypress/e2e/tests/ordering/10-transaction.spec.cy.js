let assertionResults = [];
let failureMessages = [];

describe("Transaction 8", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Diplomat Discount and Service Charge", () => {
    cy.wait(2000);

    cy.get(':nth-child(3) > .sc-blHHSb').click().wait(2000);
    cy.contains("Food").click().wait(1000);
    cy.contains(/^Super Meals$/).click().wait(1000);
    cy.get('#occ-txt-btn')
      .click()
      .wait(1000);
    cy.contains("Add Discount").click();

    cy.get("#discde").select("Diplomat");
    cy.get("#orderitmid0").click();
    cy.get("#button-form-2").click();

    cy.get("#cardholder").click().type("Karina");
    cy.get('#address').click().type ("Philippines")
    cy.get("#cardno").click().type("678656");
    
    cy.get('#discountUser > #button-form-div-1 > #button-form-div-2 > #button-form-2').click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Diplomat"
    );
    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[7].subtotal;
      const Discount = data[7].discount
      const Discount1 = Discount.toFixed(2)
      const LVA = data[7].lessVatAdj
      const LVA1 = LVA.toFixed(2)
      const T8_SCharge = data[7].serviceCharge
      const ServiceCharge1 = T8_SCharge.toFixed(2)
      const SCharge_dsc = data[7].serviceChargeDiscount
      const SCharge_dsc1 = SCharge_dsc.toFixed(2)
      const GT = data[7].total
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
  
      cy.contains("Payment").click();
      cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
        "have.text",
        ST +".00"
      );
      cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
        "have.text",
        "-" + Discount + ".00"
      );
      cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
        "have.text",
        "-" + LVA1
      );
      cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
        "have.text",
        "Service Charge " + ServiceCharge1
      );
      cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

    })

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Kaaarrrllll");
    cy.get("#button-form-2").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.get('.ant-modal-close').click()
    cy.wait(5000)
  });

})