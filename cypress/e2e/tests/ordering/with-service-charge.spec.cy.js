let assertionResults = [];
let failureMessages = [];

describe("With Service Charge ", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];


    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  before("Clear Transaction" , () => { 

    cy.task("queryDb","TRUNCATE TABLE posfile")
    cy.task("queryDb","TRUNCATE TABLE orderfile")
    cy.task("queryDb","TRUNCATE TABLE orderfile2")
    cy.task("queryDb","TRUNCATE TABLE tabletranfile")
    cy.task("queryDb","TRUNCATE TABLE tabletranfile2")
    cy.task("queryDb","TRUNCATE TABLE takeouttranfile")
    cy.task("queryDb","TRUNCATE TABLE billingfile")
    cy.task("queryDb","TRUNCATE TABLE voidrequestfile")
    cy.task("queryDb","TRUNCATE TABLE orderitemdiscountfile")
    cy.task("queryDb","TRUNCATE TABLE orderdiscountfile")
    cy.task("queryDb","TRUNCATE TABLE orderitemmodifierfile")
    cy.task("queryDb","TRUNCATE TABLE zreadingfile")


    cy.task('queryDb', `
      UPDATE syspar 
      SET ordocnum = 'INV-0000000000000001', 
          posdocnum = 'POS-0000000000000001', 
          seqnum = 'SEQ-0000000000000000', 
          billnum = 'BILL-0000000000000001', 
          voidnum = 'VOID-0000000000000001', 
          billdocnum = 'BLN-0000000000001', 
          ordercde = 'ORD-0000000000001', 
          rddocnum = 'RD-0000000000000', 
          rsdocnum = 'RS-0000000000000', 
          tidocnum = 'TI-0000000000000', 
          todocnum = 'TO-0000000000000', 
          wsdocnum = 'WS-0000000000000', 
          pcdocnum = 'PC-0000000000000', 
          refnum = 'REF-0000000000000001';

    `).then((result) => {

      cy.log('Update successful:', result)

    })

  })
  
it("Cash In" , () => {

  cy.get(':nth-child(2) > .sc-beySPh').click()
  cy.contains("Cash Fund").should('be.enabled').click()
    cy.get('.my-4 > :nth-child(2) > :nth-child(2) > .font-montserrat').click().wait(500)
    for (let i = 0; i < 3; i++){
      cy.get(':nth-child(4) > :nth-child(2) > .font-montserrat').click()
    }
    cy.contains('Save').click()
    cy.contains('Transaction Success').should('have.text',"Transaction Success").wait(1000)

    cy.get('.ps-10 > .flex').click()

})


  it("1 Pax with Regular Transaction and Service Charge", () => {
    cy.get(":nth-child(3) > .sc-beySPh").click().wait(2000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();
    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000);
    cy.contains("Food").click().wait(2000);
    cy.contains("Chicken").click().wait(2000);
    cy.contains("1-pc Chickenjoy").click().wait(2000);

    const ST = 76;
    const SC_Formula = (ST / 1.12) * 0.1;
    const T1_SCharge = Number(SC_Formula.toFixed(2)); //6.79
    const GT = Number(ST + T1_SCharge);

    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T1_SCharge);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", GT);

    cy.get(":nth-child(13) > .bg-green-100").click();
    cy.get(".px-8").should("have.text", "Payment");
    cy.get(".overflow-hidden > span").should("have.text", "₱82.79");
    cy.contains("CASH").click();

    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + T1_SCharge
    );
    cy.get("#customerName").click().type("Edith");
    cy.get(".border-blue-500").click();

    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
  });

  it("1 Pax with 10% discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000);
    cy.contains("Food").click().wait(2000);
    cy.contains("Chicken").click().wait(2000);
    cy.contains("1pc Chickenjoy w Fries Meal").click().wait(2000);
    cy.contains("1pc Chickenjoy w Jolly Spaghetti").click().wait(2000);

    cy.contains("Add Discount").click();
    cy.get(".px-8").should("have.text", "Add discount");
    cy.get("#discde").select("10%");
    cy.get("#orderitmid").click();
    cy.get(".border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex").should(
      "have.text",
      "Discount : 10%"
    );
    cy.get(":nth-child(4) > .MuiTableCell-root > .flex").should(
      "have.text",
      "Discount : 10%"
    );

    const ST = 204;
    const SC_Formula = (ST / 1.12) * 0.1;
    const T2_SCharge = Number(SC_Formula.toFixed(2)); //18.21
    const Disc_Formula = ST * 0.1;
    const Discount = Disc_Formula.toFixed(2); //20.40
    const GT = Number(ST - Discount);
    const total = Number(GT + T2_SCharge);

    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T2_SCharge);
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total);

    cy.get(":nth-child(13) > .bg-green-100").click();
    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Debong");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
  });

  it("1 Pax with 20% discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Breakfast").click().wait(1000);
    cy.contains("BF Hotdog").click().wait(1000);
    cy.contains("BF Breakfast Steak").click().wait(1000);
    cy.contains("BF Beef Tapa").click().wait(1000);

    cy.get(":nth-child(5) > .bg-green-100").click();
    cy.get(".px-8").should("have.text", "Add discount");
    cy.get("#discde").select("20%");
    cy.get("#orderitmid").click();
    cy.get(".border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : 20%"
    );
    cy.get(":nth-child(4) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : 20%"
    );
    cy.get(":nth-child(6) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : 20%"
    );

    const ST = 210;
    const SC_Formula = (ST / 1.12) * 0.1;
    const T3_SCharge = Number(SC_Formula.toFixed(2)); //18.75
    const Disc_Formula = ST * 0.2;
    const Discount = Disc_Formula.toFixed(2); //42.00
    const GT = Number(ST - Discount);
    const total = Number(GT + T3_SCharge);

    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T3_SCharge);
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total);

    cy.contains("Payment").click();
    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Edith ulit");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
  });

  it("1 Pax with Senior Discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Hotdog").click().wait(1000);
    cy.contains("Cheesy Classic Jolly Hotdog").click().wait(1000);
    cy.contains("Beverages").click().wait(1000);
    cy.contains("Floats").click().wait(1000);
    cy.contains("Coke").click().wait(1000);

    cy.get(":nth-child(5) > .bg-green-100").click();
    cy.get(".px-8").should("have.text", "Add discount");
    cy.get("#discde").select("Senior Citizen");
    cy.get("#orderitmid").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Karding");
    cy.get("#cardno").click().type("523634");
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Senior"
    );
    cy.get(":nth-child(4) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Senior"
    );

    const ST = 87;
    const Disc_Formula = Number(ST / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2); //42.00
    const LVA = (ST / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2));
    const SC_Formula = (ST / 1.12) * 0.1;
    const T4_SCharge = Number(SC_Formula.toFixed(2)); //7.77
    const SCharge_dsc = T4_SCharge * 0.2;
    const SCharge_dsc1 = Number(SCharge_dsc.toFixed(2));
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T4_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "87.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T4_SCharge);
    cy.get(":nth-child(5) > :nth-child(2)").should("have.text", SCharge_dsc1);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱87.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-" + Discount
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-" + LVA1
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + T4_SCharge
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
      "have.text",
      "SCharge Discount -" + SCharge_dsc1
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Debongggg");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
  });

  it("1 Pax with PWD Discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Burger Steak").click().wait(1000);
    cy.contains("2pc Burger Steak").click().wait(1000);
    cy.contains("Yumburger").click().wait(1000);
    cy.contains("Amazing Aloha Yumburger").click().wait(1000);

    cy.contains("Add Discount").click();
    cy.get("#discde").select("Person with Disability"); // SHOULD BE Disability
    cy.get("#orderitmid").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Tessa");
    cy.get("#cardno").click().type("87964");
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : PWD"
    );
    cy.get(":nth-child(4) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : PWD"
    );

    const ST = 222;
    const Disc_Formula = Number(ST / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2); //39.64
    const LVA = (ST / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2));
    const SC_Formula = (ST / 1.12) * 0.1;
    const T5_SCharge = Number(SC_Formula.toFixed(2)); //19.82
    const SCharge_dsc = T5_SCharge * 0.2;
    const SCharge_dsc1 = Number(SCharge_dsc.toFixed(2));
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T5_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "222.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T5_SCharge);
    cy.get(":nth-child(5) > :nth-child(2)").should("have.text", SCharge_dsc1);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱222.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-" + Discount
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-" + LVA1
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + T5_SCharge
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
      "have.text",
      "SCharge Discount -" + SCharge_dsc1
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Marlooonnn");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.wait(5000);
  });

  it("1 Pax with Athlete Discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Hotdog").click().wait(1000);
    cy.contains("Regular Jolly Hotdog").click().wait(1000);
    cy.contains("Yumburger").click().wait(1000);
    cy.get(':nth-child(2) > .sc-csKJxZ > .sc-eTNRI').click().wait(1000);

    cy.contains("Add Discount").click();
    cy.get("#discde").select("Athlete");
    cy.get("#orderitmid").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Mary");
    cy.get("#cardno").click().type("997675");
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Athlete"
    );
    cy.get(":nth-child(4) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Athlete"
    );

    const ST = 96;
    const Disc_Formula = Number(ST / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2); //17.14
    const SC_Formula = (ST / 1.12) * 0.1;
    const T6_SCharge = Number(SC_Formula.toFixed(2)); //19.82
    const SCharge_dsc = T6_SCharge * 0.2;
    const SCharge_dsc1 = Number(SCharge_dsc.toFixed(2));
    const GT = Number(ST - Discount);
    const total = Number(GT + T6_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "96.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "0.00"
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T6_SCharge);
    cy.get(":nth-child(5) > :nth-child(2)").should("have.text", SCharge_dsc1);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", "85.71");

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱96.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-" + Discount
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-0.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + T6_SCharge
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
      "have.text",
      "SCharge Discount -" + SCharge_dsc1
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱85.71");

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Reneeee");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.wait(5000);
  });

  it("1 Pax with Medal of Valor Discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Burger Steak").click().wait(1000);
    cy.contains("1pc Burger Steak w 3pcs Shanghai").click().wait(1000);

    cy.contains("Add Discount").click();
    cy.get("#discde").select("MOV");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Winter");
    cy.get("#cardno").click().type("89745467");

    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : MOV"
    );

    const ST = 109;
    const Disc_Formula = Number(ST * 0.2);
    const Discount = Disc_Formula.toFixed(2); //21.80
    const SC_Formula = (ST / 1.12) * 0.1;
    const T7_SCharge = Number(SC_Formula.toFixed(2)); //9.73
    const GT = Number(ST - Discount);
    const total = Number(GT + T7_SCharge);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "109.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "0.00"
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T7_SCharge);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱109.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-" + Discount
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-0.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + T7_SCharge
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Jeromeeeee");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.wait(5000);
  });

  it("1 Pax with Diplomat Discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Super Meals").click().wait(1000);
    cy.contains(
      "Chickenjoy, Burger Steak, Half Jolly Spaghetti, Rice and Drink"
    )
      .click()
      .wait(1000);
    cy.contains("Add Discount").click();

    cy.get("#discde").select("Diplomat");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Karina");
    cy.get("#cardno").click().type("678656");
    
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();

    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Diplomat"
    );
    const ST = 150;
    const Discount = 0;
    const LVA = (ST / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2)); //16.07
    const SC_Formula = (ST / 1.12) * 0.1;
    const T8_SCharge = Number(SC_Formula.toFixed(2)); //13.39
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T8_SCharge);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "150.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "0.00"
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T8_SCharge);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱150.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-0.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-" + LVA1
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + T8_SCharge
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Kaaarrrllll");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
  });

  it("1 Pax with MEMC Senior Discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Takeout").wait(2000);
    cy.get("#warcde").select("Jollibee 2").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Family Super Meals").click().wait(1000);
    cy.contains(
      "FSM A 6-pcs Chickenjoy Bucket"
    )
      .click()
      .wait(1000);

    cy.contains("Add Discount").click();
    cy.get("#discde").select("Senior");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Giselle");
    cy.get("#cardno").click().type("3423456");

    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();
    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Senior"
    );

    const ST = 599;
    const Disc_Formula = Number(100 / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2); //17.86
    const LVA = (100 / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2));
    const SC_Formula = (ST / 1.12) * 0.1;
    const T9_SCharge = Number(SC_Formula.toFixed(2)); //53.48
    const SCharge_dsc = T9_SCharge * 0.2;
    const SCharge_dsc1 = SCharge_dsc.toFixed(2);
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T9_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "599.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T9_SCharge);
    cy.get(":nth-child(5) > :nth-child(2)").should("have.text", SCharge_dsc1);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱599.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-" + Discount
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-" + LVA1
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + T9_SCharge
    );

    cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
      "have.text",
      "SCharge Discount -" + SCharge_dsc1
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Ediiithhhhhhhhh");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.wait(5000);
  });

  it("1 Pax with MEMC PWD Discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Takeout").wait(2000);
    cy.get("#warcde").select("Jollibee 2").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Family Super Meals").click().wait(1000);
    cy.contains(
      "FSM A 8-pcs Chickenjoy Bucket"
    )
      .click()
      .wait(1000);

    cy.contains("Add Discount").click();
    cy.get("#discde").select("Person with Disability");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Ariana Grande");
    cy.get("#cardno").click().type("464345");
   
    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();
    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : PWD"
    );

    const ST = 799;
    const Disc_Formula = Number(200 / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2); //35.71
    const LVA = (200 / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2));
    const SC_Formula = (ST / 1.12) * 0.1;
    const T10_SCharge = Number(SC_Formula.toFixed(2)); //71.34
    const SCharge_dsc = T10_SCharge * 0.2;
    const SCharge_dsc1 = SCharge_dsc.toFixed(2);
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T10_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "799.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T10_SCharge);
    cy.get(":nth-child(5) > :nth-child(2)").should("have.text", SCharge_dsc1);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱799.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-" + Discount
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-" + LVA1
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + T10_SCharge
    );

    cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
      "have.text",
      "SCharge Discount -" + SCharge_dsc1
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Ariana G");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
  });

  it("1 Pax with MEMC Senior Discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Chicken").click().wait(1000);
    cy.contains("Chickenjoy Bucket 6pcs").click();

    cy.contains("Add Discount").click();
    cy.get("#discde").select("Senior");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Jessie J");
    cy.get("#cardno").click().type("3452435");

    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();
    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : Senior"
    );

    const ST = 399;
    const Disc_Formula = Number(ST / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2); //71.25
    const LVA = (ST / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2));
    const SC_Formula = (ST / 1.12) * 0.1;
    const T11_SCharge = Number(SC_Formula.toFixed(3)); //35.625
    const SCharge_dsc = T11_SCharge * 0.2;
    const SCharge_dsc1 = SCharge_dsc.toFixed(2);
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T11_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "399.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should(
      "have.text",
      Math.round(T11_SCharge * 100) / 100
    );
    cy.get(":nth-child(5) > :nth-child(2)").should(
      "have.text",
      Math.round(SCharge_dsc1 * 100) / 100
    );
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1 + "0");

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱399.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-" + Discount
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-" + LVA1
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + Math.round(T11_SCharge * 100) / 100
    );

    cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
      "have.text",
      "SCharge Discount -" + Math.round(SCharge_dsc1 * 100) / 100
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1 + "0");

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Ariana G");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.wait(5000);
  });

  it("1 Pax with MEMC PWD Discount and Service Charge", () => {
    cy.wait(5000);
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-in").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();

    cy.contains("Food").click().wait(1000);
    cy.contains("Chicken").click().wait(1000);
    cy.contains("Chickenjoy Bucket 8pcs").click();

    cy.contains("Add Discount").click();
    cy.get("#discde").select("Person with Disability");
    cy.get("#orderitmid0").click();
    cy.get(".border-blue-500").click();

    cy.get("#cardholder").click().type("Nicky Minaj");
    cy.get("#cardno").click().type("98756790");

    cy.get("#discountUser > .flex-col > #buttons > .border-blue-500").click();
    cy.get(":nth-child(2) > .MuiTableCell-root > .flex > .ml-10").should(
      "have.text",
      "Discount : PWD"
    );

    const ST = 499;
    const Disc_Formula = Number(ST / 1.12) * 0.2;
    const Discount = Disc_Formula.toFixed(2); //89.11
    const LVA = (ST / 1.12) * 0.12;
    const LVA1 = Number(LVA.toFixed(2));
    const SC_Formula = (ST / 1.12) * 0.1;
    const T12_SCharge = Number(SC_Formula.toFixed(2)); //44.55
    const SCharge_dsc = T12_SCharge * 0.2;
    const SCharge_dsc1 = SCharge_dsc.toFixed(2);
    const GT = Number(ST - Discount - LVA1);
    const total = Number(GT + T12_SCharge - SCharge_dsc1);
    const total1 = Number(total.toFixed(2));

    cy.get(".bg-black > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "499.00"
    );
    cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      Discount
    );
    cy.get(".bg-black > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      LVA1
    );
    cy.get(":nth-child(4) > :nth-child(2)").should("have.text", T12_SCharge);
    cy.get(":nth-child(5) > :nth-child(2)").should("have.text", SCharge_dsc1);
    cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

    cy.contains("Payment").click();
    cy.get(".ml-5 > :nth-child(2) > :nth-child(1) > :nth-child(2)").should(
      "have.text",
      "₱499.00"
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(2) > :nth-child(2)").should(
      "have.text",
      "-" + Discount
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(3) > :nth-child(2)").should(
      "have.text",
      "-" + LVA1
    );
    cy.get(".ml-5 > :nth-child(2) > :nth-child(4)").should(
      "have.text",
      "Service Charge " + T12_SCharge
    );

    cy.get(".ml-5 > :nth-child(2) > :nth-child(5)").should(
      "have.text",
      "SCharge Discount -" + SCharge_dsc1
    );
    cy.get(".text-red > :nth-child(2)").should("have.text", "₱" + total1);

    cy.contains("CASH").click();
    cy.get("#customerName").click().type("Ariana G");
    cy.get(".border-blue-500").click();
    cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
    cy.contains("Transaction Complete.").should(
      "have.text",
      "Transaction Complete."
    );
    cy.wait(5000);
  });
});
