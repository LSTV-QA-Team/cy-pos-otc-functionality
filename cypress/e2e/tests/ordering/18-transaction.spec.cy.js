let assertionResults = [];
let failureMessages = [];

describe("Transaction 18", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Athlete Discount", () => {
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.contains("Food").click().wait(2000);
    cy.contains("Breakfast").click().wait(2000);
    cy.contains("BF Hotdog").click().wait(2000);

    cy.contains("Add Discount").click().wait(2000);
    cy.get("#discde").select("Athlete").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get(".border-blue-500").click().wait(2000);

    cy.get("#cardholder").click().type("Tony");
    cy.get("#cardno").click().type("645734");
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10")
      .should("have.text", "Discount : Athlete")
      .wait(2000);

   
      cy.fixture('ordering-scenarios.json').then((data) => {
    
        const ST = data[17].subtotal;
        const Discount = data[17].discount
        const Discount1 = Discount.toFixed(2)
        const LVA = data[17].lessVatAdj
        const LVA1 = LVA.toFixed(2)
        const T18_SCharge = data[17].serviceCharge
        const ServiceCharge1 = T18_SCharge.toFixed(2)
        const SCharge_dsc = data[17].serviceChargeDiscount
        const SCharge_dsc1 = SCharge_dsc.toFixed(2)
        const GT = data[17].total
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
    cy.get("#customerName").click().type("Guru").wait(2000);
    cy.get(".border-blue-500").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );

    cy.wait(2000);

    cy.get("#postypcde").select("Dine-In").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Void Transaction").click();
    cy.get(".me-2").should("have.text", "Void Transaction").wait(2000);
    cy.contains("INV-0000000000000018").click().wait(1500);

    cy.contains("Set void reason").should("have.text", "Set void reason");
    cy.get("#voidreason").select("Customer Cancelled Order");
    cy.get(".border-blue-500").click();

    cy.get(".Toastify__toast-body > :nth-child(2)").should(
      "have.text",
      "Transaction Void Successful"
    );
    cy.wait(5000)
  });


})