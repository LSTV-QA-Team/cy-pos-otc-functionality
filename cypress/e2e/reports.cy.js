describe("Reports", () => {
  it("Reports", () => {
    cy.login("lstv", "lstventures");

    cy.get(":nth-child(4) > #home-card-styled").click();

    cy.contains("Manager's Report").click({ force: true }).wait(5000);
    cy.get("#isView").click({ force: true }).wait(5000);
    cy.get("#reportType").select("Itemized");
    cy.get("#reportRepresentation").select("Detailed");
    cy.get("#pdf").click({ force: true }).wait(4000);
    cy.get("#button-form-2").click({ force: true });

    cy.wait(4000);
    cy.execute("node pdf_to_excel_report.js");
    cy.wait(5000);
    cy.execute("node excel_to_json.js");
    cy.wait(5000);
  });
});
