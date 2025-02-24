let assertionResults = [];
let failureMessages = [];

describe('Other Charges', () => {


    before(() => {

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-othercharge-data')
        cy.execute('npm run sheet-converter othercharge-el')
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

        cy.validateElements('othercharge-el.json', '1.2.2 & 1.2.3 & 1.2.5', 'Upon Navigating to Other Charges pager U/I', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Check Valid Input Functionality', () => {

        cy.fixture('master-othercharge-data.json').then((data) => {
            
            for (const key in data){

                if (data[key].forValid === true) {

                    cy.get('#takeout_scharge').clear().type(data[key].takeoutsercharge).should('have.value', data[key].takeoutsercharge + '%')

                    cy.get('#dinein_scharge').clear().type(data[key].dineinsercharge).should('have.value', data[key].dineinsercharge + '%')

                    cy.get('#localtax').clear().type(data[key].localtax).should('have.value', data[key].localtax + '%')

                    // 17.1 Check all encoded data should reflect to the receipt (Validate on Preview) 

                    cy.get('#button-form-2').click()

                    cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

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

                    cy.get('#takeout_scharge').clear()
                      .type(data[key].takeoutsercharge)

                    cy.checkValue('#takeout_scharge', '7.1', 'After Encoding in Takeout Service Charge:', data[key].checkValTakeout + '%', assertionResults,failureMessages)

                    cy.get('#dinein_scharge').clear()
                      .type(data[key].dineinsercharge)

                    cy.checkValue('#dinein_scharge', '8.1', 'After Ecnocing in Dine-In Service Charge:', data[key].checkValDine + '%', assertionResults,failureMessages)  

                    cy.get('#localtax').clear()
                      .type(data[key].localtax) 
                      
                    cy.checkValue('#localtax', '9.1', 'After Encoding in Local Tax:', data[key].checkValTax + '%', assertionResults,failureMessages)
                    
                    /* cy.get('#button-form-2').click() */

                    cy.get('#localtax').invoke('val').then(localTaxVal => {

                        cy.get('#takeout_scharge').invoke('val').then(takeoutSchargeVal => {
                            
                            cy.get('#dinein_scharge').invoke('val').then(dineinSchargeVal => {
                            
                                if (!localTaxVal && !takeoutSchargeVal && !dineinSchargeVal) {

                                    cy.log('All textboxes are empty')

                                    cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]').click()

                                } else {

                                    cy.log('One or more textboxes are not empty')

/*                                     cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)
 */
                                }
                                /* ADD ASSERTION 
                                    if the encoded data is invalid, do this; check notif "Please input valid data." 
                                    else the encoded data is valid, do this; check notif "Successfully updated"
                                */
                            })
                        })
                    })
                  
                    if (data[key].takeoutsercharge === '1000.00') {

                      cy.wait(4000)

                      cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]').click()

                    } else {

                      cy.contains('Other Charges').click()  

                    }

                }
                
            } 
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Check Required Field Functionality', () => {

        cy.get('#takeout_scharge').clear()

        cy.get('#dinein_scharge').clear()
          .type('1.00')

        cy.get('#localtax').clear()
          .type('1.00')

        cy.get('#button-form-2').click()

        cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Takeout Service Charge * is required', assertionResults, failureMessages)

        cy.get('#takeout_scharge').clear()
          .type('1.00')

        cy.get('#dinein_scharge').clear()

        cy.get('#localtax').clear()
          .type('1.00')

        cy.get('#button-form-2').click()

        cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Dine-In Service Charge * is required', assertionResults, failureMessages)

        cy.get('#takeout_scharge').clear()
          .type('1.00')

        cy.get('#dinein_scharge').clear()
          .type('1.00')

        cy.get('#localtax').clear()

        cy.get('#button-form-2').click()

        cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Local Tax * is required', assertionResults, failureMessages)

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)

    })

    it('Cancel Functionlity', () => {

        cy.get('.border-gray-300').click()

        cy.get('#warning-button-2').click()

        cy.wait(2000)

        cy.checkElementInvisibility('.shadow-lg', '38.1', 'Upon Clicking the "Cancel" button:', '"Other Charges" modal window was still visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkElementVisibility('.h-full', '38.2', 'Upon Clicking the "Cancel" button:', '"Master File Menu" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Valid Input For Transaction', () => {

      cy.contains('Other Charges').click()

      cy.fixture('master-othercharge-data.json').then((data) => {
          
          for (const key in data){

              if (data[key].forTransac === true) {

                  cy.get('#takeout_scharge').clear().type(data[key].takeoutsercharge).should('have.value', data[key].takeoutsercharge + '%')

                  cy.get('#dinein_scharge').clear().type(data[key].dineinsercharge).should('have.value', data[key].dineinsercharge + '%')

                  cy.get('#localtax').clear().type(data[key].localtax).should('have.value', data[key].localtax + '%')

                  // 17.1 Check all encoded data should reflect to the receipt (Validate on Preview) 

                  cy.get('#button-form-2').click()

                  cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                  cy.contains('Other Charges').click()
              } 
              
          } 
      })
      cy.wait(4000)

      cy.checkForFailure(assertionResults, failureMessages)
  })
})