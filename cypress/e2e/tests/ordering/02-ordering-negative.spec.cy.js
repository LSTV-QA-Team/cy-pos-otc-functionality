let assertionResults = [];
let failureMessages = [];

describe.only("Ordering ", () => {
  before(() => {
    cy.task("queryDb","TRUNCATE TABLE forftpfile;")
    cy.task("queryDb","TRUNCATE TABLE posfile;")
    cy.task("queryDb","TRUNCATE TABLE posorderingfile;")
    cy.task("queryDb","TRUNCATE TABLE orderfile;")
    cy.task("queryDb","TRUNCATE TABLE orderfile2;")
    cy.task("queryDb","TRUNCATE TABLE tabletranfile;")
    cy.task("queryDb","TRUNCATE TABLE tabletranfile2;")
    cy.task("queryDb","TRUNCATE TABLE takeouttranfile;")
    cy.task("queryDb","TRUNCATE TABLE billingfile;")
    cy.task("queryDb","TRUNCATE TABLE voidrequestfile;")
    cy.task("queryDb","TRUNCATE TABLE orderitemdiscountfile;")
    cy.task("queryDb","TRUNCATE TABLE orderdiscountfile;")
    cy.task("queryDb","TRUNCATE TABLE orderitemmodifierfile;")
    cy.task("queryDb","TRUNCATE TABLE useractivitylogfile;")
    cy.task("queryDb","TRUNCATE TABLE zreadingfile;")
    cy.task("queryDb","UPDATE syspar SET ordocnum = 'OR-0000000000000001', posdocnum = 'POS-0000000000000001', seqnum = 'SEQ-0000000000000001', billnum = 'BILL-0000000000000001', voidnum = 'VOID-0000000000000001', billdocnum = 'BLN-0000000000001',ordercde = 'ORD-0000000000001', rddocnum = 'RD-0000000000001', rsdocnum = 'RS-0000000000001', tidocnum = 'TI-0000000000001', todocnum = 'TO-0000000000001', wsdocnum = 'WS-0000000000001', pcdocnum = 'PC-0000000000001', refnum = 'REF-0000000000000001';")
describe.only("Ordering ", () => {
  before(() => {
    cy.task("queryDb","TRUNCATE TABLE forftpfile;")
    cy.task("queryDb","TRUNCATE TABLE posfile;")
    cy.task("queryDb","TRUNCATE TABLE posorderingfile;")
    cy.task("queryDb","TRUNCATE TABLE orderfile;")
    cy.task("queryDb","TRUNCATE TABLE orderfile2;")
    cy.task("queryDb","TRUNCATE TABLE tabletranfile;")
    cy.task("queryDb","TRUNCATE TABLE tabletranfile2;")
    cy.task("queryDb","TRUNCATE TABLE takeouttranfile;")
    cy.task("queryDb","TRUNCATE TABLE billingfile;")
    cy.task("queryDb","TRUNCATE TABLE voidrequestfile;")
    cy.task("queryDb","TRUNCATE TABLE orderitemdiscountfile;")
    cy.task("queryDb","TRUNCATE TABLE orderdiscountfile;")
    cy.task("queryDb","TRUNCATE TABLE orderitemmodifierfile;")
    cy.task("queryDb","TRUNCATE TABLE useractivitylogfile;")
    cy.task("queryDb","TRUNCATE TABLE zreadingfile;")
    cy.task("queryDb","UPDATE syspar SET ordocnum = 'OR-0000000000000001', posdocnum = 'POS-0000000000000001', seqnum = 'SEQ-0000000000000001', billnum = 'BILL-0000000000000001', voidnum = 'VOID-0000000000000001', billdocnum = 'BLN-0000000000001',ordercde = 'ORD-0000000000001', rddocnum = 'RD-0000000000001', rsdocnum = 'RS-0000000000001', tidocnum = 'TI-0000000000001', todocnum = 'TO-0000000000001', wsdocnum = 'WS-0000000000001', pcdocnum = 'PC-0000000000001', refnum = 'REF-0000000000000001';")

    // reset for each test case
    assertionResults = [];
    failureMessages = [];
    
    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("Cashiering Negative test", () => {
  // Select Cashiering
    cy.get(':nth-child(2) > .sc-blHHSb').click(); 

  //verify Header title
    cy.contains("Cash Management").should('be.visible')

  // Verify if the target button is disabled or no disable
  cy.get(':nth-child(1) > #cc-style').should('not.be.disabled'); // Cash Fund
    cy.get(':nth-child(2) > #cc-style').should('be.disabled'); // Cash In
    cy.get(':nth-child(3) > #cc-style').should('be.disabled'); // Cash Out
    cy.get(':nth-child(4) > #cc-style').should('be.disabled'); // Cash Declaration

  })
  it("Checking of Disable or Not Disable buttons in Ordering before punching", () => {
  // Disable the button after clicking another button
    cy.get('.sc-gtLWhw').click();
    
    cy.get('.bg-black\\/75 > [style="opacity: 1; transform: none;"] > .bg-white').should('be.visible'); // Checking if the Modal of Cash fund it's visible
    cy.get('.me-2').should('have.text', 'Cash Fund') 
    cy.get('.my-4 > :nth-child(1) > :nth-child(2) > .font-montserrat').click(); // 2
    cy.get('.overflow-hidden').should('be.visible', '₱2.00') //verify of value
    cy.get(':nth-child(4) > :nth-child(2) > .font-montserrat').click().click().click().click(); // 0 (4 times)
    cy.get('.overflow-hidden > span').should('have.text', '₱20,000.00') //verify of value
    cy.get('.border-green-500').click().wait(4000); // Save Icon

  // Verify if the target button is enabled
    cy.get('.sc-ivxoEo').should('not.be.enabled'); // Cash Fund
    cy.get(':nth-child(2) > .sc-gtLWhw').should('not.be.disabled'); // Cash In
    cy.get(':nth-child(3) > .sc-gtLWhw').should('not.be.disabled'); // Cash Out
    cy.get(':nth-child(4) > .sc-gtLWhw').should('not.be.disabled'); // Cash Declaration

  // Back to Home page
    cy.get('.ps-10 > .flex').click() //Back icon for Home

  })
  it("Checking of buttons in Ordering ", () => {

    cy.wait(6000);
    cy.get(':nth-child(3) > .sc-blHHSb').click().wait(2000) // Selecting Ordering
    cy.get(".px-8").should("have.text", "Add new transaction").wait(2000);
    cy.get("#postypcde").select("Dine-In").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.get('#button-form-2').click();

    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000)

  // Type of dine type before ordering (should be not disable)
    cy.get('.sc-dntaoT').should('have.text', 'Type : Dine-In | Pricelist : Jollibee 1');
    cy.get('.sc-dntaoT').should('be.not.disabled');
  // Checking if the Whole ordering UI is correct Disable/not buttons.
    cy.get(':nth-child(1) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Remove Item
    cy.get(':nth-child(2) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Change Quantity
    cy.get(':nth-child(3) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Change Order
    cy.get(':nth-child(4) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // change order type
    cy.get(':nth-child(5) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Special Request
    cy.get(':nth-child(6) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Add Discount
    cy.get(':nth-child(7) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Free Item
    cy.get(':nth-child(8) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Price Override
    cy.get(':nth-child(9) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Cancel Transaction
    cy.get(':nth-child(10) > .bg-green-100').should('not.be.disabled');               // Reprint Transaction
    cy.get(':nth-child(11) > .bg-green-100').should('not.be.disabled');               // Reprint Void
    cy.get(':nth-child(12) > .bg-green-100').should('not.be.disabled');               // Reprint Refund
    cy.get(':nth-child(13) > .bg-gray-100').should('not.be.enabled');                 // Payment
    cy.get(':nth-child(14) > .bg-orange-100').should('not.be.disabled');              // Void Transaction
    cy.get(':nth-child(15) > .bg-orange-100').should('not.be.disabled');              // Refund Transaction
    cy.get(':nth-child(16) > .bg-green-100').should('not.be.disabled');               // Other Transaction

    cy.checkForFailure(assertionResults, failureMessages)
  });
  it("selecting Items", () => {
    // Select Item
    cy.contains(/^Food$/).click()
    cy.wait(2000)
    cy.contains(/^Chicken$/).click()
    cy.wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click()
    cy.wait(2000)
    cy.get('.Toastify__toast-body').click()
    .wait(1000)

  })

  it("After selecting item in ordering checking of availability of buttons", () => {

  // Checking if the Whole ordering UI is correct Disable/not buttons.
    cy.get(':nth-child(1) > .bg-red-100 > .text-red-700').should('not.be.disabled');     // Remove Item
    cy.get(':nth-child(2) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Change Quantity
    cy.get(':nth-child(3) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Change Order
    cy.get(':nth-child(4) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // change order type
    cy.get(':nth-child(5) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Special Request
    cy.get(':nth-child(6) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Add Discount
    cy.get(':nth-child(7) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Free Item
    cy.get(':nth-child(8) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Price Override
    cy.get(':nth-child(9) > .bg-red-100 > .text-red-700').should('not.be.disabled');     // Cancel Transaction
    cy.get(':nth-child(10) > .bg-gray-100').should('not.be.enabled');                    // Reprint Transaction
    cy.get(':nth-child(11) > .bg-gray-100').should('not.be.enabled');                    // Reprint Void
    cy.get(':nth-child(12) > .bg-gray-100').should('not.be.enabled');                    // Reprint Refund
    cy.get(':nth-child(13) > .bg-green-100').should('not.be.disabled');                  // Payment
    cy.get(':nth-child(14) > .bg-gray-100').should('not.be.enabled');                    // Void Transaction
    cy.get(':nth-child(15) > .bg-gray-100').should('not.be.enabled');                    // Refund Transaction
    cy.get(':nth-child(16) > .bg-green-100').should('not.be.disabled');                  // Other Transaction

    cy.checkForFailure(assertionResults, failureMessages)
  })
  it("selecting Items", () => {
    // Select Item
    cy.contains(/^Food$/).click()
    cy.wait(2000)
    cy.contains(/^Chicken$/).click()
    cy.wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click()
    cy.wait(2000)
    cy.get('.Toastify__toast-body').click()
    .wait(1000)

  })

  it("After selecting item in ordering checking of availability of buttons", () => {

  // Checking if the Whole ordering UI is correct Disable/not buttons.
    cy.get(':nth-child(1) > .bg-red-100 > .text-red-700').should('not.be.disabled');     // Remove Item
    cy.get(':nth-child(2) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Change Quantity
    cy.get(':nth-child(3) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Change Order
    cy.get(':nth-child(4) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // change order type
    cy.get(':nth-child(5) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Special Request
    cy.get(':nth-child(6) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Add Discount
    cy.get(':nth-child(7) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Free Item
    cy.get(':nth-child(8) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Price Override
    cy.get(':nth-child(9) > .bg-red-100 > .text-red-700').should('not.be.disabled');     // Cancel Transaction
    cy.get(':nth-child(10) > .bg-gray-100').should('not.be.enabled');                    // Reprint Transaction
    cy.get(':nth-child(11) > .bg-gray-100').should('not.be.enabled');                    // Reprint Void
    cy.get(':nth-child(12) > .bg-gray-100').should('not.be.enabled');                    // Reprint Refund
    cy.get(':nth-child(13) > .bg-green-100').should('not.be.disabled');                  // Payment
    cy.get(':nth-child(14) > .bg-gray-100').should('not.be.enabled');                    // Void Transaction
    cy.get(':nth-child(15) > .bg-gray-100').should('not.be.enabled');                    // Refund Transaction
    cy.get(':nth-child(16) > .bg-green-100').should('not.be.disabled');                  // Other Transaction

    cy.checkForFailure(assertionResults, failureMessages)
  })

  // Remove Item (Negative Testing)
  it("Remove Button Negative ", () => {
    cy.get(':nth-child(1) > .bg-red-100').click().wait(1000)
    cy.get('.Toastify__toast-body')
    .should("have.text", "Error : Select item first.").wait(1000)
    cy.get('.Toastify__toast-body').click().wait(1000)
  });

  // Change Quantiy (Negative Testing)
  it("Change Qty Negative", () => {
    cy.get(':nth-child(2) > .bg-green-100').click().wait(1000) 
    cy.get('.Toastify__toast-body')
    .should("have.text", "Error : Select item first.").wait(2000).click()
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)')
    .should("have.text", "1-pc Chickenjoy").wait(2000)
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)')
    .click().wait(2000)
    cy.contains('Change Quantity').click().wait(2000)

    //Validation of Change Quantity Modal
    cy.get('.px-8').should('exist').wait(4000)
    cy.get('.px-8').should('have.text', 'Change Quantity').wait(2000)
    cy.get('.py-3 > .mb-2').should('have.text', 'Set Quantity').wait(2000)
    cy.get('#itmqty').should('have.value', '1').wait(2000)

    //Input Data
    cy.get('#itmqty').click().type("ABCDE").wait(500)
    cy.get('#itmqty').should('have.value', '1')
    cy.get('#itmqty').click().type("-+=/.,<>!@#$%^&*():[]'")
    cy.get('#itmqty').should('have.value', '1')
    cy.get('.px-8 > .flex > .anticon > svg').click()

  });
  
  // Change Order Type (Negative Testing)
  it("Change Ordertype type", () => {
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click().wait(500)
    cy.get(':nth-child(3) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body')
    .should("have.text", "Error : Select item first.").wait(500)
    cy.get('.Toastify__toast-body').click()

    cy.wait(1000)

    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click();
    cy.get(':nth-child(3) > .bg-green-100').click().wait(500)
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)')
    .should('have.text', 'T')
    cy.get('.Toastify__toast-body').should('have.text', 'Order Type Changed.').click()
    cy.get('.Toastify__toast-body').should('have.text', 'Order Type Changed.').click()
    cy.get(':nth-child(3) > .bg-green-100').click().wait(500)
  });
  


  it("Change Ordertype type > 1 Quantity", () => {

       //Remarks: Manual working properly but in cypress takes the condition not roperly work the system condition.
   // cy.get('#itmqty').click().type('{downArrow}').wait(2000)
   // cy.get('#itmqty').should('have.value', '1')
   // cy.get('#itmqty').clear()

   cy.get(':nth-child(2) > .bg-green-100').click().wait(2000) 
   cy.get('#itmqty').type('0',{force:true}).wait(2000)
  //  cy.get('#itmqty').should('have.value', '1').wait(2000)
   cy.checkValue('#itmqty', '0', 'Upon clicking the Confirm:', '10', assertionResults, failureMessages) 
   cy.get('#button-form-2').click({force:true}).wait(1000)
   cy.get('.px-8').should('not.exist').wait(1000)
   cy.get('.Toastify__toast-body')
   .should("have.text", "Item Quantity Changed.").wait(500)
   cy.get('.Toastify__toast-body').click().wait(2000)
   //Validation
   cy.checkText('.MuiTableBody-root > .MuiTableRow-root > :nth-child(2)', '0', 'Upon clicking the Confirm:', '10', assertionResults, failureMessages) 
   cy.checkText('.MuiTableBody-root > .MuiTableRow-root > :nth-child(5)', '0', 'Upon clicking the Confirm:', '760.00', assertionResults, failureMessages) 

   cy.checkForFailure(assertionResults, failureMessages)
 });

  // //CHANGE ORDERTYPE 2 OR MORE QUNATITIES IN ITEM
  it("Change Ordertype type 2 or more quantities", () => {
    cy.wait(1000)
    cy.contains('Change Order Type').click({force:true})

    cy.wait(4000)

    //MODAL OPEN (IF THE ITEM IS GREATER THEN 1 QUANTITY)
    cy.get('.px-8').should('be.visible').wait(500)

    //Modal Validation
          //ERROR DUE TO CHANGE QUANTITY IS NOT WORKING PROPERLY IN CYPRESS
    cy.get('label').eq(0).should('have.text', 'Set Dine in quantity');
    cy.get(':nth-child(2) > .mb-2')
    .should('have.text', 'Set Take out quantity').wait(1000)

    //Negative Value Checker
    cy.get('#dineIn').click().type('{downArrow}').wait(2000)
    cy.get('#dineIn').should('have.value', '-1').wait(1000)
    cy.get('#takeOut').click().type('{downArrow}').wait(2000)
    cy.get('#takeOut').should('have.value', '-1').wait(1000)

    //Should be taking an alert || Error message
    cy.get('#button-form-2').click().wait(1000)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Dine type quantity must be equal to selected item quantity.')

    //Another Incorrect input
    cy.get('#dineIn').clear().wait(500)
    cy.get('#dineIn').click().type('4').wait(500)
    cy.get('#dineIn').should('have.value', '4').wait(500)
    cy.get('#takeOut').clear().wait(500)
    cy.get('#takeOut').click().type('7').wait(500)
    cy.get('#takeOut').should('have.value', '7').wait(500)
    //Should be taking an alert || Error message
    cy.get('#button-form-2').click().wait(1000)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Dine type quantity must be equal to selected item quantity.')
    cy.get('.Toastify__toast-body').click()
    cy.get('.px-8 > .flex > .anticon > svg').click()
  });

  // Special Request (Negative Testing)
  it("Special Request", () => {
   cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)')
   .click().wait(500)
   cy.get(':nth-child(4) > .bg-green-100').click().wait(1000) 
   cy.get('.Toastify__toast-body')
   .should("have.text", "Error : Select item first.")
   .wait(2000).click()
   cy.get('.Toastify__toast-body').click()
   // OPEN MODAL
   cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)')
    .click().wait(1000)
   cy.get(':nth-child(4) > .bg-green-100').click().wait(1000)
   cy.get('.px-8').should('be.visible')
  cy.get('#takeOut').click().type('123')
  cy.get('#takeOut').should('have.value', '123') //RANDOM INPUT
  cy.get('#takeOut').click().type('123')
  cy.get('#takeOut').should('have.value', '123') //RANDOM INPUT
   cy.get('.px-8').should('have.text', 'Add Special Request(s)')
   cy.get('.w-\\[100\\%\\] > .mb-2').should('have.text', 'Others')
   cy.get('#takeOut').clear({force:true}).type('{backspace}').should('be.empty')
   cy.get('#button-form-2').click()
  // Alert Message Validation
  cy.wait(2000)
  cy.checkLabelCaption('.Toastify__toast-body', '0', 'Upon clicking the "Update" button on Add Special Request(s)', 'Please select or add a special request.', assertionResults, failureMessages)
  cy.get('.Toastify__toast-body').click()
  cy.get('.Toastify__toast-body').click()
  cy.get('.px-8 > .flex > .anticon > svg').click()
  cy.checkForFailure(assertionResults, failureMessages)
  });

// FREE ITEM (Negative Testing)
  it("Free Item ", () => {
    cy.wait(1000)
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)')
    .click().wait(500)
    cy.get(':nth-child(6) > .bg-green-100').click().wait(1000) 
    cy.get('.Toastify__toast-body')
    .should("have.text", "Error : Select item first.")
    .wait(1000).click()
    cy.get('.Toastify__toast-body').click()

    // MODAL OPEN
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)')
    .click().wait(500)
    cy.get(':nth-child(6) > .bg-green-100').click().wait(500)
    cy.get('.px-8').should('be.visible').wait(500)
    cy.get('.p-1 > .mb-2').should('have.text', 'Select reason *').wait(500)
    cy.get('.w-\\[100\\%\\] > .mb-2')
    .should('have.text', 'Other free reason *').wait(500)
    cy.get('#button-form-2').click().wait(500)
    cy.get('.text-sm').should('have.text', 'Select reason * is required')
    .wait(500)

   // VALIDATION OF OTHER SPECIAL CHARACTER
    cy.get('.me-1').click().wait(500)
    cy.get('#button-form-2').click().wait(500)
    cy.get('.text-sm').should('have.text', 'Other free reason * is required')
    .wait(500)
    cy.get('.border-gray-300').click().wait(500)
  });

  // PRICE OVERRIDE (Negative Testing)
  it("Price Override", () => {
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)')
    .click().wait(500)
    cy.get(':nth-child(7) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body')
    .should("have.text", "Error : Select item first.")
    .wait(500).click()
    cy.get('.Toastify__toast-body').click().wait(500)
    // ENTER OF MODAL
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)')
    .click().wait(500)
    // OPEN MODAL FOR PRICE OVERRIDE
    cy.get(':nth-child(7) > .bg-green-100').click().wait(500)
    cy.get('.px-8').should('be.visible').wait(500)
    cy.get('.px-8').should('have.text', 'Price Override').wait(500)
    cy.get('.py-3 > .mb-2').should('have.text', 'Override Price').wait(500)
    // // 0 VALUE IN PRICE OVERRIDE VALIDATION
    // cy.get('.py-3 > .undefined').should('have.value', '0').wait(500)
    // cy.get('#button-form-2').click().wait(500)
    // cy.get('.Toastify__toast-body').should('have.text', 'Invalid Price')
    // .wait(500)
    // cy.get('.Toastify__toast-body').click().wait(2000)
    // // BLANK OVERRIDE VALIDATION
    // cy.get('.py-3 > .undefined').click().clear()
    // cy.get('.py-3 > .undefined').should('have.value', '').wait(500)
    // cy.get('#button-form-2').click().wait(500)
    // cy.get('.Toastify__toast-body').should('have.text', 'Please input Price')
    // cy.get('.Toastify__toast-body').click()

    // POSITIVE VALUE INPUT
    cy.get('#input-number-div-3 > .undefined').click().clear().type('1000',{force:true})
    cy.get('#button-form-2').click()
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Price Overridden Successfully.').wait(500)
    cy.get('.Toastify__toast-body').click()
    cy.get('.Toastify__toast-body').click()
    // cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(5)')
    // .should('have.text', '1000.00')
    cy.checkText('.MuiTableBody-root > .MuiTableRow-root > :nth-child(5)', '0', 'Upon clicking the Confirm button:', '10000.00', assertionResults, failureMessages) 
    cy.get(':nth-child(7) > .bg-green-100').click()
    cy.checkText('.MuiTableBody-root > .MuiTableRow-root > :nth-child(5)', '0', 'Upon clicking the Confirm button:', '10000.00', assertionResults, failureMessages) 
    cy.get(':nth-child(7) > .bg-green-100').click()
    cy.get(2000)
    cy.get('.Toastify__toast-body', { timeout: 10000 }).should('have.text', 'Item price is already overridden.').wait(500)
    cy.get('.Toastify__toast-body').click().wait(2000)
    cy.get('.Toastify__toast-body').click().wait(2000)

    //CLICK FREE ITEM
    cy.get(':nth-child(6) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body').should('have.text', 'Error : Remove price override first.')
    cy.wait(2000)
    cy.get('.Toastify__toast-body').click().wait(1000)
    //CLICK ADD-ONS
    cy.get(':nth-child(8) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body').should('have.text', 'Error : Remove price override first.')
    cy.wait(2000)
    cy.get('.Toastify__toast-body').click().wait(1000)
    //REMOVE PRICE OVERRIDE PRICE
    cy.get('.MuiButtonBase-root').click().wait(2000)
    // cy.get('.MuiButtonBase-root').eq(1).click().wait(2000)
    cy.get('.MuiButtonBase-root').click().wait(2000)
    // cy.get('.MuiButtonBase-root').eq(1).click().wait(2000)
    //cy.get('.Toastify__toast-body').should('have.text', 'Item price override removed')
    cy.get('.Toastify__toast-body').click().wait(4000)
    cy.get('.Toastify__toast-body').click().wait(4000)

    cy.checkForFailure(assertionResults, failureMessages)
  })
  
  // ADD-ONS (Negative Testing)
  it("Add-ons", () => {
    cy.wait(4000)

    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click()

    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click()
    cy.wait(2000)

    cy.get(':nth-child(8) > .bg-green-100').click()
    cy.wait(1000)


    cy.get(':nth-child(8) > .bg-green-100').click()
    cy.wait(1000)

    cy.checkElementVisibility('.Toastify__toast-body', '0', 'Upon Clicking the "Add On Item" button:', 'The "Error : Select item first." notification was not visible.', assertionResults, failureMessages)
    cy.wait(8000)

    cy.wait(8000)

    // cy.get('.Toastify__toast-body').should("have.text", "Error : Select item first.").wait(2000)
    // cy.get('.Toastify__toast-body').click()

    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click().wait(500)

    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click().wait(500)
  })

  it("Discount", () => {
    cy.contains("Beverages").click().wait(500)
    cy.contains("Coffee").click().wait(500)
    cy.contains("Hot Fresh Brew").click().wait(500)
    cy.get('.Toastify__toast-body')
    .should("have.text", "Item Added Successfully.").wait(1000);
    cy.get('.Toastify__toast-body').click().wait(1000);
    cy.get(':nth-child(5) > .bg-green-100').click().wait(1000)
    cy.get('.px-8').should('be.visible')
    cy.get('.mt-9 > label')
    .should('have.text', 'Select item you want discount to be applied.') 
    cy.get('#discounts > :nth-child(1) > .mb-2').should('have.text', 'Type of Discount *')
    cy.get('#button-form-2').click().wait(1000)
    cy.get('.text-sm')
    .should('have.text', 'Type of Discount * is required')
    cy.get('#discde').select('Senior').wait(1000)
    cy.get('#button-form-2').click().wait(500)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'No item selected. Unable to proceed.')
    cy.get('.Toastify__toast-body').click().wait(1000)
    cy.get('.justify-end').should('have.text', 'Select All').wait(1000)
    cy.get('#orderitmid').click().wait(1000)
    cy.get('.justify-end').should('have.text', 'Unselect All')
    cy.get('#button-form-2').click({force:true}).wait(500)

    //VALIDATION OF DISCOUNT MODAL
    cy.get('#discountUser > :nth-child(1) > .mb-2')
    .should('have.text', 'Name / Card Holder *')
    cy.get('#discountUser > :nth-child(2) > .mb-2')
    .should('have.text', 'Card Number *')
    cy.get('#discountUser > #button-form-div-1 > #button-form-div-2 > #button-form-2')
    .click().wait(1000)
    cy.get(':nth-child(1) > #empty-input-indicator-div')
    .should('have.text', 'Name / Card Holder * is required')
    cy.get(':nth-child(2) > #empty-input-indicator-div')
    .should('have.text', 'Card Number * is required')
    cy.get('#cardholder').click().type('Juan Dela Cruz')
    cy.get('#cardno').click().type('114511')
    cy.get('#discountUser > #button-form-div-1 > #button-form-div-2 > #button-form-2')
    .click().wait(500)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Senior: Discount Added.').wait(1000)
    cy.get('.Toastify__toast-body').click().wait(1000)
    cy.get(':nth-child(2) > .MuiTableCell-root > .flex > .ml-10')
    .should('have.text', 'Discount : Senior')

    //VALIDATION FOR OTHER BUTTONS IF CONSIDER
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(3)')
    .click().wait(1000)
    // REMOVE ITEM BUTTON (VALIDATION FOR DISCOUNT)
    cy.get(':nth-child(1) > .bg-red-100').click().wait(500)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Error : Remove discount first.').wait(500)
    cy.get('.Toastify__toast-body').click()
    // CHANGE QUANTITY BUTTON (VALIDATION FOR DISCOUNT)
    cy.get(':nth-child(2) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Error : Remove discount first.')
    cy.get('.Toastify__toast-body').click()
    // CHANGE ORDER TYPE BUTTON (VALIDATION FOR DISCOUNT)
    cy.get(':nth-child(3) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Error : Remove discount first.')
    cy.get('.Toastify__toast-body').click()
    // FREE ITM BUTTON (VALIDATION FOR DISCOUNT)
    cy.get(':nth-child(6) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Error : Remove discount first.')
    cy.get('.Toastify__toast-body').click()
    // PRICE OVERRIDE BUTTON (VALIDATION FOR DISCOUNT)
    cy.get(':nth-child(7) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Error : Remove discount first.')
    cy.get('.Toastify__toast-body').click()
    // ADD ON ITEM BUTTON (VALIDATION FOR DISCOUNT)
    cy.get(':nth-child(8) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Error : Remove discount first.')
    cy.get('.Toastify__toast-body').click()

    //DISCOUNT VALIDATION FOR DISCOUNTED (GOOD FOR 1 ITEM)
    cy.get(':nth-child(5) > .bg-green-100').click().wait(500)
    cy.get('.ant-empty-description')
    .should('have.text', 'You have already added all items a discount.')
    .wait(1000)
    cy.get('.border-gray-300').click().wait(1000)
  })

  // CALNCEL TRANSACTION BEFORE MAKING PAYMENT OR TRANSACTION
  it("Checking of buttons in Ordering  (AFTER CANCEL TRANASCTION)", () => {
    cy.get(':nth-child(9) > .bg-red-100 > .text-red-700').click()
    cy.get('.px-8').should('have.text', 'Confirmation')
    cy.get('section > h1').should('have.text', 'Are you sure you want to cancel this transaction?')
    cy.wait(1000)
    cy.get('#button-form-2').click()
    cy.wait(5000)

  })

  it("Checking of buttons in Ordering  (AFTER CANCEL TRANASCTION)", () => {

    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000)

  // Type of dine type before ordering (should be not disable)
    cy.get('.sc-dntaoT').should('be.not.disabled');
  // Checking if the Whole ordering UI is correct Disable/not buttons.
    cy.get(':nth-child(1) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Remove Item
    cy.get(':nth-child(2) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Change Quantity
    cy.get(':nth-child(3) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Change Order
    cy.get(':nth-child(4) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // change order type
    cy.get(':nth-child(5) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Special Request
    cy.get(':nth-child(6) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Add Discount    
    cy.get(':nth-child(7) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Free Item
    cy.get(':nth-child(8) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Price Override
    cy.get(':nth-child(9) > .bg-gray-100 > .text-gray-700').should('not.be.enabled'); // Cancel Transaction
    cy.get(':nth-child(10) > .bg-green-100').should('not.be.disabled');               // Reprint Transaction
    cy.get(':nth-child(11) > .bg-green-100').should('not.be.disabled');               // Reprint Void
    cy.get(':nth-child(12) > .bg-green-100').should('not.be.disabled');               // Reprint Refund
    cy.get(':nth-child(13) > .bg-gray-100').should('not.be.enabled');                 // Payment
    cy.get(':nth-child(14) > .bg-orange-100').should('not.be.disabled');              // Void Transaction
    cy.get(':nth-child(15) > .bg-orange-100').should('not.be.disabled');              // Refund Transaction
    cy.get(':nth-child(16) > .bg-green-100').should('not.be.disabled');               // Other Transaction

    cy.checkForFailure(assertionResults, failureMessages)
  });


  it("After selecting item in ordering checking of availability of buttons (AFTER CANCEL TRANASCTION)", () => {

    // Select Item
    cy.contains(/^Food$/).click()
    cy.wait(2000)
    cy.contains(/^Chicken$/).click()
    cy.wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click()
    cy.wait(2000)
    cy.get('.Toastify__toast-body').click()
    .wait(1000)
  
  // Checking if the Whole ordering UI is correct Disable/not buttons.
    cy.get(':nth-child(1) > .bg-red-100 > .text-red-700').should('not.be.disabled');     // Remove Item
    cy.get(':nth-child(2) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Change Quantity
    cy.get(':nth-child(3) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Change Order
    cy.get(':nth-child(4) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // change order type
    cy.get(':nth-child(5) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Special Request
    cy.get(':nth-child(6) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Add Discount
    cy.get(':nth-child(7) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Free Item
    cy.get(':nth-child(8) > .bg-green-100 > .text-green-700').should('not.be.disabled'); // Price Override
    cy.get(':nth-child(9) > .bg-red-100 > .text-red-700').should('not.be.disabled');     // Cancel Transaction
    cy.get(':nth-child(10) > .bg-gray-100').should('not.be.enabled');                    // Reprint Transaction
    cy.get(':nth-child(11) > .bg-gray-100').should('not.be.enabled');                    // Reprint Void
    cy.get(':nth-child(12) > .bg-gray-100').should('not.be.enabled');                    // Reprint Refund
    cy.get(':nth-child(13) > .bg-green-100').should('not.be.disabled');                  // Payment
    cy.get(':nth-child(14) > .bg-gray-100').should('not.be.enabled');                    // Void Transaction
    cy.get(':nth-child(15) > .bg-gray-100').should('not.be.enabled');                    // Refund Transaction
    cy.get(':nth-child(16) > .bg-green-100').should('not.be.disabled');                  // Other Transaction

    cy.checkForFailure(assertionResults, failureMessages)
  })

  // PAYMENT (Negative Testing)
  it("Payment ", () => {
  it("Payment ", () => {
   cy.wait(1000)
   cy.get(':nth-child(13) > .bg-green-100').click().wait(1000)
   cy.get(':nth-child(13) > .bg-green-100').click().wait(1000)
   cy.get('.px-8').should('be.visible')
   cy.get('.px-8').should('have.text', 'Payment')

   //  cy.get('.text-right > .overflow-hidden')
   //  .should('have.text', '₱82.79')
   //  .should('have.text', '₱82.79')
   cy.checkText('.text-right > .overflow-hidden', '0', 'Upon clicking the Payment button:', '₱82.79', assertionResults, failureMessages) 
   
   //  cy.get('.text-red > :nth-child(2)')
   //  .should('have.text', '₱82.79')
   cy.checkText('.text-red > :nth-child(2)', '0', 'Upon clicking the Payment button:', '₱82.79', assertionResults, failureMessages) 
   //  .should('have.text', '₱82.79')
   cy.checkText('.text-red > :nth-child(2)', '0', 'Upon clicking the Payment button:', '₱82.79', assertionResults, failureMessages) 
 
   cy.get('.my-4 > :nth-child(4) > :nth-child(1) > .font-montserrat').click().wait(1000)
   cy.get('.my-4 > :nth-child(4) > :nth-child(1) > .font-montserrat').click().wait(1000)

   //  cy.get('.text-right > .overflow-hidden')
   //  .should('have.text', '₱0.00')
   //  cy.get('.text-right > .overflow-hidden')
   //  .should('have.text', '₱0.00')
   cy.checkText('.text-right > .overflow-hidden', '0', 'Upon clicking the Payment button:', '₱0.00', assertionResults, failureMessages) 
   cy.contains('CASH').click().wait(1000)
   //  cy.get('.Toastify__toast-body')
   //  .should('have.text', 'Error : Zero amount').wait(500)
   cy.checkLabelCaption('.Toastify__toast-body', '0', 'Upon clicking the CASH button:', 'Error : Zero amount', assertionResults, failureMessages) 
   //  cy.get('.Toastify__toast-body')
   //  .should('have.text', 'Error : Zero amount').wait(500)
   cy.checkLabelCaption('.Toastify__toast-body', '0', 'Upon clicking the CASH button:', 'Error : Zero amount', assertionResults, failureMessages) 
   cy.get('.Toastify__toast-body').click()
   cy.get(':nth-child(3) > :nth-child(2) > .font-montserrat').click() //#8 BUTTON
   cy.get('.my-4 > :nth-child(4) > :nth-child(2) > .font-montserrat').click() // #0 BUTTON
   cy.get(':nth-child(3) > :nth-child(2) > .font-montserrat').click() //#8 BUTTON
   cy.get('.my-4 > :nth-child(4) > :nth-child(2) > .font-montserrat').click() // #0 BUTTON
   cy.contains('CASH').click().wait(500)
   cy.get('.bg-black\\/75 > .shadow-lg > .px-8')
   .should('have.text', 'CASH Payment')
   //  cy.get('.underline').should('have.text', '₱80.00')
   //  cy.get('.underline').should('have.text', '₱80.00')
   cy.checkText('.underline', '0', 'Upon clicking the CASH button:', '₱80.00', assertionResults, failureMessages) 
   cy.get('#button-form-2').click().wait(1000)
   cy.get('.flex-row > :nth-child(1)').should('have.text', 'CASH')
   //  cy.get('.me-1').should('have.text', '80.00')
   //  cy.get('.me-1').should('have.text', '80.00')
  cy.checkText('.me-1', '0', 'Upon clicking the CASH button:', '80.00', assertionResults, failureMessages) 
   cy.get('.ml-5 > .mb-5 > :nth-child(1) > :nth-child(1)')
   .should('have.text', 'Paid')
   //  cy.get('.ml-5 > .mb-5 > :nth-child(1) > :nth-child(2)')
   //  .should('have.text', '₱80.00')
   //  cy.get('.ml-5 > .mb-5 > :nth-child(1) > :nth-child(2)')
   //  .should('have.text', '₱80.00')
  cy.checkText('.ml-5 > .mb-5 > :nth-child(1) > :nth-child(2)', '0', 'Upon clicking the CASH button:', '₱80.00', assertionResults, failureMessages) 
   cy.get('.mb-5 > :nth-child(2) > :nth-child(1)')
   .should('have.text', 'Balance')
   //  cy.get('.mb-5 > :nth-child(2) > :nth-child(2)')
   //  .should('have.text', '₱2.79')
   //  cy.get('.mb-5 > :nth-child(2) > :nth-child(2)')
   //  .should('have.text', '₱2.79')
  cy.checkText('.mb-5 > :nth-child(2) > :nth-child(2)', '0', 'Upon clicking the CASH button:', '₱2.79', assertionResults, failureMessages)  
  cy.get('.mb-5 > :nth-child(3) > :nth-child(1)')
   .should('have.text', 'Change')
   //  cy.get('.mb-5 > :nth-child(3) > :nth-child(2)')
   //  .should('have.text', '₱0.00')
   //  cy.get('.mb-5 > :nth-child(3) > :nth-child(2)')
   //  .should('have.text', '₱0.00')
   cy.checkText('.mb-5 > :nth-child(3) > :nth-child(2)', '0', 'Upon clicking the CASH button:', '₱0.00', assertionResults, failureMessages)  

   // PRESSING A VALUE WORTH 100 PESOS
   cy.get('.my-4 > :nth-child(4) > :nth-child(1) > .font-montserrat').click().wait(1000)
   cy.get('.my-4 > :nth-child(1) > :nth-child(1) > .font-montserrat').click().wait(1000)
   cy.get('.my-4 > :nth-child(4) > :nth-child(2) > .font-montserrat').click().wait(1000)
   cy.get('.my-4 > :nth-child(4) > :nth-child(2) > .font-montserrat').click().wait(1000)
   // PRESSING A VALUE WORTH 100 PESOS
   cy.get('.my-4 > :nth-child(4) > :nth-child(1) > .font-montserrat').click().wait(1000)
   cy.get('.my-4 > :nth-child(1) > :nth-child(1) > .font-montserrat').click().wait(1000)
   cy.get('.my-4 > :nth-child(4) > :nth-child(2) > .font-montserrat').click().wait(1000)
   cy.get('.my-4 > :nth-child(4) > :nth-child(2) > .font-montserrat').click().wait(1000)

  
  
  // VALIDATION FOR E-WALLET PAYMENTS
   cy.contains('CHECK').click()
   cy.wait(500) //CHECK
   cy.get('.Toastify__toast-body')
   .should('have.text', 'Error : Amount exceeds the balance').wait(500)
   cy.get('.Toastify__toast-body').click()
   cy.wait(500)

   cy.contains('DEBIT CARD').click().wait(500) //DEBIT CARD
   cy.get('.Toastify__toast-body')
   .should('have.text', 'Error : Amount exceeds the balance').wait(500)
   cy.get('.Toastify__toast-body').click()
   cy.wait(500)

   cy.contains('CREDIT CARD').click().wait(500) //CREDIT CARD
   cy.get('.Toastify__toast-body')
   .should('have.text', 'Error : Amount exceeds the balance').wait(500)
   cy.get('.Toastify__toast-body').click()

   cy.contains('GIFT CHECK').click().wait(500) //GIFT CHECK
   cy.get('.bg-black\\/75 > .rounded > .px-8').should('have.text', "GIFT CHECK Payment")
   cy.get('.border-gray-300').click()

   cy.get('.bg-black\\/75 > .rounded > .px-8').should('have.text', "GIFT CHECK Payment")
   cy.get('.border-gray-300').click()


   cy.contains('OTHER PAYMENT').click().wait(500) //OTHER PAYMENT
   cy.get('.Toastify__toast-body').should('have.text', 'Error : Amount exceeds the balance').wait(500)
   cy.get('.Toastify__toast-body').should('have.text', 'Error : Amount exceeds the balance').wait(500)
   cy.get('.Toastify__toast-body').click()

  // SELECT PRINT TRANSACTION EVEN IF THERE'S STILL BALANCE.
   cy.get('.my-5 > .grid > :nth-child(1)').click().wait(500)
   cy.get('.Toastify__toast-body')
   .should('have.text', 'Error: There is unpaid balance.').wait(500)
   cy.get('.Toastify__toast-body').click()
  // ANOTHER CASH PAYMENT (100 Pesos)
   cy.get('#changeQuantity > :nth-child(1) > :nth-child(1) > .w-\\[300px\\] > .grid > :nth-child(1)').click().wait(500)

  //MODAL CASH PAYMENT VALIDATION
   cy.get('.underline').should('have.text', '₱100.00')
   cy.get('#cashform > :nth-child(1) > .mb-2')
   .should('have.text', 'Customer Name')
   cy.get(':nth-child(2) > .mb-2')
   .should('have.text', 'Address')
   cy.get(':nth-child(3) > .mb-2')
   .should('have.text', 'Contact No.')
   cy.get(':nth-child(4) > .mb-2')
   .should('have.text', 'TIN')
   cy.get('#button-form-2').click()
   cy.wait(1000)


  //MODAL PAYMENT VALIDATION THAT ALREADY PAID
   cy.get('.ml-5 > .mb-5 > :nth-child(1) > :nth-child(1)')
   .should('have.text', 'Paid')
   cy.get('.ml-5 > .mb-5 > :nth-child(1) > :nth-child(2)')
   .should('have.text', '₱180.00')
   cy.get('.mb-5 > :nth-child(2) > :nth-child(1)')
   .should('have.text', 'Balance')
   cy.get('.mb-5 > :nth-child(2) > :nth-child(2)')
   .should('have.text', '₱0.00')
   cy.get('.mb-5 > :nth-child(3) > :nth-child(1)')
   .should('have.text', 'Change')
   cy.get('.mb-5 > :nth-child(3) > :nth-child(2)')
   .should('have.text', '₱97.21')
   cy.checkText('.mb-5 > :nth-child(3) > :nth-child(2)', '0', 'Upon clicking the CASH button:', '₱97.21', assertionResults, failureMessages)  
  
   //DELETE PAYMENTS (100.00 AND THEN 80.00)
   cy.get('.mb-5 > :nth-child(3) > :nth-child(2)')
   .should('have.text', '₱97.21')
   cy.checkText('.mb-5 > :nth-child(3) > :nth-child(2)', '0', 'Upon clicking the CASH button:', '₱97.21', assertionResults, failureMessages)  
  
   //DELETE PAYMENTS (100.00 AND THEN 80.00)
   cy.get('.flex.text-sm > .flex-col > :nth-child(2) > .flex > .anticon > svg')
   .click()
   cy.get('.flex.text-sm > .flex-col > :nth-child(1) > .flex > .anticon > svg')
   .click()
  //CLOSE MODAL
   cy.get('.px-8 > .flex > .anticon > svg').click()

   cy.checkForFailure(assertionResults, failureMessages)

})
  
  //PAYMENT TRANASCTION FOR VOID AND REFUND
  it("Payment transaction for void and refund", () => {

    // TRANSACTION 1 FOR VOID


    // TRANSACTION 1 FOR VOID

    cy.wait(2000)
    cy.get(':nth-child(13) > .bg-green-100').click().wait(2000);
    cy.get(':nth-child(13) > .bg-green-100').click().wait(2000);
    cy.get('.px-8').should('be.visible');
    cy.get('.px-8').should('have.text', 'Payment');
    cy.contains('CASH').click().wait(1000);
    cy.get('.bg-black\\/75 > .shadow-lg > .px-8 > .flex')
    .should('have.text', 'CASH Payment')
    cy.get('p.text-red-500')
    cy.get('p.text-red-500')
    .should('have.text', 'Confirm Amt Received')
    cy.checkText('.underline', '0', 'Upon clicking the Cash button on Payment:', '₱82.79', assertionResults, failureMessages) 
    // cy.get('.underline')
    // .should('have.text', '₱82.79')
    cy.get('#button-form-2').click().wait(1000)
    cy.get('.my-5 > .grid > :nth-child(1)').click().wait(500)
    cy.get('#postTransactionV2').should('have.text', 'Transaction Complete.')
    cy.get('.ant-modal-close-x').click()
    cy.get('#postTransactionV2').click()
    cy.get('.ant-modal-close-x').click()
    cy.get('#postTransactionV2').click()
    cy.checkForFailure(assertionResults, failureMessages)

    // TRANASCTION 2 FOR REFUND

    cy.contains(/^Food$/).click()
    cy.wait(2000)
    cy.contains(/^Chicken$/).click()
    cy.wait(2000)
    cy.contains(/^1-pc Chickenjoy$/).click()
    cy.wait(2000)
    /* cy.get('.Toastify__toast-body').click()
    .wait(2000) */
    cy.get(':nth-child(13) > .bg-green-100').click().wait(2000);
    cy.get('.px-8').should('be.visible');
    cy.get('.px-8').should('have.text', 'Payment');
    cy.contains('CASH').click().wait(1000);
    cy.get('.bg-black\\/75 > .shadow-lg > .px-8 > .flex')
    .should('have.text', 'CASH Payment')
    cy.get('p.text-red-500')
    .should('have.text', 'Confirm Amt Received')
    cy.checkText('.underline', '0', 'Upon clicking the Cash button on Payment:', '₱82.79', assertionResults, failureMessages) 
    // cy.get('.underline')
    // .should('have.text', '₱82.79')
    cy.get('#button-form-2').click().wait(1000)
    cy.get('.my-5 > .grid > :nth-child(1)').click().wait(500)
    cy.get('#postTransactionV2').should('have.text', 'Transaction Complete.')
    cy.get('.ant-modal-close-x').click()
    cy.get('#postTransactionV2').click()
    cy.checkForFailure(assertionResults, failureMessages)

  })

  // REPRINT TRANASCTION NEGATIVE TESTING
  it("Reprint Tranasction", () => {
    cy.wait(8000)
    cy.get(':nth-child(10) > .bg-green-100').click().wait(4000)
    cy.wait(8000)
    cy.wait(8000)
    cy.get(':nth-child(10) > .bg-green-100').click().wait(4000)
    cy.wait(8000)
    cy.get('.px-8').should('be.visible')
    cy.get('.me-2').should('have.text', 'Reprint Transaction')
    cy.get('.me-2').should('have.text', 'Reprint Transaction')
    cy.get('.mx-2 > .py-3 > .mb-2')
    .should('have.text', 'Date From:')
    cy.get('.mx-2 > .py-3 > .ant-picker > .ant-picker-input > input').click().clear().type('01/08/2025{enter}').wait(500)
    cy.get('.mx-2 > .py-3 > .ant-picker > .ant-picker-input > input').click().clear().type('01/08/2025{enter}').wait(500)
    cy.get(':nth-child(2) > .py-3 > .mb-2').wait(500)
    .should('have.text', 'Date To:').wait(500)
    cy.get(':nth-child(2) > .py-3 > .ant-picker > .ant-picker-input > input').click().clear().type('01/04/2025{enter}').wait(500)
    cy.get('.mx-2 > .py-3 > .block').click()
    cy.get(':nth-child(2) > .py-3 > .ant-picker > .ant-picker-input > input').click().clear().type('01/04/2025{enter}').wait(500)
    cy.get('.mx-2 > .py-3 > .block').click()
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Invalid Date Range').wait(500)
    cy.get('.px-8 > .flex > .anticon > svg').click()
    cy.wait(1000)
  })

  // VOID TRANSACTION
  it("Void Transaction", () => {
    cy.wait(2000)
    cy.get(':nth-child(14) > .bg-orange-100').click().wait(1000)
    cy.get('.px-8').should('be.visible')
    cy.get('.px-8').should('have.text', 'Void Transaction')
    cy.contains(/^INV-0000000000000001$/).click()
    
    // cy.checkText('.max-h-\[500px\] > section > .flex-col > :nth-child(2) > :nth-child(1)', '0', 'Upon clicking the Void Transaction button:', 'INV-0000000000000001', assertionResults, failureMessages)
    cy.contains(/^INV-0000000000000001$/).click()
    
    // cy.checkText('.max-h-\[500px\] > section > .flex-col > :nth-child(2) > :nth-child(1)', '0', 'Upon clicking the Void Transaction button:', 'INV-0000000000000001', assertionResults, failureMessages)

    cy.get('.bg-black\\/75 > .rounded > .px-8')
    cy.get('.bg-black\\/75 > .rounded > .px-8')
    .should('have.text', 'Set void reason')
    cy.get('.p-1 > .mb-2').should('have.text', 'Select reason *')
    cy.get('.m-0').should('have.text', 'Others')
    cy.get('.w-\\[100\\%\\] > .mb-2').should('have.text', 'Other void reason *')
    cy.get('#button-form-2').click().wait(1000)
    cy.get('.text-sm').should('have.text', 'Select reason * is required')
    cy.get('.me-1').click().wait(1000) //CHECK THE CHECKBOX
    cy.get('#button-form-2').click().wait(1000)
    cy.get('.text-sm').should('have.text', 'Other void reason * is required')
    cy.get('.me-1').click().wait(1000) //UNCHECK THE CHECKBOX
    cy.get('#voidreason').select('Incorrect Order Entry').wait(1000)
    cy.get('#button-form-2').click()
    cy.wait(1500)
    cy.get('.Toastify__toast-body',{ timeout: 10000 })
    .should('have.text', 'Transaction Void Successful').wait(500)
    cy.get('.Toastify__toast-body').click().wait(1000)

    cy.checkForFailure(assertionResults, failureMessages)
  })

    // REFUND TRANASCTION
  it("Refund Transaction", () => {
    cy.get(':nth-child(15) > .bg-orange-100').click()
    cy.get('.px-8').should('have.text', 'Authorized User Only')
    cy.get('#usrcde').click().type('lstv')
    cy.get('#usrpwd').click().type('lstventures')
    cy.get('.mt-8 > .sc-gtLWhw').click().wait(500)
    cy.get('.mt-8 > .sc-gtLWhw').click().wait(500)
    cy.get('.Toastify__toast-body').should('have.text', 'Authorized!')
    .wait(1000)
    cy.get('.Toastify__toast-body').click()
    cy.get('.px-8').should('have.text', 'Refund Transaction')
    cy.get('.p-1 > .mb-2').should('have.text', 'Select reason *')
    cy.get('.w-\\[100\\%\\] > .mb-2')
    .should('have.text', 'Other refund reason *')
    cy.get('#button-form-2').click()
    cy.get('.text-sm').should('have.text', 'Select reason * is required')
    cy.get('.me-1').click()
    cy.get('#button-form-2').click()
    cy.get('.text-sm').should('have.text', 'Other refund reason * is required')
    cy.get('.me-1').click()
    cy.get('#refundreason').select('Food Quality Issue')
    cy.get('#button-form-2').click()


    // VALIDATE REFUND MODAL
    // cy.get('.px-8').should('have.text','REF-0000000000000001')
    cy.checkText('.px-8', '0', 'Validate Refund:', 'REF-0000000000000001', assertionResults, failureMessages)  
    cy.get('.justify-between > .group').should('have.text', 'Search OR/INV')
    cy.get('.justify-between > .group').should('have.text', 'Search OR/INV')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(1)').should('have.text', 'Action')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(2)').should('have.text', 'ITEM')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(3)').should('have.text', 'OR/INV #')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(3)').should('have.text', 'OR/INV #')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(4)').should('have.text', 'QTY TO RETURN')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(5)').should('have.text', 'AMT TO REFUND')
    cy.get('button > .group').click().wait(1000)
    cy.get('.Toastify__toast-body').should('have.text', 'No item(s) to refund.')
    cy.wait(1500)
    cy.get('.Toastify__toast-body').click()
    cy.wait(1500)
    cy.get('.Toastify__toast-body').click()
    cy.get('.justify-between > .group').click()
    cy.get('.px-8').should('have.text', 'Search OR/INV')
    cy.get('.px-8').should('have.text', 'Search OR/INV')
    // cy.get('.h-\\[82vh\\] > .flex-col > :nth-child(1) > :nth-child(1)')
    // .should('have.text', 'INV-0000000000000002')
    cy.checkText('.MuiStack-root > :nth-child(2)', 'INV-0000000000000002', assertionResults, failureMessages)  
    cy.contains(/^82.79$/)
    cy.get('.css-0 > .flex').click()

    cy.checkText('.px-8', '0', 'Validate Refund:', 'INV-0000000000000002', assertionResults, failureMessages)  
    cy.get('.MuiTableCell-alignLeft')
    .should('have.text', 'ITEM')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(2)')
    .should('have.text', 'QTY')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(3)')
    .should('have.text', 'QTY TO RETURN')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(4)')
    .should('have.text', 'AMT TO REFUND')
    cy.get('.css-8c5hg9-MuiTableCell-root')
    .should('have.text', "1-pc Chickenjoy")

    cy.get('#refundqty').click().clear().type('1')
    cy.get('#refundqty').should('have.value', '1')
    // cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should('have.text', '82.79')
    cy.checkText('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)', '0', 'Validate Refund:', '82.79', assertionResults, failureMessages)  
    // cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should('have.text', '82.79')
    cy.checkText('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)', '0', 'Validate Refund:', '82.79', assertionResults, failureMessages)  
    cy.get('#refundqty').click().clear()

    cy.get('#refundqty').click().clear().type('2')
    cy.get('#refundqty').should('have.value', '1')
    // cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should('have.text', '82.79')
    cy.checkText('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)', '0', 'Validate Refund:', '82.79', assertionResults, failureMessages)  
    // cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should('have.text', '82.79')
    cy.checkText('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)', '0', 'Validate Refund:', '82.79', assertionResults, failureMessages)  

    cy.get('#refundqty').click({force:true})
    cy.get('#refundqty').click({force:true})
    
    cy.get('#refundqty').should('have.value', '1')
    // cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should('have.text', '82.79')
    cy.checkText('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)', '0', 'Validate Refund:', '82.79', assertionResults, failureMessages) 
    // cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should('have.text', '82.79')
    cy.checkText('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)', '0', 'Validate Refund:', '82.79', assertionResults, failureMessages) 
    cy.get('#refundqty').click({force:true}).clear()
    // NEXT BUTTON
    cy.get('.h-\\[82vh\\] > .h-full > .group').click({force:true})
    cy.get('.Toastify__toast-body').should('have.text', 'No item(s) added.').wait(4000)
    cy.get('.justify-between > .group').click()
    cy.contains(/^INV-0000000000000002$/).click({force:true})
    cy.get('#refundqty').click({force:true}).type('1',{force:true})
    cy.get('.Toastify__toast-body').should('have.text', 'No item(s) added.').wait(4000)
    cy.get('.justify-between > .group').click()
    cy.contains(/^INV-0000000000000002$/).click({force:true})
    cy.get('#refundqty').click({force:true}).type('1',{force:true})
    cy.get('.h-\\[82vh\\] > .h-full > .group').click({force:true})
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Added item(s) successful.').wait(4000)
    cy.get('body').then(($body) => {
      // Check if the element exists
      if ($body.find('.Toastify__toast-body').length > 0) {
        cy.get('.Toastify__toast-body').then(($alert) => {
          if ($alert.text().includes('No item(s) added.')) {
            cy.wrap($alert).click();
            cy.log('Clicked on the toast message.');
          } else {
            cy.log('Text not found in the toast message, doing nothing.');
          }
        });
      } else {
        cy.log('Toast message not found, no action taken.');
      }
    });
    
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(5)').should('have.text', '82.79')
    .should('have.text', 'Added item(s) successful.').wait(4000)
    cy.get('body').then(($body) => {
      // Check if the element exists
      if ($body.find('.Toastify__toast-body').length > 0) {
        cy.get('.Toastify__toast-body').then(($alert) => {
          if ($alert.text().includes('No item(s) added.')) {
            cy.wrap($alert).click();
            cy.log('Clicked on the toast message.');
          } else {
            cy.log('Text not found in the toast message, doing nothing.');
          }
        });
      } else {
        cy.log('Toast message not found, no action taken.');
      }
    });
    
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(5)').should('have.text', '82.79')
    cy.get(':nth-child(3) > .group').click({force:true})
    cy.get('.bg-black\\/75 > .rounded > .px-8').should('have.text', 'Mode of Refund')
    cy.get('.py-3 > .block').should('have.text', 'Mode of Refund')
    cy.get('.bg-black\\/75 > .rounded > .px-8').should('have.text', 'Mode of Refund')
    cy.get('.py-3 > .block').should('have.text', 'Mode of Refund')
    cy.get('.py-3 > :nth-child(2)').should('have.text', 'CASH')
    cy.get('.py-3 > :nth-child(3)').should('have.text', 'CHECK')
    cy.get('.py-3 > :nth-child(4)').should('have.text', 'DEBIT CARD')
    cy.get('.py-3 > :nth-child(5)').should('have.text', 'CREDIT CARD')
    cy.get('.py-3 > :nth-child(6)').should('have.text', 'OTHER PAYMENT')
    cy.get('.max-h-\\[450px\\] > :nth-child(1) > .group').click({force:true}).wait(1000)
    cy.get('.Toastify__toast-body').should('have.text', 'Transaction Refunded.')

    cy.checkForFailure(assertionResults, failureMessages)
  })

  // REPRINT VOID TRANASACTION
  it("Reprint Void Transaction", () => {
    cy.wait(1000)
    cy.get(':nth-child(11) > .bg-green-100').click()
    cy.wait(1000)
    cy.get('.px-8').should('be.visible')
    cy.get('.px-8').should('have.text', 'Reprint Void Transaction')


    cy.checkText('section > .overflow-y-auto > :nth-child(1) > :nth-child(1)', '0', 'Reprint Void Transaction:', 'INV-0000000000000001', assertionResults, failureMessages)  

    cy.checkText('section > .overflow-y-auto > :nth-child(1) > :nth-child(2)', '0', 'Reprint Void Transaction:', '76.00', assertionResults, failureMessages)  
    cy.get('.px-8 > .flex > .anticon > svg').click()
    cy.wait(1000)
    cy.checkForFailure(assertionResults, failureMessages)
  })

  // REPRINT REFUND TRANSACTION
  it("Reprint Refund Transaction", () => {
    cy.wait(1000)
    cy.get('.grid > :nth-child(12)').click()
    cy.get('.px-8').should('be.visible')
    cy.get('.px-8').should('have.text', 'Reprint Refund Transaction')

    // this code check the refund invoice and price value.
    cy.get('#rr-section > .flex-col > .flex').should("have.text" , "INV-000000000000000276.00")

    cy.wait(2000)
    cy.get('.px-8 > .flex > .anticon > svg').click()


    cy.checkForFailure(assertionResults, failureMessages)
  })

})