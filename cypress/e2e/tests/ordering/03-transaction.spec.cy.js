let assertionResults = [];
let failureMessages = [];

describe("Transaction 1", () => {
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
    cy.task("queryDb","TRUNCATE TABLE posorderingfile")

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

  it("Refresh Database", () => { 

    cy.get(':nth-child(1) > .sc-blHHSb').click()
    cy.get('.bg-white > .flex').click()
    cy.wait(5000)

  })

  it("Cash In" , () => {

    cy.get(':nth-child(2) > .sc-blHHSb').click().wait(2000)
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
      cy.get(':nth-child(3) > .sc-blHHSb').click().wait(2000).wait(2000);
      cy.get(".px-8").should("have.text", "Add new transaction").wait(2000);
      cy.get("#postypcde").select("Dine-In").wait(2000);
      cy.get("#warcde").select("Jollibee 1").wait(2000);
      cy.contains("Proceed").click();
      cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000);
      cy.contains("Food").click().wait(2000);
      cy.contains(/^Chicken$/).click().wait(2000)
      cy.contains(/^1-pc Chickenjoy$/).click().wait(2000);

      cy.fixture('ordering-scenarios.json').then((data) => {
    
            const ST = data[0].subtotal 
            const T1_Scharge = data[0].serviceCharge
            const ServiceCharge1 = Number(T1_Scharge.toFixed(2))
            const total = data[0].total
            const total1 = total.toFixed(2)

        cy.get('.bg-black > :nth-child(1) > :nth-child(2)').should("have.text", ST + ".00");
        cy.get(":nth-child(4) > :nth-child(2)").should("have.text", ServiceCharge1);
        cy.get(".font-extrabold > :nth-child(2)").should("have.text", total1);

      })
  
      cy.get(":nth-child(13) > .bg-green-100").click();
      cy.get(".px-8").should("have.text", "Payment");
      cy.get(".overflow-hidden > span").should("have.text", "₱82.79");
      cy.contains("CASH").click();

      cy.get("#customerName").click().type("Edith");
      cy.get(".border-green-500").click();
  
      cy.get(".my-5 > .grid > :nth-child(1) > .text-green-700").click();
      cy.contains("Transaction Complete.").should(
        "have.text",
        "Transaction Complete."
      );
      cy.get('.ant-modal-close').click()

      cy.wait(5000)
    });

})