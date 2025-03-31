let assertionResults = [];
let failureMessages = [];

describe('Receipt Footer Set Up', () => {

    before(() => {

        cy.wait(4000)
        cy.execute('npm run sheet-converter master-footer-data')
        cy.wait(4000)
    })
    
    beforeEach(() => {

        assertionResults = [];
        failureMessages = [];

        cy.login('lstv', 'lstventures')
    })

    it('Check Receipt Footer Set Up Page', () => {   

        cy.navigateToModule('Master File', 'Footer')

        cy.url({timeout: 10000}).should('contain', '/masterfile/footer/?menfield=masterfile_footer')

        cy.checkElementVisibility('.shadow-lg', '1.2', 'Upon Navigating to "Receipt Footer Set Up":', '"Receipt Footer Set Up" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle('.px-8','1.2.1', 'Upon Navigating to "Receipt Footer Set Up" pager U/I', 'Receipt Footer Set Up', assertionResults, failureMessages)

        cy.wait(2000)

        cy.validateElements('footer-selector-assert.json', '1.2.2 & 1.2.3 & 1.2.5', 'Upon Navigating to Receipt Footer Set Up pager U/I', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Check Max Length of Input Characters', () => {

        cy.fixture('master-footer-data.json').then((data) => {

            for (const key in data){

                if (data[key].forInvalid === true) {

                    cy.wait(4000)

                    cy.get('#officialreceipt').select(data[key].officialReceipt)

                    cy.get('#supname').clear()
                      .type(data[key].suppName)

                    cy.checkInputMaxLength('#supname', 50, '22.1', 'Upon Encoding in "Supplier Name" Textbox:', assertionResults, failureMessages)

                    cy.get('#supaddress').clear()
                      .type(data[key].suppAdd)

                    cy.checkInputMaxLength('#supaddress', 50, '23.1', 'Upon Encoding in "Supplier Address" Textbox:', assertionResults, failureMessages)

                    cy.get('#supvarregtin').clear()
                      .type(data[key].suppVAT)

                    cy.checkInputMaxLength('#supvarregtin', 15, '24.1', 'Upon Encoding in "Supplier VAT Registered TIN" Textbox:', assertionResults, failureMessages)

                    cy.checkValue('#supvarregtin', '24.2', 'After Encoding in "Supplier VAT Registered TIN" Textbox:', data[key].suppVATExpected, assertionResults, failureMessages)

                    cy.get('#supnonvatregtin').clear()
                      .type(data[key].suppNonVAT)
                    
                    cy.checkInputMaxLength('#supnonvatregtin', 15, '25.1', 'Upon Encoding in "Supplier Non-VAT Registered TIN" Textbox: Should be formatted', assertionResults, failureMessages)

                    cy.checkValue('#supnonvatregtin', '25.2', 'After Encoding in "Supplier Non-VAT Registered TIN" Textbox: Should be formatted"', data[key].suppNonVATExpected, assertionResults, failureMessages)

                    cy.get('#accrenum').clear()
                      .type(data[key].accredNo)

                    cy.checkInputMaxLength('#accrenum', 50, '27.1', 'Upon Encoding in "Accredited No." Textbox:', assertionResults, failureMessages)

                    cy.get(':nth-child(7) > .ant-picker > .ant-picker-input > input').clear()
                      .type(data[key].accredDate)

                    cy.get('#modal-h1').click()

                    cy.get('#permitnum').click().clear()
                      .type(data[key].permitNo)

                    cy.checkInputMaxLength('#permitnum', 50, '28.1', 'Upon Encoding in "Permit No." Textbox:', assertionResults, failureMessages)
                    
                    cy.get('#validyr').click().clear()
                      .type(data[key].yearsValidity)

                    cy.checkInputMaxLength('#validyr', 5, '29.1', 'Upon Encoding in "Years Validity" Textbox:', assertionResults, failureMessages)
                    
                    cy.get(':nth-child(10) > .ant-picker').click().clear()
                      .type(data[key].dateIssued)

                     cy.get('#modal-h1').click()

                    cy.get('#footermsg1').click().clear()
                      .type(data[key].lineMsg1)

                    cy.checkInputMaxLength('#footermsg1', 50, '31.1', 'Upon Encoding in "Line Message 1" Textbox:', assertionResults, failureMessages)

                    cy.get('#footermsg2').clear()
                      .type(data[key].lineMsg2)

                    cy.checkInputMaxLength('#footermsg2', 50, '32.1', 'Upon Encoding in "Line Message 2" Textbox:', assertionResults, failureMessages)

                    cy.get('#footermsg3').clear()
                      .type(data[key].lineMsg3)

                    cy.checkInputMaxLength('#footermsg3', 50, '33.1', 'Upon Encoding in "Line Message 3" Textbox:', assertionResults, failureMessages)

                    cy.get('#footermsg4').clear()
                      .type(data[key].lineMsg4)

                    cy.checkInputMaxLength('#footermsg4', 50, '34.1', 'Upon Encoding in "Line Message 4" Textbox:', assertionResults, failureMessages)
                        
                    cy.get('#footermsg5').clear()
                      .type(data[key].lineMsg5)
                    
                    cy.checkInputMaxLength('#footermsg5', 50, '35.1', 'Upon Encoding in "Line Message 5" Textbox:', assertionResults, failureMessages)    
                    
                    cy.get('#button-form-2').click()

                    cy.wait(2000)
                }
                
            } 
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it.skip('Check Required Field Functionality', () => {

        cy.contains('Footer').click()

        cy.wait(4000)

        // Force enable the first option
        cy.get('#officialreceipt')
          .find('option')
          .first()
          .invoke('removeAttr', 'disabled')
          .should('not.have.attr', 'disabled')
        
        cy.get('#officialreceipt').select('-- Select an option --')

        cy.get('#supname').clear()

        cy.get('#supaddress').clear()

        cy.get('#supvarregtin').clear()

        cy.get('#supnonvatregtin').clear()

        cy.get('#accrenum').clear()

        cy.get(':nth-child(7) > .ant-picker').clear()

        cy.get('#permitnum').clear()
        
        cy.get('#validyr').clear()
        
        cy.get(':nth-child(10) > .ant-picker').clear()

        cy.get('#footermsg1').clear()

        cy.get('#footermsg2').clear()

        cy.get('#footermsg3').clear()

        cy.get('#footermsg4').clear()
            
        cy.get('#footermsg5').clear()

        cy.get('#button-form-2').click()

        cy.wait(2000)

        cy.checkLabelCaption('.Toastify__toast-body', '36.1', 'Upon Clicking the "Update" button:', 'Please input valid data in required field.', assertionResults, failureMessages)

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Cancel Functionlity', () => {
        
        cy.contains('Footer').click()

        cy.wait(4000)

        cy.checkElementVisibility('.shadow-lg', '37.1', 'Upon Clicking the "Footer Option" in Master File Menu', '"Receipt Footer Set Up" modal window was not visible or active.', assertionResults, failureMessages)

        cy.get('.border-gray-300').click()

        cy.checkElementInvisibility('.shadow-lg', '38.1', 'Upon Clicking the "Cancel" button:', '"Receipt Footer Set Up" modal window was still visible or active.', assertionResults, failureMessages)

        cy.checkElementVisibility('.h-full', '38.2', 'Upon Clicking the "Cancel" button:', '"Master File Menu" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Valid Update Functionality', () => {

      cy.contains('Footer').click()

      cy.fixture('master-footer-data.json').then((data) => {

          for (const key in data){

              if (data[key].forValid === true) {

                  cy.wait(4000)

                  cy.get('#officialreceipt').select(data[key].officialReceipt)

                  cy.get('#supname').clear()
                    .type(data[key].suppName)

                  cy.checkValue('#supname', '3.1', 'After Encoding in "Supplier Name" Textbox:', data[key].suppName, assertionResults, failureMessages)

                  cy.get('#supaddress').clear()
                    .type(data[key].suppAdd)

                  cy.checkValue('#supaddress', '4.1', 'After Encoding in "Supplier Address" Textbox:', data[key].suppAdd, assertionResults, failureMessages)

                  cy.get('#supvarregtin').clear()
                    .type(data[key].suppVAT)

                  cy.checkValue('#supvarregtin', '5.1', 'After Encoding in "Supplier VAT Registered TIN" Textbox:', data[key].suppVAT, assertionResults, failureMessages)

                  cy.get('#supnonvatregtin').clear()
                    .type(data[key].suppNonVAT)

                  cy.checkValue('#supnonvatregtin', '6.1', 'After Encoding in "Supplier Non-VAT Registered TIN" Textbox:', data[key].suppNonVAT, assertionResults, failureMessages)
                  
                  cy.get('#accrenum').clear()
                    .type(data[key].accredNo)

                  cy.checkValue('#accrenum', '7.1', 'After Encoding in "Accredited No." Textbox:"', data[key].accredNo, assertionResults, failureMessages)

                  cy.get(':nth-child(7) > .ant-picker').clear()
                    .type(data[key].accredDate)
                  cy.get('#modal-h1').click()

/*                   cy.checkValue(':nth-child(7) > .ant-picker', '8.1', 'After Encoding in "Accredited Date" Textbox:', data[key].accredDate, assertionResults, failureMessages)
 */
                  cy.get('#permitnum').clear()
                    .type(data[key].permitNo)

                  cy.checkValue('#permitnum', '9.1', 'After Encoding in "Permit No." Textbox:', data[key].permitNo, assertionResults, failureMessages)

                  cy.get('#validyr').clear()
                    .type(data[key].yearsValidity)

                  cy.checkValue('#validyr', '10.1', 'After Encoding in "Years Validity" Textbox:', '5', assertionResults, failureMessages)
                  
                  cy.get(':nth-child(10) > .ant-picker').clear()
                    .type(data[key].dateIssued)

/*                   cy.checkValue(':nth-child(10) > .ant-picker', '11.1', 'After Encoding in "Date Issued" Textbox:', data[key].dateIssued, assertionResults, failureMessages)
 */
                  cy.get('#modal-h1').click()

                  cy.get('#footermsg1').clear()
                    .type(data[key].lineMsg1)

                  cy.checkValue('#footermsg1', '12.1', 'After Encoding in "Line Message 1" Textbox:', data[key].lineMsg1, assertionResults, failureMessages)

                  cy.get('#footermsg2').clear()
                    .type(data[key].lineMsg2)

                  cy.checkValue('#footermsg2', '13.1', 'After Encoding in "Line Message 2" Textbox:', data[key].lineMsg2, assertionResults, failureMessages)

                  cy.get('#footermsg3').clear()
                    .type(data[key].lineMsg3)

                  cy.checkValue('#footermsg3', '14.1', 'After Encoding in "Line Message 3" Textbox:', data[key].lineMsg3, assertionResults, failureMessages)

                  cy.get('#footermsg4').clear()
                    .type(data[key].lineMsg4)

                  cy.checkValue('#footermsg4', '15.1', 'After Encoding in "Line Message 4" Textbox:', data[key].lineMsg4, assertionResults, failureMessages)
                      
                  cy.get('#footermsg5').clear()
                    .type(data[key].lineMsg5)

                  cy.checkValue('#footermsg5', '16.1', 'After Encoding in "Line Message 5" Textbox:', data[key].lineMsg5, assertionResults, failureMessages)
                  
                  cy.get('#button-form-2').click()

                  cy.wait(2000)

                  cy.checkLabelCaption('.Toastify__toast-body', '17.1', 'Upon Clicking the "Update" button:', 'Successfully updated.', assertionResults, failureMessages)

                  // 17.1 Check all encoded data should reflect to the receipt (Validate on Preview) 

                  cy.contains('Footer').click()
              } 
          } 
      })
      cy.wait(4000)

      cy.checkForFailure(assertionResults, failureMessages)
  })
})