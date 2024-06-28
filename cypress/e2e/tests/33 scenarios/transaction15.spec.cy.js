let assertionResults = [];
let failureMessages = [];

describe("Transaction 15", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with 20% discount", () => {
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.contains("DESSERT").click().wait(2000);
    cy.contains("Desserts and Pies").click().wait(2000);
    cy.contains("Jolly Crispy Fries").click().wait(2000);

    cy.contains("Add Discount").click().wait(2000);
    cy.get("#discde").select("20%").wait(2000);
    cy.get("#orderitmid0").click().wait(2000);
    cy.get(".border-blue-500").click().wait(2000);

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10")
      .should("have.text", "Discount : 20%")
      .wait(2000);

    const ST = 42;
    const SC_Formula = (ST / 1.12) * 0.1;
    const T15_SCharge = Number(SC_Formula.toFixed(2));
    const Disc_Formula = ST * 0.2;
    const Discount = Disc_Formula.toFixed(2);
    const GT = Number(ST - Discount);
    const total = Number(GT + T15_SCharge);

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "42.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "0.00"
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T15_SCharge);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total);

    cy.contains("Payment").click();

    cy.contains("CASH").click().wait(2000);
    cy.get("#customerName").click().type("Karina");
    cy.get(".border-blue-500").click().wait(2000);
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700")
      .click()
      .wait(2000);
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );

    cy.wait(2000);
    cy.get("#postypcde").select("DINE IN").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Void Transaction").click();
    cy.get(".me-2").should("have.text", "Void Transaction");
    cy.contains("INV-0000000000000015").click().wait(1500);

    cy.contains("Set void reason").should("have.text", "Set void reason");
    cy.get("#voidreason").select("Food Quality Issue");
    cy.get(".border-blue-500").click();

    // cy.get(".Toastify__toast-body > :nth-child(2)").should(
    //   "have.text",
    //   "Transaction Void Successfull"
    // );
  });

})