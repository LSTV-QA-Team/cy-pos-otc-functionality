let assertionResults = [];
let failureMessages = [];

describe('System Parameters', () => {


    before(() => {
        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-systemparam-data')
        cy.execute('npm run sheet-converter systemparam-selector-assert')
        cy.wait(4000)

    });
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login('lstv', 'lstventures')


    });
    it('Check System Parameters Page', () => {   

        cy.navigateToModule('Master File', 'System Parameters')

        cy.url({timeout: 10000})
            .should('contain', 'masterfile/systemParameters/?menfield=masterfile_system_parameters')

        cy.checkElementVisibility('.shadow-lg', '1.2', 'Upon Navigating to System Parameters:', 'The "System Parameters" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle('.px-8','1.2.1', 'Upon Navigating to System Parameters pager U/I', 'System Parameters', assertionResults, failureMessages)

        cy.wait(2000)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        // cy.validateElements('systemparam-selector-assert.json', '1.2.5', 'Upon Navigating to System Parameters pager U/I', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Operation Time Set', () => {
        cy.get('#timestart').click()
            .clear()
            .type('09:00')
            .should('have.value', '09:00')

        cy.get('.border-blue-500').click()

        cy.checkLabelCaption('.Toastify__toast-body', '3.1', 'Upon Clicking the "Update" button:', 'Successfully updated', assertionResults, failureMessages) 
    });
})