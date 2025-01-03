let assertionResults = [];
let failureMessages = [];

describe("Transaction 33", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with Regular Transaction" , () => {

     cy.contains("Food").click();
     cy.contains("Sides").click();
     cy.contains("Buttered Corn").click();

     cy.fixture('ordering-scenarios.json').then((data) => {
    
      const ST = data[32].subtotal;
      const Discount = data[32].discount
      const Discount1 = Discount.toFixed(2)
      const LVA = data[32].lessVatAdj
      const LVA1 = LVA.toFixed(2)
      const T33_SCharge = data[32].serviceCharge
      const ServiceCharge1 = T33_SCharge.toFixed(2)
      const SCharge_dsc = data[32].serviceChargeDiscount
      const SCharge_dsc1 = SCharge_dsc.toFixed(2)
      const GT = data[32].total
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
    
    })
 
     cy.contains("Payment").click().wait(2000);
     cy.get('.group.text-green-700').click()
 
     cy.get('#freeitem > .flex > .me-1').click()
     cy.get('#textreason').click().type("Birthdayyyy")
     cy.get('.border-green-500').click()
     cy.get('.border-green-500').click()
 })
 
 })