let assertionResults = [];
let failureMessages = [];

describe("Transaction 10", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with MEMC PWD Discount and Service Charge", () => {
    cy.wait(2000);

    cy.contains("Food").click().wait(1000);
    cy.contains("Family Super Meals").click().wait(1000);
    cy.contains(
      "FSM A 8-pcs Chickenjoy Bucket"
    )
      .click()
      .wait(1000);

    cy.contains("Add Discount").click();
    cy.get("#discde").select("PWD");
    cy.get("#orderitmid0").click();
    cy.get(".border-green-500").click();

    cy.get("#cardholder").click().type("Ariana Grande");
    cy.get("#cardno").click().type("464345");
   
    cy.get("#discountUser > .flex-col > #buttons > .border-green-500").click();
    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : PWD"
    );

    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[9].subtotal;
      const Discount = data[9].discount
      const Discount1 = Discount.toFixed(2)
      const LVA = data[9].lessVatAdj
      const LVA1 = LVA.toFixed(2)
      const T10_SCharge = data[9].serviceCharge
      const ServiceCharge1 = T10_SCharge.toFixed(2)
      const SCharge_dsc = data[9].serviceChargeDiscount
      const SCharge_dsc1 = SCharge_dsc.toFixed(2)
      const GT = data[9].total
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
      cy.get(":nth-child(5) > :nth-child(2)").should("have.text", SCharge_dsc1);
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
      cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
        "have.text",
        "SCharge Discount -" + SCharge_dsc1
      );
      cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

    })


    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Ariana G");
    cy.get(".border-green-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.get('.ant-modal-close').click()
    cy.wait(5000)
  });

})