let assertionResults = [];
let failureMessages = [];

describe("Transaction 7", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Medal of Valor Discount and Service Charge", () => {
    cy.wait(2000);
    cy.get(':nth-child(3) > .sc-blHHSb').click().wait(2000);
    cy.contains("Food").click().wait(1000);
    cy.contains("Burger Steak").click().wait(1000);
    cy.contains("1-pc Burger Steak w/ 3pcs Shanghai").click().wait(1000);

    cy.contains("Add Discount").click();
    cy.get("#discde").select("MOV");
    cy.get("#orderitmid0").click();
    cy.get("#button-form-2").click();

    cy.get("#cardholder").click().type("Winter");
    cy.get("#cardno").click().type("89745467");

    cy.get('#discountUser > #button-form-div-1 > #button-form-div-2 > #button-form-2').click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : MOV"
    );

    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[6].subtotal;
      const Discount = data[6].discount
      const Discount1 = Discount.toFixed(2)
      const LVA = data[6].lessVatAdj
      const LVA1 = LVA.toFixed(2)
      const T7_SCharge = data[6].serviceCharge
      const ServiceCharge1 = T7_SCharge.toFixed(2)
      const SCharge_dsc = data[6].serviceChargeDiscount
      const SCharge_dsc1 = SCharge_dsc.toFixed(2)
      const GT = data[6].total
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
        "-" + Discount1
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
    cy.get("#customerName").click().type("Jeromeeeee");
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