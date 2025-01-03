let assertionResults = [];
let failureMessages = [];

describe("Transaction 21", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with MEMC Senior Discount", () => {
    cy.get(':nth-child(3) > .sc-blHHSb').click()
    cy.get('.sc-dntaoT').click().wait(2000)
    cy.get('#postypcde').select("Takeout")
    cy.get('#warcde').select("Jollibee 2")
    cy.get('.border-green-500').click()

    cy.contains("Food").click();
    cy.contains(/^Family Super Meals$/).click();
    cy.contains(
      "FSM B 6-pcs Chickenjoy Bucket"
    ).click();

    cy.contains("Add Discount").click().wait(2000);
    cy.get("#discde").select("Senior");
    cy.get("#orderitmid0").click();
    cy.get(".border-green-500").click();

    cy.get("#cardholder").click().type("Seniorrrritoo");
    cy.get("#cardno").click().type("234");
    cy.get("#discountUser > .flex-col > #buttons > .border-green-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Senior"
    );

    cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[20].subtotal;
      const Discount = data[20].discount
      const Discount1 = Discount.toFixed(2)
      const LVA = data[20].lessVatAdj
      const LVA1 = LVA.toFixed(2)
      const T21_SCharge = data[20].serviceCharge
      const ServiceCharge1 = T21_SCharge.toFixed(2)
      const SCharge_dsc = data[20].serviceChargeDiscount
      const SCharge_dsc1 = SCharge_dsc.toFixed(2)
      const GT = data[20].total
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
    cy.get("#customerName").click().type("MEMSIIII");
    cy.get(".border-green-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.get('.ant-modal-close').click()
    cy.wait(2000);


    cy.contains("Void Transaction").click();
    cy.get(".me-2").should("have.text", "Void Transaction");
    cy.contains("INV-0000000000000021").click().wait(1500);

    cy.contains("Set void reason").should("have.text", "Set void reason");
    cy.get("#voidreason").select("Customer Cancelled Order");
    cy.get(".border-green-500").click();

    cy.get(".Toastify__toast-body > :nth-child(2)").should(
      "have.text",
      "Transaction Void Successfull"
    );
    cy.wait(5000)
    cy.get('.ant-modal-close').click()
  });

})