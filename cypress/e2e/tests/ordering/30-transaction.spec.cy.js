let assertionResults = [];
let failureMessages = [];

describe("Transaction 28", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Athlete Discount", () => {

    cy.contains("Food").click();
    cy.contains("Chicken").click();
    cy.contains("1-pc Chickenjoy w/ Fries Meal").click();

    cy.contains("Add Discount").click().wait(2000);

    cy.get("#discde").select("Athlete").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get(".border-green-500").click().wait(2000);

    cy.get("#cardholder").click().type("Minjeongie").wait(2000);
    cy.get("#cardno").click().type("23423425").wait(2000);
    cy.get("#discountUser > .flex-col > #buttons > .border-green-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10")
      .should("have.text", "Discount : Athlete")
      .wait(2000);

      cy.fixture('ordering-scenarios.json').then((data) => {
    
        const ST = data[27].subtotal;
        const Discount = data[27].discount
        const Discount1 = Discount.toFixed(2)
        const LVA = data[27].lessVatAdj
        const LVA1 = LVA.toFixed(2)
        const T28_SCharge = data[27].serviceCharge
        const ServiceCharge1 = T28_SCharge.toFixed(2)
        const SCharge_dsc = data[27].serviceChargeDiscount
        const SCharge_dsc1 = SCharge_dsc.toFixed(2)
        const GT = data[27].total
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
    cy.get("#customerName").click().type("Yizuo").wait(2000);
    cy.get(".border-green-500").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700")
      .click()
      .wait(2000);
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );

    cy.wait(2000);
    cy.get("#postypcde").select("Dine-In").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Refund Transaction").click().wait(2000);
    cy.get('#usrcde').click().type("lstv")
    cy.get('#usrpwd').click().type("lstventures")
    cy.get('.sc-guDLey').click()

    cy.get(".px-8").should("have.text", "Refund Transaction").wait(1500);
    cy.get("#refundreason").select("Food Quality Issue").wait(2000);
    cy.get(".border-green-500").click().wait(2000);

    cy.get(".me-2").should("have.text", "REF-0000000000000006");
    cy.get(".justify-between > .group").click().wait(1500);
    cy.contains("INV-0000000000000028").click().wait(1500);

    cy.get(".css-1ex1afd-MuiTableCell-root")
      .should("have.text", "1-pc Chickenjoy w/ Fries Meal")
      .wait(2000);
    cy.get("#refundqty").clear().type("1").wait(2000);
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(4)")
      .should("have.text", "86.25")
      .wait(2000);
    cy.contains("Next").click();

    cy.get(".h-full > .justify-between > .font-bold").should(
      "have.text",
      "TOTAL : 86.25"
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