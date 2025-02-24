let assertionResults = [];
let failureMessages = [];

describe("Transaction 31", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with MEMC Senior Discount", () => {
    cy.get(':nth-child(3) > .sc-blHHSb').click().wait(1000);
    cy.get('.sc-dntaoT').click().wait(2000)
    cy.get('#postypcde').select("Takeout")
    cy.get('#warcde').select("Jollibee 2")
    cy.get('#button-form-2').click().wait(1000)
    
    cy.contains("Food").click();
    cy.contains(/^Family Super Meals$/).click();
    cy.contains(
      "FSM B 6-pcs Chickenjoy Bucket"
    ).click();

    cy.contains("Add Discount").click().wait(2000);

    cy.get("#discde").select("Senior").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get("#button-form-2").click().wait(2000);

    cy.get("#cardholder").click().type("Yizuo").wait(2000);
    cy.get("#cardno").click().type("23423425").wait(2000);
    cy.get('#discountUser > #button-form-div-1 > #button-form-div-2 > #button-form-2').click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10")
      .should("have.text", "Discount : Senior")
      .wait(2000);

      cy.fixture('ordering-scenarios.json').then((data) => {
    
        const ST = data[30].subtotal;
        const Discount = data[30].discount
        const Discount1 = Discount.toFixed(2)
        const LVA = data[30].lessVatAdj
        const LVA1 = LVA.toFixed(2)
        const T31_SCharge = data[30].serviceCharge
        const ServiceCharge1 = T31_SCharge.toFixed(2)
        const SCharge_dsc = data[30].serviceChargeDiscount
        const SCharge_dsc1 = SCharge_dsc.toFixed(2)
        const GT = data[30].total
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
      
      })

    cy.contains("Payment").click();
    cy.contains("CASH").click().wait(2000);
    cy.get("#customerName").click().type("Ningie").wait(2000);
    cy.get("#button-form-2").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700")
      .click()
      .wait(2000);
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );

    cy.get('.ant-modal-close').click()
    cy.wait(3000);

    cy.contains("Refund Transaction").click().wait(2000);
    cy.get('#usrcde').click().type("lstv")
    cy.get('#usrpwd').click().type("lstventures")
    cy.get('.mt-8 > .sc-gtLWhw').click()

    cy.get(".px-8").should("have.text", "Refund Transaction").wait(1500);
    cy.get("#refundreason").select("Food Quality Issue").wait(2000);
    cy.get("#button-form-2").click().wait(2000);

    cy.get(".me-2").should("have.text", "REF-0000000000000009");
    cy.get(".justify-between > .group").click().wait(1500);
    cy.contains("INV-0000000000000031").click().wait(1500);

 /*    cy.get(".css-1ex1afd-MuiTableCell-root")
      .should(
        "have.text",
        "FSM B 6-pcs Chickenjoy Bucket"
      )
      .wait(2000); */
    cy.get("#refundqty").clear().type("1").wait(2000);
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(4)")
      .should("have.text", "568.66")
      .wait(2000);
    cy.contains("Next").click();

    cy.get(".h-full > .justify-between > .font-bold").should(
      "have.text",
      "TOTAL : 568.66"
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