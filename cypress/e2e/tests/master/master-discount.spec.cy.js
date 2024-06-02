let assertionResults = [];
let failureMessages = [];

describe('Discounts', () => {

    before(() => {

        cy.task("queryDb","TRUNCATE TABLE discountfile")

        cy.task("queryDb", "SELECT * FROM discountfile").then((records) => {

            expect(records.length).to.be.equal(0)

        })

        cy.task('clearDownloads')

        // Excel file to JSON Converter
        cy.wait(4000)
        // cy.execute('npm run sheet-converter master-discount-data')
        // cy.execute('npm run sheet-converter discount-selector-assert')
        // cy.execute('npm run sheet-converter discount-add-el')
        // cy.execute('npm run sheet-converter discount-edit-el')
        cy.wait(4000)

    });
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login('lstv', 'lstventures')

    })

    it('Check Discount Page', () => {  

        cy.navigateToModule('Master File', 'Discounts')

        cy.url({timeout: 10000}).should('contain', '/discount/?menfield=masterfile_discounts')

        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Discount Type Pager U/I:', '"Discount Type" pager U/I window was not visible.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Discount Type pager U/I', 'Discount Type', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Discount Type pager U/I', assertionResults, failureMessages)

        // cy.validateElements('discount-selector-assert.json', '1.2.5', 'Upon Navigating to Discount Type pager U/I:', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    }) 
})
