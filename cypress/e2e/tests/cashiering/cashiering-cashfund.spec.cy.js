let assertionResults = [];
let failureMessages = [];

describe("Cash Fund", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    cy.task("queryDb", "TRUNCATE TABLE posfile")

    // Login with valid credentials
    cy.login();

    cy.get(":nth-child(2) > .sc-beySPh").click().wait(2000);
  });

  it.only("Cash Fund ", () => {
    //1.1 Click the Cashiering Button After Logging in



    //1.1 Check if the url is correct
    cy.url({ timeout: 10000 })
      .should("contain", "/pages/cashiering")
      .wait(2000);

    //1.2 Check if the Cashering button is Visible and enable , If yes Click the following:
    //1.2.1 Check if the Cash Fund Button is enable

    cy.contains("Cash Fund").should('be.enabled').wait(2000)

    //1.2.2 Check if the Cash in button is disabled
    cy.contains("Cash In").should('not.be.enabled').wait(2000)

    //1.2.3 Check if the Cash Out Button is disabled
    cy.contains("Cash Out").should('not.be.enabled').wait(2000)

    //1.2.4 Check if the Cash Declaration Button is disabled
    cy.contains("Cash Declaration").should('not.be.enabled').wait(2000)

    //2. Click Cashfund
    cy.contains("Cash Fund").should('be.enabled').click()
    //2.1 Check if the modal will show upon clicking Cash fund 
    cy.contains('Cash Fund').should('have.text','Cash Fund')


    //2.1.3 Click the number 1 button 
    //2.1.4 Check if the label is 1 
    cy.ClickingNumber1button(1)

    //2.1.5 Click the number 2 button 
    //2.1.6 Check if the label is 12
    cy.ClickingNumber2button(2)

    //2.1.7 Click the number 3 button 
    //2.1.8 Check if the label is 123
    cy.ClickingNumber3button(3)

    //2.1.9 Click the number 4 button 
    //2.1.10 Check if the label is 1,234
    cy.ClickingNumber4button(4)

    //2.1.11 Click the number 5 button 
    //2.1.12 Check if the label is 12,345
    cy.ClickingNumber5button(5)

    //2.1.13 Click the number 6 button 
    //2.1.14 Check if the label is 123,456
    cy.ClickingNumber6button(6)

    //2.1.15 Click the number 7 button 
    //2.1.16 Check if the label is 1,234,567
    cy.ClickingNumber7button(7)

    //2.1.17 Click the number 8 button 
    //2.1.18 Check if the label is 12,345,678
    cy.ClickingNumber8button(8)

    //2.1.19 Click the number 9 button 
    //2.1.20 Check if the label is 123,456,789
    cy.ClickingNumber9button(9)

    //2.1.21 Click the number 0 button 
    //2.1.22 Check if the label is 1,234,567,890
    cy.ClickingNumber0button(0)

    //2.1.23 Click the C Button
    //2.1.24 Check if the label is 123,456,789
    cy.ClickingCbutton('C')

    //2.1.25 Click the . Button 
    //2.1.26 Check if the label is 123456789.50
    cy.ClickingDotbutton(".")

    //2.1.27 Check if the clear button is functioning. It should clear the input data upon clicking 
    cy.ClickingClearbutton('Clear')
    //2.1.28 Check if the Cancel button is functioning. It should show the confirmation message of canceling the cashfund 
    cy.contains('Cancel').click().wait(1000)
    cy.contains('Yes').click().wait(1000)


  }) 

  it('Inputing Data', () => {


    // 2.2 Click Cash Fund 
    cy.contains("Cash Fund").should('be.enabled').click()
    //2.2.1 Click number 5 button and 0 three times to input 5000 in cash fund
    cy.get('.my-4 > :nth-child(2) > :nth-child(2) > .font-montserrat').click().wait(500)
    for (let i = 0; i < 3; i++){
      cy.get(':nth-child(4) > :nth-child(2) > .font-montserrat').click()
    }
    cy.contains('Save').click()
    cy.contains('Transaction Success').should('have.text',"Transaction Success").wait(1000)



  

  });
});
