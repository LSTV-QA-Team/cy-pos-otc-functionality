let assertionResults = [];
let failureMessages = [];

describe("Transaction 17", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with PWD Discount", () => {
    cy.contains("Dessert").click().wait(2000);
    cy.contains("Desserts and Pies").click().wait(2000);
    cy.contains("Buko Pie").click().wait(2000);

    cy.contains("Add Discount").click().wait(2000);
    cy.get("#discde").select("PWD").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get(".border-green-500").click();

    cy.get("#cardholder").click().type("Tanya").wait(2000);
    cy.get("#cardno").click().type("12342345235").wait(2000);
    cy.get("#discountUser > .flex-col > #buttons > .border-green-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10")
      .should("have.text", "Discount : PWD")
      .wait(2000);

   
      cy.fixture('ordering-scenarios.json').then((data) => {
    
        const ST = data[16].subtotal;
        const Discount = data[16].discount
        const Discount1 = Discount.toFixed(2)
        const LVA = data[16].lessVatAdj
        const LVA1 = LVA.toFixed(2)
        const T17_SCharge = data[16].serviceCharge
        const ServiceCharge1 = T17_SCharge.toFixed(2)
        const SCharge_dsc = data[16].serviceChargeDiscount
        const SCharge_dsc1 = SCharge_dsc.toFixed(2)
        const GT = data[16].total
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
    cy.get("#customerName").click().type("Tanya").wait(2000);
    cy.get(".border-green-500").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.wait(2000);
    cy.get('.ant-modal-close').click()

    cy.contains("Void Transaction").click().wait(2000);
    cy.get(".me-2").should("have.text", "Void Transaction").wait(2000);
    cy.contains("INV-0000000000000017").click().wait(1500);

    cy.contains("Set void reason").should("have.text", "Set void reason");
    cy.get("#voidreason").select("Order Duplication");
    cy.get(".border-green-500").click().wait(2000);

    cy.get(".Toastify__toast-body > :nth-child(2)").should(
      "have.text",
      "Transaction Void Successful"
    );
    cy.wait(5000)
    cy.get('.ant-modal-close').click()
  });

})