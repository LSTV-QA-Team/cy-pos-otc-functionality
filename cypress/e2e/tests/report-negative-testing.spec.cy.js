let assertionResults = [];
let failureMessages = [];

describe("Reports Negative Testing", () => {
  beforeEach(() => {
    // reset for each test case
    assertionResults = [];
    failureMessages = [];

    // Login with valid credentials
    cy.login("lstv", "lstventures");
  });

  it("X-Reading", () => {
    cy.get(":nth-child(4) > .sc-beySPh").click().wait(1000);

    // Click the X reading without performing Cash Declaration
    cy.contains("X-Reading").click().wait(2000);
    cy.get(".px-8").should("have.text", "X-Reading").wait(2000);
    cy.get(".text-red-500").should(
      "have.text",
      "Cash Declaration has not been performed!"
    );
  });

  it("Z-Reading", () => {
    cy.get(".px-8 > .flex > .anticon > svg").click();
    // Click the Z reading without performing Cash Declaration
    cy.contains("Z-Reading").click().wait(2000);
    cy.get(".px-8").should("have.text", "Z-Reading").wait(2000);
    cy.get(".text-red-500").should(
      "have.text",
      "Cash Declaration has not been performed!"
    );
  });

  it.only("Managers Report", () => {
    //cy.get(".px-8 > .flex > .anticon > svg").click();
    cy.contains("Manager's Report").click().wait(1000);

    //Click the Generate Report without selecting any report type
    cy.get(".border-blue-500").click().wait(2000);
    //It should validate "Report Type (Required *) is required"
    cy.get(".text-sm")
      .should("have.text", "Report Type (Required *) is required")
      .wait(2000);

    cy.get("#reportType").select("Itemized").wait(2000);
    cy.get(".border-blue-500").click();
    //Check if the Report Representation field if visible
    cy.get(".pt-2 > .mb-2")
      .should("have.text", "Report Representation (Required *)")
      .wait(2000);
    //It should validate "Report Representation (Required *) is required"
    cy.get(".text-sm")
      .should("have.text", "Report Representation (Required *) is required")
      .wait(2000);
    cy.get(".px-8 > .flex > .anticon > svg").click();

    cy.contains("Manager's Report").click();
    cy.get("#reportType").select("Class and subclass").wait(2000);
    cy.get("#startDate").clear(2000);
    cy.get(".border-blue-500").click();
    cy.get(".text-sm").should("have.text", "Start (Required *) is required");
    cy.get("#endDate").clear(2000);
    cy.get(".border-blue-500").click();
    cy.get(":nth-child(4) > .text-sm").should(
      "have.text",
      "End (Required *) is required"
    );

    cy.get("#startDate").click().type("AAAA-BB-CC").wait(2000);
    cy.get("#startDate").should("have.text", "");
  });
});
