let assertionResults = [];
let failureMessages = [];

describe("Transaction 16", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });
  

  it("1 Pax with Senior Discount", () => {
    cy.get(':nth-child(3) > .sc-blHHSb').click().wait(1000);
    cy.contains("Food").click().wait(2000);
    cy.contains("Take-Out Favorites").click().wait(2000);
    cy.contains("TF Palabok Family Pan").click().wait(2000);

    cy.contains("Add Discount").click().wait(2000);

    cy.get("#discde").select("Senior").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get("#button-form-2").click();

    cy.get("#cardholder").click().type("Winter").wait(2000);
    cy.get("#cardno").click().type("4569084").wait(2000);
    cy.get('#discountUser > #button-form-div-1 > #button-form-div-2 > #button-form-2').click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10")
      .should("have.text", "Discount : Senior")
      .wait(2000);

    
      cy.fixture('ordering-scenarios.json').then((data) => {
    
        const ST = data[15].subtotal;
        const Discount = data[15].discount
        const Discount1 = Discount.toFixed(2)
        const LVA = data[15].lessVatAdj
        const LVA1 = LVA.toFixed(2)
        const T16_SCharge = data[15].serviceCharge
        const ServiceCharge1 = T16_SCharge.toFixed(2)
        const SCharge_dsc = data[15].serviceChargeDiscount
        const SCharge_dsc1 = SCharge_dsc.toFixed(2)
        const GT = data[15].total
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

    cy.contains("Payment").click().wait(2000);

    cy.contains("CASH").click().wait(2000);
    cy.get("#customerName").click().type("Giselle").wait(2000);
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

    cy.contains("Void Transaction").click();
    cy.get(".me-2").should("have.text", "Void Transaction").wait(2000);
    cy.contains("INV-0000000000000016").click().wait(1500);

    cy.contains("Set void reason").should("have.text", "Set void reason");
    cy.get("#voidreason").select("Customer Complaint").wait(2000);
    cy.get("#button-form-2").click().wait(2000);

    cy.get(".Toastify__toast-body > :nth-child(2)").should(
      "have.text",
      "Transaction Void Successful"
    );
  });
})