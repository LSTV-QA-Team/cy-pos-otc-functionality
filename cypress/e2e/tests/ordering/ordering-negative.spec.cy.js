let assertionResults = [];
let failureMessages = [];

describe("Ordering ", () => {
  beforeEach(() => {
    //cy.task("queryDb","TRUNCATE TABLE takeouttranfile")

    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("Select Pricelist Modal ", () => {
    //CLEAR TRANSACTION
    cy.wait(4000)
    cy.get(':nth-child(9) > .bg-red-100').click().wait(500)
    cy.get('.px-8').should('have.text', 'Confirmation').wait(500)
    cy.get('section > h1')
    .should('have.text', 'Are you sure you want to cancel this transaction?')
    .wait(500)
    cy.get('.border-blue-500').click().wait(1000)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Transaction Successfully Cancelled.')
    .wait(1000)
    cy.get('.Toastify__toast-body').click().wait(1000)
    //OPEN NEW TRANASCTION
    cy.wait(4000)
    cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
    cy.get("#postypcde").select("Dine-In").wait(2000);
    cy.get("#warcde").select("Jollibee 1").wait(2000);
    cy.contains("Proceed").click();
    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000);
    cy.get('.Toastify__toast-body')
    .should("have.text", "Transaction Opened Successfully.").click().wait(2000);
    cy.contains("Food").click().wait(2000);
    cy.contains("Chicken").click().wait(2000);
    cy.contains("1-pc Chickenjoy").click().wait(2000);
    cy.get('.Toastify__toast-body')
    .should("have.text", "Item Added Successfully.").wait(1000);
    cy.get('.Toastify__toast-body').click().wait(2000);
  });

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
    cy.get('.Toastify__toast-body').should('have.text', 'Order Type Changed.')
    cy.get(':nth-child(3) > .bg-green-100').click().wait(500)
  });
  


  it("Change Ordertype type > 1 Quantity", () => {

       //Remarks: Manual working properly but in cypress takes the condition not roperly work the system condition.
   // cy.get('#itmqty').click().type('{downArrow}').wait(2000)
   // cy.get('#itmqty').should('have.value', '1')
   // cy.get('#itmqty').clear()
   cy.get(':nth-child(2) > .bg-green-100').click().wait(2000) 
   cy.get('#itmqty')
   .click({force:true}).clear({force:true}).realType('0',{force:true}).wait(2000)
   cy.get('#itmqty').should('have.value', '10').wait(2000)
   cy.get('.border-blue-500').click({force:true}).wait(1000)
   cy.get('.px-8').should('not.exist').wait(1000)
   cy.get('.Toastify__toast-body')
   .should("have.text", "Item Quantity Changed.").wait(500)
   cy.get('.Toastify__toast-body').click().wait(2000)
   //Validation
   cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(2)')
   .should('have.text', '10')
   cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(5)')
   .should('have.text', '760.00')
 });

  // //CHANGE ORDERTYPE 2 OR MORE QUNATITIES IN ITEM
  it("Change Ordertype type 2 or more quantities", () => {
    cy.wait(1000)
    cy.get(':nth-child(3) > .bg-green-100').click().wait(1000)

    //MODAL OPEN (IF THE ITEM IS GREATER THEN 1 QUANTITY)
    cy.get('.px-8').should('be.visible').wait(500)

    //Modal Validation
          //ERROR DUE TO CHANGE QUANTITY IS NOT WORKING PRERPLY IN CYPRESS
    cy.get('#changeQuantity > :nth-child(1) > .mb-2')
    .should('have.text', 'Set Dine-in quantity').wait(1000)
    cy.get(':nth-child(2) > .mb-2')
    .should('have.text', 'Set Take out quantity').wait(1000)

    //Negative Value Checker
    cy.get('#dineIn').click().type('{downArrow}').wait(2000)
    cy.get('#dineIn').should('have.value', '-1').wait(1000)
    cy.get('#takeOut').click().type('{downArrow}').wait(2000)
    cy.get('#takeOut').should('have.value', '-1').wait(1000)

    //Should be taking an alert || Error message
    cy.get('.border-blue-500').click().wait(1000)
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
    cy.get('.border-blue-500').click().wait(1000)
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
   cy.get('#specialRequest > .flex')
   .should('have.text', '123') //RANDOM INPUT
   cy.get('.px-8').should('have.text', 'Add Special Request(s)')
   cy.get('.w-\\[100\\%\\] > .mb-2').should('have.text', 'Others')
   cy.get('.border-blue-500').click().wait(1000)
  // Alert Message Validation
  cy.get('.Toastify__toast-body')
  .should('have.text', 'Please select or add a special request.')
  cy.get('.px-8 > .flex > .anticon > svg').click()
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
    cy.get('.border-blue-500').click().wait(500)
    cy.get('.text-sm').should('have.text', 'Select reason * is required')
    .wait(500)

   // VALIDATION OF OTHER SPECIAL CHARACTER
    cy.get('.me-1').click().wait(500)
    cy.get('.border-blue-500').click().wait(500)
    cy.get('.text-sm').should('have.text', 'Other free reason * is required')
    .wait(500)
    cy.get('.border-red-500').click().wait(500)
  });

  // PRICE OVERRIDE (Negative Testing)
  it.only("Price Override", () => {
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
    // cy.get('.border-blue-500').click().wait(500)
    // cy.get('.Toastify__toast-body').should('have.text', 'Invalid Price')
    // .wait(500)
    // cy.get('.Toastify__toast-body').click().wait(2000)
    // // BLANK OVERRIDE VALIDATION
    // cy.get('.py-3 > .undefined').click().clear()
    // cy.get('.py-3 > .undefined').should('have.value', '').wait(500)
    // cy.get('.border-blue-500').click().wait(500)
    // cy.get('.Toastify__toast-body').should('have.text', 'Please input Price')
    // cy.get('.Toastify__toast-body').click()

    // POSITIVE VALUE INPUT
    cy.get('.py-3 > .undefined')
    .realClick({force:true}).clear().realType('1000',{force:true})
    cy.get('.border-blue-500').realClick({force:true})
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Price Overridden Successfully.').wait(500)
    cy.get('.Toastify__toast-body').realClick({force:true})
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(5)')
    .should('have.text', '10000.00')
    cy.get(':nth-child(7) > .bg-green-100').realClick({force:true}).wait(500)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Item price is already overridden.').wait(500)
    cy.get('.Toastify__toast-body').realClick({force:true}).wait(2000)

    //CLICK FREE ITEM
    cy.get(':nth-child(6) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body').should('have.text', 'Error : Remove price override first.').wait(1000)
    cy.get('.Toastify__toast-body').click().wait(1000)
    //CLICK ADD-ONS
    cy.get(':nth-child(8) > .bg-green-100').click().wait(500)
    cy.get('.Toastify__toast-body').should('have.text', 'Error : Remove price override first.').wait(1000)
    cy.get('.Toastify__toast-body').click().wait(1000)
    //REMOVE PRICE OVERRIDE PRICE
    cy.get('.MuiButtonBase-root').click({force:true}).wait(1000)
    //cy.get('.Toastify__toast-body').should('have.text', 'Item price override removed')
    cy.get('.Toastify__toast-body').click({force:true}).wait(4000)
  })
  
  // ADD-ONS (Negative Testing)
  it("Add-ons", () => {
    cy.wait(4000)
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)')
    .click().wait(500)
    cy.get(':nth-child(8) > .bg-green-100').click()
    cy.get('.Toastify__toast-body')
    .should("have.text", "Error : Select item first.")
    .wait(1000).click()
    cy.get('.Toastify__toast-body').click()
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)')
    .click().wait(500)
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
    cy.get('.border-blue-500').click().wait(1000)
    cy.get('.text-sm')
    .should('have.text', 'Type of Discount * is required')
    cy.get('#discde').select('Senior').wait(1000)
    cy.get('.border-blue-500').click().wait(500)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'No item selected. Unable to proceed.')
    cy.get('.Toastify__toast-body').click().wait(1000)
    cy.get('.justify-end').should('have.text', 'Select All').wait(1000)
    cy.get('#orderitmid').click().wait(1000)
    cy.get('.justify-end').should('have.text', 'Unselect All')
    cy.get('.border-blue-500').click().wait(500)

    //VALIDATION OF DISCOUNT MODAL
    cy.get('#discountUser > :nth-child(1) > .mb-2')
    .should('have.text', 'Card Holder *')
    cy.get('#discountUser > :nth-child(2) > .mb-2')
    .should('have.text', 'Card Number *')
    cy.get('#discountUser > .flex-col > #buttons > .border-blue-500')
    .click().wait(1000)
    cy.get(':nth-child(1) > .text-sm')
    .should('have.text', 'Card Holder * is required')
    cy.get(':nth-child(2) > .text-sm')
    .should('have.text', 'Card Number * is required')
    cy.get('#cardholder').click().type('Juan Dela Cruz')
    cy.get('#cardno').click().type('114511')
    cy.get('#discountUser > .flex-col > #buttons > .border-blue-500')
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
    cy.get('.border-red-500').click().wait(1000)
  })

  // CALNCEL TRANSACTION BEFORE MAKING PAYMENT OR TRANSACTION
  it("Clear Transaction", () => {
   cy.wait(4000)
   cy.get(':nth-child(9) > .bg-red-100').click().wait(500)
   cy.get('.px-8').should('have.text', 'Confirmation').wait(500)
   cy.get('section > h1')
   .should('have.text', 'Are you sure you want to cancel this transaction?')
   .wait(500)
   cy.get('.border-blue-500').click().wait(1000)
   cy.get('.Toastify__toast-body')
   .should('have.text', 'Transaction Successfully Cancelled.')
   .wait(1000)
   cy.get('.Toastify__toast-body').click().wait(1000)

   //PAYMENT TRANASCTION
   cy.get(".px-8").should("have.text", "Select Pricelist").wait(2000);
   cy.get("#postypcde").select("Dine-In");
   cy.get("#warcde").select("Jollibee 1");
   cy.contains("Proceed").click();
   cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000);
   cy.get('.Toastify__toast-body')
   .should("have.text", "Transaction Opened Successfully.").click().wait(2000);
   cy.contains("Food").click().wait(2000);
   cy.contains("Chicken").click().wait(2000);
   cy.contains("1-pc Chickenjoy").click().wait(2000);
   cy.get('.Toastify__toast-body')
   .should("have.text", "Item Added Successfully.").wait(1000);
   cy.get('.Toastify__toast-body').click().wait(2000);

})
  // PAYMENT (Negative Testing)
  it("Payment ", () => {
   cy.wait(1000)
   cy.get(':nth-child(13) > .bg-green-100').click().wait(1000)
   cy.get('.px-8').should('be.visible')
   cy.get('.px-8').should('have.text', 'Payment')
   cy.get('.text-right > .overflow-hidden')
   .should('have.text', '₱82.79')
   cy.get('.text-red > :nth-child(2)')
   .should('have.text', '₱82.79')
   cy.get('.my-4 > :nth-child(4) > :nth-child(1) > .font-montserrat')
   .click().wait(1000)
   cy.get('.text-right > .overflow-hidden')
   .should('have.text', '₱0.00')
   cy.contains('CASH').click().wait(1000)
   cy.get('.Toastify__toast-body')
   .should('have.text', 'Error : Zero amount').wait(500)
   cy.get('.Toastify__toast-body').click()
   cy.get(':nth-child(3) > :nth-child(2) > .font-montserrat').click()
   cy.get('.my-4 > :nth-child(4) > :nth-child(2) > .font-montserrat')
   .click()
   cy.contains('CASH').click().wait(500)
   cy.get('.bg-black\\/75 > .shadow-lg > .px-8')
   .should('have.text', 'CASH Payment')
   cy.get('.underline').should('have.text', '₱80.00')
   cy.get('.border-blue-500').click().wait(1000)
   cy.get('.flex-row > :nth-child(1)').should('have.text', 'CASH')
   cy.get('.me-1').should('have.text', '80.00')
   cy.get('.ml-5 > .mb-5 > :nth-child(1) > :nth-child(1)')
   .should('have.text', 'Paid')
   cy.get('.ml-5 > .mb-5 > :nth-child(1) > :nth-child(2)')
   .should('have.text', '₱80.00')
   cy.get('.mb-5 > :nth-child(2) > :nth-child(1)')
   .should('have.text', 'Balance')
   cy.get('.mb-5 > :nth-child(2) > :nth-child(2)')
   .should('have.text', '₱2.79')
   cy.get('.mb-5 > :nth-child(3) > :nth-child(1)')
   .should('have.text', 'Change')
   cy.get('.mb-5 > :nth-child(3) > :nth-child(2)')
   .should('have.text', '₱0.00')
  // PRESSING A VALUE WORTH 100 PESOS
   cy.get('.my-4 > :nth-child(1) > :nth-child(1) > .font-montserrat').click()
   cy.get('.my-4 > :nth-child(4) > :nth-child(2) > .font-montserrat').click()
   cy.get('.my-4 > :nth-child(4) > :nth-child(2) > .font-montserrat').click()

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
   cy.get('.Toastify__toast-body')
   .should('have.text', 'Error : Amount exceeds the balance').wait(500)
   cy.get('.Toastify__toast-body').click()

   cy.contains('OTHER PAYMENT').click().wait(500) //OTHER PAYMENT
   cy.get('.Toastify__toast-body')
   .should('have.text', 'Error : Amount exceeds the balance').wait(500)
   cy.get('.Toastify__toast-body').click()

  // SELECT PRINT TRANSACTION EVEN IF THERE'S STILL BALANCE.
   cy.get('.my-5 > .grid > :nth-child(1)').click().wait(500)
   cy.get('.Toastify__toast-body')
   .should('have.text', 'Error: There is unpaid balance.').wait(500)
   cy.get('.Toastify__toast-body').click()
  // ANOTHER CASH PAYMENT (100 Pesos)
   cy.get('#changeQuantity > :nth-child(1) > :nth-child(1) > .w-\\[300px\\] > .grid > :nth-child(1)').click().wait(500)

  //MODAL CASH PAYMENT VALIDATION
   cy.get('p.text-red-500')
   .should('have.text', 'Confirm Amt Received')
   cy.get('.underline').should('have.text', '₱100.00')
   cy.get('#cashform > :nth-child(1) > .mb-2')
   .should('have.text', 'Customer Name')
   cy.get(':nth-child(2) > .mb-2')
   .should('have.text', 'Address')
   cy.get(':nth-child(3) > .mb-2')
   .should('have.text', 'Contact No.')
   cy.get(':nth-child(4) > .mb-2')
   .should('have.text', 'Tin #')
   cy.get('.border-blue-500').click()
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
  //DELETE PAYMENTS (100.00 AND THEN 80.00)
   cy.get('.flex.text-sm > .flex-col > :nth-child(2) > .flex > .anticon > svg')
   .click()
   cy.get('.flex.text-sm > .flex-col > :nth-child(1) > .flex > .anticon > svg')
   .click()
  //CLOSE MODAL
   cy.get('.px-8 > .flex > .anticon > svg').click()
})
  
  //PAYMENT TRANASCTION FOR VOID AND REFUND
  it("Payment transaction for void and refund", () => {
    cy.wait(2000)
    cy.get(':nth-child(13) > .bg-green-100').click().wait(2000);
    cy.get('.px-8').should('be.visible');
    cy.get('.px-8').should('have.text', 'Payment');
    cy.contains('CASH').click().wait(1000);
    cy.get('.bg-black\\/75 > .shadow-lg > .px-8 > .flex')
    .should('have.text', 'CASH Payment')
    cy.get('p.text-red-500')
    .should('have.text', 'Confirm Amt Received')
    cy.get('.underline')
    .should('have.text', '₱82.79')
    cy.get('.border-blue-500').click().wait(1000)
    cy.get('.my-5 > .grid > :nth-child(1)').click().wait(500)
    cy.get('#postTransactionV2').should('have.text', 'Transaction Complete.')
  })


  // OPEN NEW TRANSACTION FOR (VOID, REFUND, REPRINTS)
  it("Open new transaction", () => {
    cy.wait(1000)
    cy.get(".px-8").should("have.text", "Select Pricelist");
    cy.get("#postypcde").select("Dine-In");
    cy.get("#warcde").select("Jollibee 1");
    cy.contains("Proceed").click();
    cy.url({ timeout: 10000 }).should("contain", "/pages/ordering").wait(2000);
    cy.get('.Toastify__toast-body')
    .should("have.text", "Transaction Opened Successfully.").click().wait(2000);
    })


  // REPRINT TRANASCTION NEGATIVE TESTING
  it("Reprint Tranasction", () => {
    cy.wait(2000)
    cy.get(':nth-child(10) > .bg-green-100').click().wait(1000)
    cy.get('.px-8').should('be.visible')
    cy.get('.px-8').should('have.text', 'Reprint Transaction')
    cy.get('.mx-2 > .py-3 > .mb-2')
    .should('have.text', 'Date From:')
    cy.get('#from').click().type('2024-06-04').wait(500)
    cy.get(':nth-child(2) > .py-3 > .mb-2').wait(500)
    .should('have.text', 'Date To:').wait(500)
    cy.get('#to').click().type('2024-04-04').wait(500)
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
    cy.get('.max-h-\\[500\\] > section > .flex-col > :nth-child(1) > :nth-child(1)')
    .should('have.text', 'OR-0000000000000001')
    cy.get('.max-h-\\[500\\] > section > .flex-col > :nth-child(1) > :nth-child(2)')
    .should('have.text', '76.00')
    cy.get('.max-h-\\[500\\] > section > .flex-col > :nth-child(1)')
    .click().wait(500)
    cy.get('.bg-black\\/75 > .shadow-lg > .px-8')
    .should('have.text', 'Set void reason')
    cy.get('.p-1 > .mb-2').should('have.text', 'Select reason *')
    cy.get('.m-0').should('have.text', 'Others')
    cy.get('.w-\\[100\\%\\] > .mb-2').should('have.text', 'Other void reason *')
    cy.get('.border-blue-500').click().wait(1000)
    cy.get('.text-sm').should('have.text', 'Select reason * is required')
    cy.get('.me-1').click().wait(1000) //CHECK THE CHECKBOX
    cy.get('.border-blue-500').click().wait(1000)
    cy.get('.text-sm').should('have.text', 'Other void reason * is required')
    cy.get('.me-1').click().wait(1000) //UNCHECK THE CHECKBOX
    cy.get('#voidreason').select('Incorrect Order Entry').wait(1000)
    cy.get('.border-blue-500').click().wait(2000)
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Transaction Void Successful').wait(500)
    cy.get('.Toastify__toast-body').click().wait(1000)
  })

    // REFUND TRANASCTION
  it("Refund Transaction", () => {
    cy.get(':nth-child(15) > .bg-orange-100').click()
    cy.get('.px-8').should('have.text', 'Authorized User Only')
    cy.get('#usrcde').click().type('lstv')
    cy.get('#usrpwd').click().type('lstventures')
    cy.get('.sc-guDLey').click().wait(500)
    cy.get('.Toastify__toast-body').should('have.text', 'Authorized!')
    .wait(1000)
    cy.get('.Toastify__toast-body').click()
    cy.get('.px-8').should('have.text', 'Refund Transaction')
    cy.get('.p-1 > .mb-2').should('have.text', 'Select reason *')
    cy.get('.w-\\[100\\%\\] > .mb-2')
    .should('have.text', 'Other refund reason *')
    cy.get('.border-blue-500').click()
    cy.get('.text-sm').should('have.text', 'Select reason * is required')
    cy.get('.me-1').click()
    cy.get('.border-blue-500').click()
    cy.get('.text-sm').should('have.text', 'Other refund reason * is required')
    cy.get('.me-1').click()
    cy.get('#refundreason').select('Food Quality Issue')
    cy.get('.border-blue-500').click()


    // VALIDATE REFUND MODAL
    cy.get('.px-8').should('have.text','REF-0000000000000001')
    cy.get('.justify-between > .group').should('have.text', 'Search OR')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(1)').should('have.text', 'Action')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(2)').should('have.text', 'ITEM')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(3)').should('have.text', 'OR #')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(4)').should('have.text', 'QTY TO RETURN')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(5)').should('have.text', 'AMT TO REFUND')
    cy.get('button > .group').click().wait(1000)
    cy.get('.Toastify__toast-body').should('have.text', 'No item(s) to refund.')
    cy.wait(2000)
    cy.get('.justify-between > .group').click()
    cy.get('.px-8').should('have.text', 'Search OR')
    cy.get('.h-\\[82vh\\] > .flex-col > :nth-child(1) > :nth-child(1)')
    .should('have.text', 'OR-0000000000000002')
    cy.get('.h-\\[82vh\\] > .flex-col > :nth-child(1) > :nth-child(2)')
    .should('have.text', '76.00')
    cy.get('.h-\\[82vh\\] > .flex-col > :nth-child(1) > :nth-child(1)').click()
    cy.get('.px-8').should('have.text', 'OR-0000000000000002')
    cy.get('.MuiTableCell-alignLeft')
    .should('have.text', 'ITEM')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(2)')
    .should('have.text', 'QTY')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(3)')
    .should('have.text', 'QTY TO RETURN')
    cy.get('.h-full > .MuiPaper-root > .MuiTable-root > .MuiTableHead-root > .MuiTableRow-root > :nth-child(4)')
    .should('have.text', 'AMT TO REFUND')
    cy.get('.css-1ex1afd-MuiTableCell-root')
    .should('have.text', '1-pc Chickenjoy')

    cy.get('#refundqty').click().clear().type('1')
    cy.get('#refundqty').should('have.value', '1')
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should('have.text', '76.00')
    cy.get('#refundqty').click().clear()

    cy.get('#refundqty').click().clear().type('2')
    cy.get('#refundqty').should('have.value', '1')
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should('have.text', '76.00')
    cy.get('#refundqty').click({force:true}).clear()
    
    cy.get('#refundqty')
    .click({force:true}).clear().type('3',{force:true})
    cy.get('#refundqty').should('have.value', '1')
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should('have.text', '76.00')
    cy.get('#refundqty').click({force:true}).clear()
    // NEXT BUTTON
    cy.get('.h-\\[82vh\\] > .h-full > .group').click({force:true})
    cy.get('.Toastify__toast-body').should('have.text', 'No item(s) added.')
    cy.get('.justify-between > .group')
    .click()
    cy.get('.h-\\[82vh\\] > .flex-col > .flex > :nth-child(1)')
    .click({force:true})
    cy.get('#refundqty')
    .click({force:true}).type('1',{force:true})
    cy.get('.h-\\[82vh\\] > .h-full > .group').click({force:true})
    cy.get('.Toastify__toast-body')
    .should('have.text', 'Added item(s) successful.')
    cy.get('.h-full > .justify-between > .font-bold')
    .should('have.text', 'TOTAL : 76.00')
    cy.get(':nth-child(3) > .group').click({force:true})
    cy.get('.bg-black\\/75 > .rounded > .px-8')
    .should('have.text', 'Mode of Refund')
    cy.get('.py-3 > :nth-child(2)').should('have.text', 'CASH')
    cy.get('.py-3 > :nth-child(3)').should('have.text', 'CHECK')
    cy.get('.py-3 > :nth-child(4)').should('have.text', 'DEBIT CARD')
    cy.get('.py-3 > :nth-child(5)').should('have.text', 'CREDIT CARD')
    cy.get('.py-3 > :nth-child(6)').should('have.text', 'OTHER PAYMENT')
    cy.get('.max-h-\\[450px\\] > :nth-child(1) > .group').click({force:true}).wait(1000)
    cy.get('.Toastify__toast-body').should('have.text', 'Transaction Refunded.')
  })

  // REPRINT VOID TRANASACTION
  it("Reprint Void Transaction", () => {
    cy.wait(1000)
    cy.get(':nth-child(11) > .bg-green-100').click()
    cy.wait(1000)
    cy.get('.px-8').should('be.visible')
    cy.get('.px-8').should('have.text', 'Reprint Void Transaction')
    cy.get('.overflow-y-auto > .flex > :nth-child(1)')
    .should('have.text', 'OR-0000000000000001')
    cy.get('.overflow-y-auto > .flex > :nth-child(2)')
    .should('have.text', '76.00')
    cy.get('.px-8 > .flex > .anticon > svg').click()
    cy.wait(1000)
  })

  // REPRINT REFUND TRANSACTION
  it("Reprint Refund Transaction", () => {
    cy.wait(1000)
    cy.get('.grid > :nth-child(12)').click()
    cy.get('.px-8').should('be.visible')
    cy.get('.px-8').should('have.text', 'Reprint Refund Transaction')
    cy.get('.max-h-\\[500\\] > section > .flex-col > .flex > :nth-child(1)')
    .should('have.text', 'OR-0000000000000002')
    cy.get('.max-h-\\[500\\] > section > .flex-col > .flex > :nth-child(2)')
    .should('have.text', '76.00')
    cy.wait(2000)
    cy.get('.px-8 > .flex > .anticon > svg').click()
  })
})
