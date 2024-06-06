let assertionResults = [];
let failureMessages = [];

describe('Other Charges', () => {


    before(() => {

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-othercharge-data')
        // cy.execute('npm run sheet-converter othercharge-selector-assert')
        cy.wait(4000)

    })
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login('lstv', 'lstventures')


    })

    it('Check Other Charges Page', () => {   

        cy.navigateToModule('Master File', 'Other Charges')

        cy.url({timeout: 10000})
            .should('contain', '/masterfile/otherCharges/?menfield=masterfile_other_charges')

        cy.checkElementVisibility('.shadow-lg', '1.2', 'Upon Navigating to "Other Charges":', '"Other Charges" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle('.px-8','1.2.1', 'Upon Navigating to "Other Charges" pager U/I', 'Other Charges', assertionResults, failureMessages)

        cy.wait(2000)

        // Check correct objects position.

        cy.validateElements('othercharge-selector-assert.json', '1.2.2 & 1.2.3 & 1.2.5', 'Upon Navigating to Other Charges pager U/I', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Check Valid Input Functionality', () => {

        cy.fixture('master-othercharge-data.json').then((data) => {
            
            for (const key in data){

                if (data[key].forValid === true) {

                    cy.wait(4000)

                    cy.get('#takeout_scharge').clear()
                      .type(data[key].takeoutsercharge)
                      .should('have.value', data[key].takeoutsercharge)

                    cy.get('#dinein_scharge')
                      .type(data[key].dineinsercharge)
                      .should('have.value', data[key].dineinsercharge)


                    cy.get('#localtax').clear()
                      .type(data[key].localtax)
                      .should('have.value', data[key].localtax)

                    // 17.1 Check all encoded data should reflect to the receipt (Validate on Preview) 

                    cy.get('.border-blue-500').click()

                    cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages)

                    cy.contains('Other Charges').click()
                } 
                
            } 
        })
        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Check Invalid Input Functionality', () => {

        cy.fixture('master-othercharge-data.json').then((data) => {

            for (const key in data){

                if (data[key].forInvalid === true) {

                    cy.wait(4000)

                    cy.wait(4000)

                    cy.get('#takeout_scharge').clear()
                      .type(data[key].takeoutsercharge)

                    cy.get('#dinein_scharge').clear()
                      .type(data[key].dineinsercharge)


                    cy.get('#localtax').clear()
                      .type(data[key].localtax)  
                    
                    cy.get('.border-blue-500').click()

                    cy.get('#localtax').invoke('val').then(localTaxVal => {

                        cy.get('#takeout_scharge').invoke('val').then(takeoutSchargeVal => {
                            
                            cy.get('#dinein_scharge').invoke('val').then(dineinSchargeVal => {
                            
                                if (!localTaxVal && !takeoutSchargeVal && !dineinSchargeVal) {

                                    cy.log('All textboxes are empty')

                                    //do nothing

                                } else {

                                    cy.log('One or more textboxes are not empty')

                                    cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon clicking the "Save" button:', 'Please input valid data.', assertionResults, failureMessages)

                                }
                            })
                        })
                    })

                }
                
            } 
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Check Required Field Functionality', () => {

        cy.contains('Other Charges').click()

        cy.get('#takeout_scharge').clear()

        cy.get('#dinein_scharge').clear()
          .type('1.00')

        cy.get('#localtax').clear()
          .type('1.00')

        cy.get('.border-blue-500').click()

        cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Takeout Service Charge * is required', assertionResults, failureMessages)

        cy.get('#takeout_scharge').clear()
          .type('1.00')

        cy.get('#dinein_scharge').clear()

        cy.get('#localtax').clear()
          .type('1.00')

        cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Dine-In Service Charge * is required', assertionResults, failureMessages)

        cy.get('#takeout_scharge').clear()
          .type('1.00')

        cy.get('#dinein_scharge').clear()
          .type('1.00')

        cy.get('#localtax').clear()

        cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Local Tax * is required', assertionResults, failureMessages)
        
        // cy.checkLabelCaption('.Toastify__toast-body', '36.1', 'Upon Clicking the "Update" button:', 'Please input valid data.', assertionResults, failureMessages)

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)

    })

    it('Cancel Functionlity', () => {
        
        // cy.contains('Other Charges').click()

        // cy.wait(4000)

        // cy.checkElementVisibility('.shadow-lg', '37.1', 'Upon Clicking the "Other Charges" in Master File Menu', '"Other Charges" modal window was not visible or active.', assertionResults, failureMessages)

        cy.get('.border-red-500').click()

        cy.checkElementInvisibility('.shadow-lg', '38.1', 'Upon Clicking the "Cancel" button:', '"Other Charges" modal window was still visible or active.', assertionResults, failureMessages)

        cy.checkElementVisibility('.h-full', '38.2', 'Upon Clicking the "Cancel" button:', '"Master File Menu" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })
})