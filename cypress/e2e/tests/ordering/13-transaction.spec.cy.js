let assertionResults = [];
let failureMessages = [];

describe("Transaction 11", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("1 Pax with MEMC Senior Discount and Service Charge - DINE IN ", () => {
    cy.wait(2000);
    cy.get(':nth-child(3) > .sc-blHHSb').click()
    cy.get('.sc-dntaoT').click().wait(2000)
    cy.get('#postypcde').select("Dine-In")
    cy.get('#warcde').select("Jollibee 1")
    cy.get('#button-form-2').click().wait(5000)

    cy.contains("Food").click().wait(1000);
    cy.contains(/^Chicken$/).click().wait(2000)
    cy.contains("Chickenjoy Bucket 6pcs").click();

    cy.contains("Add Discount").click();
    cy.get("#discde").select("Senior");
    cy.get("#orderitmid0").click();
    cy.get("#button-form-2").click();

    cy.get("#cardholder").click().type("Jessie J");
    cy.get("#cardno").click().type("3452435");

    cy.get('#discountUser > #button-form-div-1 > #button-form-div-2 > #button-form-2').click();
    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Senior"
    );

    cy.fixture("ordering-scenarios.json").then((data) => {
      const ST = data[10].subtotal;
      const Discount = data[10].discount;
      const Discount1 = Discount.toFixed(2);
      const LVA = data[10].lessVatAdj;
      const LVA1 = LVA.toFixed(2);
      const T11_SCharge = Number(data[10].serviceCharge);
      const SCharge = T11_SCharge.toFixed(3);
      const SCharge_dsc = data[10].serviceChargeDiscount;
      const SCharge_dsc1 = SCharge_dsc.toFixed(3);
      const GT = data[10].total;
      const total1 = GT.toFixed(2);

      cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
        "have.text",
        ST + ".00"
      );
      cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
        "have.text",
        Discount1
      );
      cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
        "have.text",
        LVA1
      );

      cy.get(":nth-child(4) > :nth-child(2)").should(
        "have.text",
        Math.round(SCharge * 100) / 100
      );
      cy.get(":nth-child(5) > :nth-child(2)").should(
        "have.text",
        Math.round(SCharge_dsc1 * 100) / 100
      );
      cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

      cy.contains("Payment").click();
      cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
        "have.text",
        ST + ".00"
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
        "Service Charge " + Math.round(SCharge * 100) / 100
      );
      cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
        "have.text",
        "SCharge Discount -" + Math.round(SCharge_dsc1 * 100) / 100
      );
      cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);
    });

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Ariana G");
    cy.get("#button-form-2").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.get('.ant-modal-close').click()
    cy.wait(5000);
  });
});
