
let assertionResults = [];
let failureMessages = [];

describe('Payment Type', () => {


    before(() => {
        cy.task("queryDb","TRUNCATE TABLE paymentfile")

        cy.task("queryDb", "SELECT * FROM paymentfile").then((records) => {
            expect(records.length).to.be.equal(0)
        });


        cy.task('clearDownloads')

        cy.wait(4000)
        cy.execute('npm run sheet-converter master-paymenttype-data')
        cy.execute('npm run sheet-converter module-selector-assert')
        cy.execute('npm run sheet-converter paymenttype-add-el')
        cy.execute('npm run sheet-converter paymenttype-edit-el')
        cy.wait(4000)

    })
    
    beforeEach(() => {

        assertionResults = [];
        failureMessages = [];

        cy.login('lstv', 'lstventures')

    })

    after(() => {

        cy.fixture('data-to-delete.json').then((data) => {
           
            data.forEach((item) => {

                const specialChar = item.dataToDelete;
                const deleteQuery = `DELETE FROM paymentfile WHERE paytyp = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {

                    cy.log(`Deleted data with description: ${specialChar}`)

                })
            })
    
           
            cy.task('queryDb', 'SELECT * FROM paymentfile').then((records) => {

                const remainingData = records.map((record) => record.description)
                const deletedChars = data.map((item) => item.dataToDelete)
                

                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char)

                })
    
                cy.log('Specified data Successfully deleted.')

            })
        })
    })

    it('Check Payment Type Page', () => { 
        
        cy.navigateToModule('Master File', 'Payment Type')

        cy.url({timeout: 10000})
            .should('contain', '/paymentType/?menfield=masterfile_other_payments')

        cy.wait(2000)

        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Payment Type:', '"Payment Type" Pager U/I window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Payment Type pager U/I:', 'Payment Type', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Payment Type pager U/I:', assertionResults, failureMessages)

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to Payment Type pager U/I:', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Add Functionality', () => {

        cy.fixture('master-paymenttype-data.json').then((data) => {

            cy.wait(4000) 

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(2000)
                
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', 'The "Add Payment Type" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI:', 'Add Payment Type', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I:', 'Description *', assertionResults, failureMessages)
            
            cy.get('#paytyp').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.validateElements('paymenttype-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            for (const key in data){

                cy.wait(4000)

                if (data[key].paymentType === "null") {

                    cy.get('#paytyp').clear().type(data[key].paymentType)
                    
                    cy.get('#paytyp').clear()

                    cy.get('.border-green-500').click()

                    cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Description * is required', assertionResults, failureMessages)

                    cy.get('#paytyp').type('Cash')

                    cy.get('.border-green-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '13.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                } 
                
                else if (data[key].paymentType === "Electronic Card") {

                    cy.wait(4000)

                    cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                    cy.get('#paytyp').clear().type(data[key].paymentType)
                    
                    cy.get('.border-gray-300').click()

                    cy.checkLabelCaption('.h-auto', '6.1', 'Upon Clicking the "Cancel" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                    cy.contains('button[class*="border-gray-300"]', 'No').click()

                    cy.wait(3000)

                    cy.checkElementVisibility('.shadow-lg', '6.2.1', 'Upon Clicking the "No" button:', 'The "Add Payment Type" modal window was not visible or active.', assertionResults, failureMessages)

                    cy.get('.border-gray-300').click()

                    cy.contains('button[class*="border-green-500"]', 'Yes').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '6.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Payment Type" modal window was not visible or active.', assertionResults, failureMessages)

                    cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '6.3.2', 'Upon clicking the "Yes" button', 'Payment Type', assertionResults, failureMessages)

                    cy.wait(4000)

                    cy.get('.sc-eDLKkx > .anticon > svg').click()


                }

                else if (data[key].paymentType === "% & ( ) / - .") {

                    cy.wait(4000)

                    cy.get('#paytyp').clear().type(data[key].paymentType)
                    
                    cy.get('.border-green-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '9.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.wait(2000)

                    cy.checkElementVisibility('.shadow-lg', '9.2.1', 'Upon clicking the "OK" button:', 'The "Add Payment Type" modal window was not visible or active.', assertionResults, failureMessages)

                    // 11.2.2 Check if the "Description" textbox object is cleared or blank.
                }

                else if (data[key].paymentType === "Jollibee Filipino Sweet Style Spaghetti Langhap Sarap") {

                    cy.wait(4000)

                    cy.get('#paytyp').clear().type(data[key].paymentType)

                    cy.checkElementVisibility('.Toastify__toast-body', '17.1', 'Upon encoding data:', 'The validation message "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                    cy.get('.border-gray-300').click()

                    // cy.wait(4000)

                    // cy.checkLabelCaption('.Toastify__toast-body', '9.1', 'Upon Clicking the "Save" button:', 'Please input valid data.', assertionResults, failureMessages) 

                }

                else if (data[key].paymentType === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                    cy.wait(4000)

                    cy.get('#paytyp').clear().type(data[key].paymentType)

                    cy.checkLabelCaption('.Toastify__toast-body', '15.1', 'Upon encoding not allowed special characters:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                    cy.get('.border-green-500').click()

                    // cy.get('#paytyp').should('be.empty')

                    cy.wait(3000)

                    cy.checkElementVisibility('.shadow-lg', '15.2.1', 'Upon clicking the "OK" button:', 'The "Add Payment Type" modal window was not visible or active.', assertionResults, failureMessages)
                    
                }

                else {

                    cy.wait(4000)

                    cy.get('#paytyp').clear().type(data[key].paymentType)

                    cy.get('.border-green-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 
                    
                    cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Payment Type" modal window was not visible or active.', assertionResults, failureMessages)

                    // 4.2.2 Check if the "Description" textbox object is cleared or blank.
                    
                    // cy.get('.MuiTableBody-root').contains(data[key].paymentType).should('exist')
                }
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    })

    it('Edit Functionality', () => {

        cy.get('.border-gray-300').click()

        cy.fixture('master-paymenttype-data.json').then((data) => {

            const specificPaymentType = data[7];

                cy.wait(2000)

                cy.contains('tbody > tr', specificPaymentType.paymentType).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()

                })

                cy.wait(2000)

                cy.checkElementVisibility('.shadow-lg', '20.1', 'Upon Clicking the "Edit" button:', 'The "Edit Payment Type" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '20.1.1', 'Upon clicking the "Edit" button on pager UI:', 'Edit Payment Type', assertionResults, failureMessages)

                cy.checkLabelCaption('.mb-2', '20.1.2', 'Upon clicking the "Edit" button on pager U/I:', 'Description *', assertionResults, failureMessages)
            
                // Check correct object (textbox) width
                // Add when needed

                // Check correct all object position

                cy.validateElements('paymenttype-edit-el.json', '20.1.4 & 20.1.6', 'Upon clicking the "Edit" button on pager U/I:', assertionResults, failureMessages)
 
                cy.get('#paytyp')
                  .should('have.value', specificPaymentType.paymentType)
                  .clear()

                cy.get('#paytyp').type(specificPaymentType.editPaymentType)

                cy.get('.border-green-500').click()

                cy.wait(2000)

                cy.checkLabelCaption('.Toastify__toast-body', '23.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '23.2.1', 'Upon Clicking the "Update Data" button:', 'The "Edit Payment Type" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificPaymentType.editPaymentType).should('exist')
            })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-paymenttype-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlyDelete === true) {

                    cy.wait(2000)

                    cy.contains('tbody > tr', data[key].paymentType).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkHeaderTitle('.px-8', '24.1', 'Upon clicking the "Delete" button on pager U/I', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', '24.3', 'Upon clicking the "Delete" button on pager U/I', 'Do you want to delete: ' + data[key].paymentType + ' ?', assertionResults, failureMessages)

                    cy.get('.hover\\:bg-green-500').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '24.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.contains('tbody > tr', data[key].paymentType).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.get('.bg-blue-500').click()

                    cy.wait(3000)

                    cy.checkLabelCaption('.Toastify__toast-body', '24.5.1', 'Upon Clicking the "Save" button:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '24.1.3', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                }
            }

        })

        cy.checkForFailure(assertionResults, failureMessages)
    })


    it('Search Functionality', () => {

        cy.fixture('master-paymenttype-data.json').then((data) => {

            for (const key in data) {

                cy.wait(2000)

                cy.get('[data-testid="SearchIcon"]').click()

  
                cy.get('#\\:rb\\:')
                  .clear()
                  .type(data[0].paymentType)

                cy.wait(2000)
   
                cy.get('.MuiTableBody-root').contains(data[0].paymentType).should('exist')
            }
        })

        cy.wait(2000)
                
                cy.get('[data-testid="SearchIcon"]').click()

                cy.get('#\\:rb\\:')
                  .clear()
                  .type('Electronic Card')
                  .type('{enter}')

                cy.wait(4000)

                cy.get('td > .MuiTypography-root').should('have.text', 'No records to display')
    });

    it.skip('Print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]').click()

        cy.wait(10000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {

            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file))

            expect(fileName).to.exist;
        })
    })

    it('Back Button Functionality', () => {

        cy.wait(2000)

        cy.get(':nth-child(1) > .flex > .anticon > svg').click()

        cy.get('.text-\\[3rem\\]').should('have.text', 'Masterfile')
    })
})


