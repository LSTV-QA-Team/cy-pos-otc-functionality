let assertionResults = [];
let failureMessages = [];

describe("Cash Declaration", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login('lstv', 'lstventures');
  });

  it("Cash Declaration Click ", () => {

    cy.get(":nth-child(2) > .sc-beySPh").click().wait(2000);
    //5. Click Cash Declaration Button
    //5.1 Check if the Cash Declaration Button is enable
    cy.contains("Cash Declaration").should("be.enabled").click().wait(1000);
    //5.2 Check if the modal will show upon clicking Cash Declaration
    cy.contains("Cash Declaration")
      .should("have.text", "Cash Declaration")
      .wait(1000);

    //5.2.1 Click the arrow up in field of 0.05.
    cy.get(
      ":nth-child(1) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.2 Check if the total is 0.05
    cy.get(".button").should("have.value", "₱0.05");
    //5.2.3 Click the arrow down in field of 0.05.
    cy.get(
      ":nth-child(1) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.4 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.5 Click the arrow up in field of 0.10
    cy.get(
      ":nth-child(2) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.6 Check if the total is 0.10
    cy.get(".button").should("have.value", "₱0.10");
    //5.2.7 Click the arrow down in field of 0.10
    cy.get(
      ":nth-child(2) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.8 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.9 Click the arrow up in field of 0.25
    cy.get(
      ":nth-child(3) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.10 Check if the total is 0.25
    cy.get(".button").should("have.value", "₱0.25");
    //5.2.11 Click the arrow down in field of 0.25
    cy.get(
      ":nth-child(3) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.12 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.13 Click the arrow up in field of 1.00
    cy.get(
      ":nth-child(4) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.14 Check if the total is 1.00
    cy.get(".button").should("have.value", "₱1.00");
    //5.2.15 Click the arrow down in field of 1.00
    cy.get(
      ":nth-child(4) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.16 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.17 Click the arrow up in field of 5.00
    cy.get(
      ":nth-child(5) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.18 Check if the total is 5.00
    cy.get(".button").should("have.value", "₱5.00");
    //5.2.19 Click the arrow down in field of 5.00
    cy.get(
      ":nth-child(5) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.20 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.21 Click the arrow up in field of 10.00
    cy.get(
      ":nth-child(6) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.22 Check if the total is 10.00
    cy.get(".button").should("have.value", "₱10.00");
    //5.2.23 Click the arrow down in field of 10.00
    cy.get(
      ":nth-child(6) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.24 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.25 Click the arrow up in field of 20.00
    cy.get(
      ":nth-child(7) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.26 Check if the total is 20.00
    cy.get(".button").should("have.value", "₱20.00");
    //5.2.27 Click the arrow down in field of 20.00
    cy.get(
      ":nth-child(7) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.28 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.29 Click the arrow up in field of 50.00
    cy.get(
      ":nth-child(8) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.30 Check if the label is 50.00
    cy.get(".button").should("have.value", "₱50.00");
    //5.2.31 Click the arrow down in field of 50.00
    cy.get(
      ":nth-child(8) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.32 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.33 Click the arrow up in field of 100.00
    cy.get(
      ":nth-child(9) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.34 Check if the total is 100.00
    cy.get(".button").should("have.value", "₱100.00");
    //5.2.35 Click the arrow down in field of 100.00
    cy.get(
      ":nth-child(9) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.36 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.37 Click the arrow up in field of 200.00
    cy.get(
      ":nth-child(10) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.38 Check if the total is 200.00
    cy.get(".button").should("have.value", "₱200.00");
    //5.2.39 Click the arrow down in field of 200.00
    cy.get(
      ":nth-child(10) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.40 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.41 Click the arrow up in field of 500.00
    cy.get(
      ":nth-child(11) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.42 Check if the total is 500.00
    cy.get(".button").should("have.value", "₱500.00");
    //5.2.43 Click the arrow down in field of 500.00
    cy.get(
      ":nth-child(11) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.44 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.2.45 Click the arrow up in field of 1000.00
    cy.get(
      ":nth-child(12) > .text-black-1000 > .arrow-container > .anticon-arrow-up"
    )
      .click()
      .wait(1000);
    //5.2.46 Check if the total is 1000.00
    cy.get(".button").should("have.value", "₱1,000.00");
    //5.2.47 Click the arrow down in field of 1000.00
    cy.get(
      ":nth-child(12) > .text-black-1000 > .arrow-container > .anticon-arrow-down"
    )
      .click()
      .wait(1000);
    //5.2.48 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");

    cy.checkForFailure(assertionResults, failureMessages)

  });

  it("Cash Declaration Type ", () => {
    // cy.contains("Cash Declaration").should("be.enabled").click().wait(1000);
    //5.3.1 Insert "1" value
    cy.get(":nth-child(1) > .text-black-1000 > .w-10").click().type("1");
    //5.3.2 Check if the total is 0.05
    cy.get(".button").should("have.value", "₱0.05");
    //5.3.3 Remove "1" value
    cy.get(":nth-child(1) > .text-black-1000 > .w-10").clear();
    //5.3.4 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.5 Insert "1" value
    cy.get(":nth-child(2) > .text-black-1000 > .w-10").click().type("1");
    //5.3.6 Check if the total is 0.10
    cy.get(".button").should("have.value", "₱0.10");
    //5.3.7 Remove "1" value
    cy.get(":nth-child(2) > .text-black-1000 > .w-10").clear();
    //5.3.8 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.9 Insert "1" value
    cy.get(":nth-child(3) > .text-black-1000 > .w-10").click().type("1");
    //5.3.10 Check if the total is 0.25
    cy.get(".button").should("have.value", "₱0.25");
    //5.3.11 Remove "1" value
    cy.get(":nth-child(3) > .text-black-1000 > .w-10").clear();
    //5.3.12 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.13 Insert "1" value
    cy.get(":nth-child(4) > .text-black-1000 > .w-10").click().type("1");
    //5.3.14 Check if the total is 1.00
    cy.get(".button").should("have.value", "₱1.00");
    //5.3.15 Remove "1" value
    cy.get(":nth-child(4) > .text-black-1000 > .w-10").clear();
    //5.3.16 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.17 Insert "1" value
    cy.get(":nth-child(5) > .text-black-1000 > .w-10").click().type("1");
    //5.3.18 Check if the total is 5.00
    cy.get(".button").should("have.value", "₱5.00");
    //5.3.19 Remove "1" value
    cy.get(":nth-child(5) > .text-black-1000 > .w-10").clear();
    //5.3.20 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.21 Insert "1" value
    cy.get(":nth-child(6) > .text-black-1000 > .w-10").click().type("1");
    //5.3.22 Check if the total is 10.00
    cy.get(".button").should("have.value", "₱10.00");
    //5.3.23 Remove "1" value
    cy.get(":nth-child(6) > .text-black-1000 > .w-10").clear();
    //5.3.24 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.25 Insert "1" value
    cy.get(":nth-child(7) > .text-black-1000 > .w-10").click().type("1");
    //5.3.26 Check if the total is 20.00
    cy.get(".button").should("have.value", "₱20.00");
    //5.3.27 Remove "1" value
    cy.get(":nth-child(7) > .text-black-1000 > .w-10").clear();
    //5.3.28 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.29 Insert "1" value
    cy.get(":nth-child(8) > .text-black-1000 > .w-10").click().type("1");
    //5.3.30 Check if the total is 50.00
    cy.get(".button").should("have.value", "₱50.00");
    //5.3.31 Remove "1" value
    cy.get(":nth-child(8) > .text-black-1000 > .w-10").clear();
    //5.3.32 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.33 Insert "1" value
    cy.get(":nth-child(9) > .text-black-1000 > .w-10").click().type("1");
    //5.3.34 Check if the total is 100.00
    cy.get(".button").should("have.value", "₱100.00");
    //5.3.35 Remove "1" value
    cy.get(":nth-child(9) > .text-black-1000 > .w-10").clear();
    //5.3.36 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.37 Insert "1" value
    cy.get(":nth-child(10) > .text-black-1000 > .w-10").click().type("1");
    //5.3.38 Check if the total is 200.00
    cy.get(".button").should("have.value", "₱200.00");
    //5.3.39 Remove "1" value
    cy.get(":nth-child(10) > .text-black-1000 > .w-10").clear();
    //5.3.40 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.41 Insert "1" value
    cy.get(":nth-child(11) > .text-black-1000 > .w-10").click().type("1");
    //5.3.42 Check if the total is 500.00
    cy.get(".button").should("have.value", "₱500.00");
    //5.3.43 Remove "1" value
    cy.get(":nth-child(11) > .text-black-1000 > .w-10").clear();
    //5.3.44 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");
    //5.3.17 Insert "1" value
    cy.get(":nth-child(12) > .text-black-1000 > .w-10").click().type("1");
    //5.3.18 Check if the total is 1000.00
    cy.get(".button").should("have.value", "₱1,000.00");
    //5.3.19 Remove "1" value
    cy.get(":nth-child(12) > .text-black-1000 > .w-10").clear();
    //5.3.20 Check if the total is 0.00
    cy.get(".button").should("have.value", "₱0.00");


    //5.4 Check if the clear button is functioning. It should clear the input data upon clicking 
    cy.contains("Clear").click()
    cy.get(".button").should("have.value", "₱0.00").wait(2000)
    //5.5 Check if the Cancel button is functioning. It should close the modal upon clicking

    cy.contains("Cancel").click().wait(1000)
    cy.contains("Yes").click().wait(1000)

  })

  it("Inputing of Data", () => {

    cy.wait(8000)

    cy.get(":nth-child(2) > .sc-beySPh").click().wait(2000);    
    //5.6 Click Cash Declaration Button
    //5.6.1 Check if the Cash Declaration button is enable
    cy.contains("Cash Declaration").should("be.enabled").click()
    //5.6.2 Click or type numbers on the designated textfield ( 5 in 1000 and 1 in 100 )
    cy.get(":nth-child(12) > .text-black-1000 > .w-10").click().type("5").wait(2000)
    cy.get(":nth-child(9) > .text-black-1000 > .w-10").click().type("1").wait(2000);
    cy.get(".button").should("have.value", "₱5,100.00").wait(2000)
    cy.contains("Save").click()
    cy.contains("Transaction Success").should("have.text" , "Transaction Success").wait(1000)

  })

})
