let assertionResults = [];
let failureMessages = [];

describe("Transaction 22", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });
  it("1 Pax with MEMC PWD Discount", () => {
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.contains("Food").click();
    cy.contains("Family Super Meals").click();
    cy.contains(
      "FSM B 8-pcs Chickenjoy Bucket"
    ).click();

    cy.contains("Add Discount").click().wait(2000);
    cy.get("#discde").select("Person with Disability");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("PIDABALYUDI");
    cy.get("#cardno").click().type("234");
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : PWD"
    );

    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[21].subtotal;
      const Discount = data[21].discount
      const Discount1 = Discount.toFixed(2)
      const LVA = data[21].lessVatAdj
      const LVA1 = LVA.toFixed(2)
      const T22_SCharge = data[21].serviceCharge
      const ServiceCharge1 = T22_SCharge.toFixed(2)
      const SCharge_dsc = data[21].serviceChargeDiscount
      const SCharge_dsc1 = SCharge_dsc.toFixed(2)
      const GT = data[21].total
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

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("YOR");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
 
    cy.wait(2000);

    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Void Transaction").click();
    cy.get(".me-2").should("have.text", "Void Transaction");
    cy.contains("INV-0000000000000022").click().wait(1500);

    cy.contains("Set void reason").should("have.text", "Set void reason");
    cy.get("#voidreason").select("Customer Cancelled Order");
    cy.get(".border-blue-500").click();

    // cy.get(".Toastify__toast-body > :nth-child(2)").should(
    //   "have.text",
    //   "Transaction Void Successfull"
    // );
    cy.wait(5000)
  });
});