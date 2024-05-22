let assertionResults = [];
let failureMessages = [];

describe("Cash In", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login();

    cy.get(":nth-child(2) > .sc-beySPh").click().wait(2000);
  });

  it("Cash In ", () => {
    //3.Click Cash In Button
    //3.1 Check if the Cash In Button is enable
    cy.contains("Cash In").click().wait(1000);
    //3.2 Check if the modal will show upon clicking Cash In
    cy.contains("Cash In").should("have.text", "Cash In").wait(1000);

    //3.1.3 Click the number 1 button
    //3.1.4 Check if the label is 1
    cy.ClickingNumber1button(1);

    //3.1.5 Click the number 2 button
    //3.1.6 Check if the label is 12
    cy.ClickingNumber2button(2);

    //3.1.7 Click the number 3 button
    //3.1.8 Check if the label is 123
    cy.ClickingNumber3button(3);

    //3.1.9 Click the number 4 button
    //3.1.10 Check if the label is 1,234
    cy.ClickingNumber4button(4);

    //3.1.11 Click the number 5 button
    //3.1.12 Check if the label is 12,345
    cy.ClickingNumber5button(5);

    //3.1.13 Click the number 6 button
    //3.1.14 Check if the label is 123,456
    cy.ClickingNumber6button(6);

    //3.1.15 Click the number 7 button
    //3.1.16 Check if the label is 1,234,567
    cy.ClickingNumber7button(7);

    //3.1.17 Click the number 8 button
    //3.1.18 Check if the label is 12,345,678
    cy.ClickingNumber8button(8);

    //3.1.19 Click the number 9 button
    //3.1.20 Check if the label is 123,456,789
    cy.ClickingNumber9button(9);

    //3.1.21 Click the number 0 button
    //3.1.22 Check if the label is 1,234,567,890
    cy.ClickingNumber0button(0);

    //3.1.23 Click the C Button
    //3.1.24 Check if the label is 123,456,789
    cy.ClickingCbutton("C");

    //3.1.25 Click the . Button
    //3.1.26 Check if the label is 123456789.50
    cy.ClickingDotbutton(".");

    //3.1.27 Check if the clear button is functioning. It should clear the input data upon clicking
    cy.ClickingClearbutton("Clear");
    //3.1.28 Check if the Cancel button is functioning. It should show the confirmation message of canceling the cashfund
    cy.contains("Cancel").click().wait(1000);
    cy.contains("Yes").click().wait(1000);

    cy.checkForFailure(assertionResults, failureMessages)

  });

  it("Inputing Data", () => {
    //3. Click the Cash in Button
    cy.contains("Cash In").should("be.enabled").click().wait(1000);
    //3.3.1 Click number 2 button and 0 two times to input 200 in cash in
    cy.get(".my-4 > :nth-child(1) > :nth-child(2) > .font-montserrat")
      .click()
      .wait(1000);
    for (let i = 0; i < 2; i++) {
      cy.get(":nth-child(4) > :nth-child(2) > .font-montserrat").click();
    }
    //3.3.2 Click the Save button to save the cash In
    cy.contains("Save").wait(1000).click();
    //3.3.3 Fill up the Cash in Reason Modal
    cy.get("#isCustom").click().wait(1000);
    cy.get("#reason > div.py-3").eq(1)
      .click()
      .realType('sad')
      .wait(1000);
    cy.contains("Confirm").click();
    cy.contains("Transaction Success").should(
      "have.text",
      "Transaction Success"
    );
  });
});
