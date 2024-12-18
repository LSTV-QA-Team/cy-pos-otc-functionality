let assertionResults = []
let failureMessages = []

describe("Ordering1.2", () => {
  beforeEach(() => {
    cy.wait(6000)
    // reset for each test case
    assertionResults = []
    failureMessages = []


    cy.login("lstv", "lstventures")

  })
  it("Select Pricelist Modal ", () => {
    cy.wait(6000)
    cy.get(':nth-child(3) > .sc-blHHSb').click().wait(2000)
  })

  it("Reprint Transaction", () => {

    cy.get(":nth-child(10) > .bg-green-100").click()
    cy.get(".px-8").should("have.text", "Reprint Transaction")
    cy.get('.mx-2 > .py-3 > .ant-picker').click().type("2024-05-01")
    cy.get(':nth-child(2) > .py-3 > .ant-picker').click().type("2024-06-30")

    cy.get(".px-8 > .flex > .anticon > svg").click()
  })

  it("Reprint Void", () => {
    cy.wait(6000)
    cy.get(":nth-child(11) > .bg-green-100").click()
    cy.get(".px-8").should("have.text", "Reprint Void Transaction")
    cy.get(".px-8 > .flex > .anticon > svg").click()
  })

 it("Void Transaction" , () => {
  cy.wait(6000) 

  cy.get(':nth-child(14) > .bg-orange-100').click()
    cy.get('.px-8').should("have.text" , "Void Transaction")
    cy.contains("INV-0000000000000001").should("have.text" , "INV-0000000000000001")
    cy.get(".px-8 > .flex > .anticon > svg").click()

 })

 it("Other Transaction - RECALL" , () => {
  cy.wait(6000)
  cy.contains("Other Transaction").click()
  cy.get('.px-8').should("have.text" , "Other Transaction")
  cy.contains("Recall Transaction").click()
  cy.contains("SEQ-00000000").click()

 })

})
