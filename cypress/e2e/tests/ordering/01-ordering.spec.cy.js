let assertionResults = []
let failureMessages = []

describe("Ordering ", () => {
  beforeEach(() => {
    cy.wait(6000)
    // reset for each test case
    assertionResults = []
    failureMessages = []


    cy.login("lstv", "lstventures")



  })

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
          refnum = 'REF-0000000000000001'

    `).then((result) => {

      cy.log('Update successful:', result)

    })
  })

  it("Cash In" , () => {
    cy.wait(6000)

    cy.get(':nth-child(2) > .sc-blHHSb').click()
    cy.contains("Cash Fund").should('be.enabled').click()
      cy.get('.my-4 > :nth-child(2) > :nth-child(2) > .font-montserrat').click().wait(500)
      for (let i = 0; i < 3; i++){
        cy.get(':nth-child(4) > :nth-child(2) > .font-montserrat').click()
      }
      cy.contains('Save').click()
      cy.contains('Transaction Success').should('have.text',"Transaction Success").wait(1000)
  
      cy.get('.ps-10 > .flex').click()
  })

  it("Select Pricelist Modal ", () => {
    cy.wait(6000)
    cy.get(':nth-child(3) > .sc-blHHSb').click().wait(2000)
    cy.get(".px-8").should("have.text", "Add new transaction").wait(2000)
    cy.get("#postypcde").select("Dine-In").wait(2000)
    cy.get("#warcde").select("Jollibee 1").wait(2000)
    cy.contains("Proceed").click()
    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000)
    cy.contains("Food").click().wait(2000)
    cy.contains(/^Chicken$/).click().wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click().wait(2000)
  })

  it("Remove Button ", () => {
    cy.wait(6000)
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(2)")
      .click()
      .wait(1500)
    cy.get(":nth-child(1) > .bg-red-100").click().wait(2000)
  })

  it("Change Qty", () => {
    cy.wait(6000)
    cy.contains("Food").click().wait(2000)
    cy.contains(/^Chicken$/).click().wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click().wait(2000)

    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(2)").click()
    cy.get(":nth-child(2) > .bg-green-100").click()

    cy.get(".px-8").should("have.text", "Change Quantity").wait(2000)
    cy.get("#itmqty").click().type("2").wait(2000)
    cy.get("#button-form-2").click().wait(2000)
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(2)")
      .should("have.text", "12")
      .wait(2000)

    cy.get(":nth-child(1) > .bg-red-100").click().wait(2000)
  })

  it("Change Ordertype type", () => {
    cy.wait(6000)
    cy.contains("Food").click().wait(2000)
    cy.contains(/^Chicken$/).click().wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click().wait(2000)
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(2)")
      .click()
      .wait(1000)
    cy.get(":nth-child(3) > .bg-green-100").click()
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(4)")
      .should("have.text", "T")
      .wait(2000)
  })

  it("Special Request", () => {
    cy.wait(6000)
    cy.get(":nth-child(4) > .bg-green-100").click().wait(2000)
    cy.get(".px-8").should("have.text", "Add Special Request(s)")
    cy.get("#takeOut").click().type("Leg Part").wait(2000)
    cy.contains("Update").click().wait(2000)
    cy.get(".MuiTableCell-root > .flex")
      .should("have.text", "SPECIAL REQUEST : Leg Part")
      .wait(2000)

    cy.get(":nth-child(1) > .bg-red-100").click().wait(2000)
  })

  it("Adding Discount", () => {
    cy.wait(6000)
    cy.contains("Food").click().wait(2000)
    cy.contains(/^Chicken$/).click().wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click().wait(2000)
    cy.get(":nth-child(5) > .bg-green-100").click().wait(2000)
    cy.get(".px-8").should("have.text", "Add discount")
    cy.get("#discde").select("Senior").wait(2000)
    cy.get("#orderitmid0").click()
    cy.contains("Update").click().wait(2000)

    cy.get("#cardholder").click().type("Nova")
    cy.get("#cardno").click().type("543219876")
    cy.get('#discountUser > #button-form-div-1 > #button-form-div-2 > #button-form-2').click()
    cy.get(".ml-10").should("have.text", "Discount : Senior").wait(2000)
    // cy.get(".bg-black > :nth-child(2) > :nth-child(2)").should(
    //   "have.text",
    //   "35.00"
    // )
    cy.checkText('.bg-black > :nth-child(2) > :nth-child(2)', '0', 'Upon clicking "Update" button in "Adding Discount":', '13.57', assertionResults, failureMessages)
    cy.checkForFailure(assertionResults, failureMessages)
  })

  it("Discount Behavior with Remove Item Button", () => {
    cy.wait(6000)
    cy.get(".MuiTableBody-root > :nth-child(1) > :nth-child(3)").click()
    cy.get(":nth-child(1) > .bg-red-100").click()
 /*    cy.get(".Toastify__toast-body")
      .should("have.text", "Error : Remove discount first.")
      .click()
      .wait(2000) */
    cy.checkToastifyVisibility('.Toastify__toast-body', '6969', 'Check if the toast will appear', 'Error : Remove discount first.', assertionResults, failureMessages)
  })

  it("Discount Behavior with Change Quantity Button", () => {
    cy.wait(6000)
/*     cy.get(":nth-child(2) > .bg-green-100").click()
    cy.get(".Toastify__toast-body")
      .should("have.text", "Error : Remove discount first.")
      .click()
      .wait(2000) */
      cy.checkToastifyVisibility('.Toastify__toast-body', '6969', 'Check if the toast will appear', 'Error : Remove discount first.', assertionResults, failureMessages)      
  })

  it("Discount Behavior with Change Ordertype Button", () => {
    cy.wait(6000)
    cy.get(":nth-child(3) > .bg-green-100").click()
/*     cy.get(".Toastify__toast-body")
      .should("have.text", "Error : Remove discount first.")
      .click()
      .wait(2000) */
      cy.checkToastifyVisibility('.Toastify__toast-body', '6969', 'Check if the toast will appear', 'Error : Remove discount first.', assertionResults, failureMessages)
  })

  it("Discount Behavior with Free Item Button", () => {
    cy.wait(6000)
    cy.get(":nth-child(6) > .bg-green-100").click()
    cy.get(".Toastify__toast-body")
      .should("have.text", "Error : Remove discount first.")
      .click()
      .wait(2000)
    cy.get(".flex > .MuiButtonBase-root").click()
    cy.get(".MuiTableBody-root > :nth-child(1) > :nth-child(3)").click()
  })

  it("Free Item ", () => {
    cy.wait(6000)
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(3)").click()
    cy.get(":nth-child(6) > .bg-green-100").click()
    cy.get(".px-8").should("have.text", "Free item")
    cy.get(".me-1").click()
    cy.get("#textreason").click().type("Free Reason")
    cy.contains("Confirm").click()

    cy.get(".css-1clo5mp-MuiTableRow-root > :nth-child(5)").should(
      "have.text",
      "0.00"
    )
    cy.get(":nth-child(1) > .bg-red-100").click().wait(2000)
  })

  it("Price Override ", () => {
    cy.wait(6000)
    cy.contains("Food").click().wait(2000)
    cy.contains(/^Chicken$/).click().wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click().wait(2000)
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(3)")
      .click()
      .wait(2000)
    cy.get(":nth-child(7) > .bg-green-100").click()
    cy.get(".px-8").should("have.text", "Price Override")
    cy.get('#input-number-div-3 > .undefined').click().clear().type("120")
    cy.contains("Confirm").click()

    cy.get(".MuiTableCell-root > .flex").should("have.text", "Price Override")
    cy.get(".css-1clo5mp-MuiTableRow-root > :nth-child(5)")
      .should("have.text", "120.00")
      .wait(2000)
  })

  it("Discount with price override", () => {
    cy.wait(6000)
    cy.get(".MuiButtonBase-root").click()
    cy.get(":nth-child(5) > .bg-green-100").click()
    cy.get("#discde").select("Senior")
    cy.get("#orderitmid0").click()
    cy.contains("Update").click()

    cy.get("#cardholder").click().type("Nova2")
    cy.get("#cardno").click().type("543219876")
    cy.get('#discountUser > #button-form-div-1 > #button-form-div-2 > #button-form-2').click()

    cy.wait(6000)

    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click()
    cy.get(":nth-child(7) > .bg-green-100").click()
/*     cy.get(".Toastify__toast-body")
      .should("have.text", "Error : Remove discount first.")
      .wait(2000) */
    cy.checkToastifyVisibility('.Toastify__toast-body', '6969', 'Check if the toast will appear', 'Error : Remove discount first.', assertionResults, failureMessages)  
    cy.get(".flex > .MuiButtonBase-root").click()
  })

  it("Add On Item", () => {
    cy.wait(6000)
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(3)").click()
    cy.get(".grid > :nth-child(8)").click().wait(2000)
    cy.get(".px-8").should("have.text", "Add on")
    cy.get("#isaddon").click()
    cy.get('#button-form-2').click()
    cy.get(".ml-10").should("have.text", "Add on : Coke")
  })

  it("Cancel Transaction", () => {
    cy.wait(6000)
    cy.get(".grid > :nth-child(9)").click()
    cy.get(".px-8").should("have.text", "Confirmation")
    cy.get("#button-form-2").click()
  })


  it("Payment" , () => {
    cy.wait(6000) 

    cy.contains("Food").click().wait(2000)
    cy.contains(/^Chicken$/).click().wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click().wait(2000)

    cy.get(':nth-child(13) > .bg-green-100').click()
    cy.get('.px-8').should("have.text", "Payment")
    cy.contains("CASH").click()
    cy.get('.shadow-lg > .px-8 > .flex > h1').should("have.text", "PaymentCASH Payment")
    cy.get('#button-form-2').click()
    cy.get('.my-5 > .grid > :nth-child(1)').click()
    cy.contains("Transaction Complete.").should("have.text" , "Transaction Complete.")
    cy.get('.ant-modal-close').click()

  })

  it("Other Transaction - HOLD" , () => {
    cy.wait(6000) 
  
    cy.contains("Food").click().wait(2000)
    cy.contains(/^Chicken$/).click().wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click().wait(2000)

    cy.contains('Other Transaction').click()
  
    cy.get('.px-8').should("have.text" , "Other Transaction")
    cy.contains("Hold Transaction").click()
   })


})
