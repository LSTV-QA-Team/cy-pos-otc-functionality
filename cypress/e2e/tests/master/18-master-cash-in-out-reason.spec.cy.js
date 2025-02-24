let assertionResults = [];
let failureMessages = [];

describe('Cash In and Out Reason', () => {

    before(() => {

        cy.task("queryDb","TRUNCATE TABLE cashioreasonfile")

        cy.task("queryDb", "SELECT * FROM cashioreasonfile").then((records) => {

            expect(records.length).to.be.equal(0)
            
        })

        cy.task('clearDownloads')

        cy.wait(6000)
        cy.execute('npm run sheet-converter master-cashioreason-data')
        cy.execute('npm run sheet-converter cashioreason-selector-assert')
        cy.execute('npm run sheet-converter cashioreason-add-el')
        cy.execute('npm run sheet-converter cashioreason-edit-el')
        cy.wait(6000)

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
                const deleteQuery = `DELETE FROM cashioreasonfile WHERE cashioreason = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {

                    cy.log(`Deleted data with description: ${specialChar}`) 

                })
            })
    
            cy.task('queryDb', 'SELECT * FROM cashioreasonfile').then((records) => {

                const remainingData = records.map((record) => record.description);
                const deletedChars = data.map((item) => item.dataToDelete);
                
                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char)

                })
    
                cy.log('Specified data Successfully deleted.')
            })
        })
    })

    it('Check Cash In and Out Reason Page', () => {   

        cy.navigateToModule('Master File', 'Cash In/Out Reason')

        cy.url({timeout: 10000}).should('contain', '/cashioreason/?menfield=masterfile_cashioreason')

        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Cash In and Out Reason:', ' "Add Cash In/Out Reason" modal window was not visible or active.', assertionResults, failureMessages)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Cash In and Out Reason pager U/I', 'Cash In/Out Reasons', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Cash In/Out Reasons', 'Type'], '1.2.2', 'Upon Navigating to Cash In and Out Reason pager U/I', assertionResults, failureMessages)

        cy.validateElements('cashioreason-selector-assert.json', '1.2.5', 'Upon Navigating to Cash In and Out Reason pager U/I', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Add Functionality', () => {

        cy.fixture('master-cashioreason-data.json').then((data) => {

            cy.get('.sc-dntaoT > .anticon > svg').click()

            cy.wait(6000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', '"Add Cash In/Out Reason" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Cash In/Out Reason', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="cashioreason"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Reason *', assertionResults,failureMessages)

            cy.checkLabelCaption('label[for="type"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Type *', assertionResults, failureMessages)

            cy.get('#cashioreason').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#type').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })
            
            cy.validateElements('cashioreason-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            cy.fixture('dropdown-values.json').then((data) => { 

                const expectedItems = data.cashIOReason;
    
                cy.wait(2000)
    
                cy.get('select[name="type"]').as('dropdown')
    
                cy.get('@dropdown')
                  .find('option')
                  .should('have.length', expectedItems.length + 1)
                  .each((option, index) => {
    
                    if (index > 0) {

                        cy.wrap(option).should('have.text', expectedItems[index - 1])

                    }
                })
            })

            for (const key in data){

                cy.wait(6000)

                if (data[key].cashioreason === "null") {

                    cy.get('#cashioreason').clear().type(data[key].cashioreason)

                    cy.get('#button-form-2').click()

                    cy.wait(6000)

                    cy.checkLabelCaption('.text-sm', '13.2', 'Upon clicking the "Save" button:', 'Type * is required', assertionResults, failureMessages)

                    cy.get('#cashioreason').clear()

                    cy.get('#type').select(data[key].type)

                    cy.get('#button-form-2').click()

                    cy.checkLabelCaption('.text-sm', '13.1', 'Upon clicking the "Save" button:', 'Reason * is required', assertionResults, failureMessages)

                    cy.wait(6000)

                    cy.get('#cashioreason').type(data[4].cashioreason)

                    cy.get('#type').select(data[4].type)

                    cy.get('#button-form-2').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '15.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 
                } 
                
                else if (data[key].cashioreason === "Milkshakes") {

                    cy.wait(6000)

                    cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                    cy.get('#cashioreason').clear().type(data[key].cashioreason)

                    cy.get('#type').realClick()

                    cy.get('.border-gray-300').click()

                    cy.checkLabelCaption('.h-auto', '8.1', 'Upon Clicking the "Save" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                    cy.get('.bg-black\\/75 > .bg-white > .justify-center > .border-gray-300').click()

                    cy.wait(3000)

                    cy.checkElementVisibility('.shadow-lg', '8.2.1', 'Upon Clicking the "No" button:', 'The "Add Cash In/Out Reason" modal window was not visible or active.', assertionResults, failureMessages)

                    cy.get('.border-gray-300').click()

                    cy.get('.bg-black\\/75 > .bg-white > .justify-center > #button-form-2').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '48.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Cash In/Out Reason" modal window was not visible or active.', assertionResults, failureMessages)

                    cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '40.3.2', 'Upon clicking the "Yes" button', 'Cash In and Out Reason', assertionResults, failureMessages)

                    cy.wait(6000)

                    cy.get('.sc-dntaoT > .anticon > svg').click()
                }

                else if (data[key].cashioreason === "% & ( ) / - .") {

                    cy.wait(6000)

                    cy.get('#cashioreason').clear().type(data[key].cashioreason)

                    cy.get('#type').select(data[key].type)

                    cy.get('#button-form-2').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.wait(6000)

                    cy.checkElementVisibility('.shadow-lg', '11.2.1', 'Upon clicking the "OK" button:', 'The "Add Cash In/Out Reason" modal window was not visible or active.', assertionResults, failureMessages)
                }

                else if (data[key].cashioreason === "Jollibee Filipino Sweet Style Spaghetti Langhap Sarap") {

                    cy.wait(6000)

                    cy.get('#cashioreason').clear().type(data[key].cashioreason)

                    // cy.checkElementVisibility('.Toastify__toast-body', '19.2', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                    cy.checkInputMaxLength('#cashioreason', 50, '16.2', 'Upon Encoding in "Cash In and Out Reason" Textbox:', assertionResults, failureMessages)

                    cy.get('#type').select(data[key].type)

                    cy.get('#button-form-2').click()

                    cy.wait(6000)
                }

                else if (data[key].cashioreason === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                    cy.wait(6000)

                    cy.get('#cashioreason').clear().type(data[key].cashioreason)

                    cy.checkLabelCaption('.Toastify__toast-body', '17.1', 'Upon encoding not allowed special characters:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages)

                    cy.get('#type').select(data[key].type)

                    cy.get('#button-form-2').click()

                    cy.wait(6000)

                    cy.checkElementVisibility('.shadow-lg', '15.2.1', 'Upon clicking the "OK" button:', 'The "Add Void/Refund Reasons" modal window was visible or active.', assertionResults, failureMessages)                        
                }

                else {

                    cy.wait(6000)

                    cy.get('#cashioreason').clear().type(data[key].cashioreason)

                    cy.get('#type').select(data[key].type)

                    cy.get('#button-form-2').click()

                    cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.wait(6000)
                    
                    cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Cash In/Out Reason" modal window was not visible or active.', assertionResults, failureMessages)

                    // cy.get('.MuiSelect-select.MuiTablePagination-select').click()

                    // cy.get('ul[role="listbox"] li').contains('15').click()

                    // cy.get('.MuiTableBody-root').contains(data[key].cashioreason).should('exist')
                }
            }
        })

        cy.wait(6000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Edit Functionality', () => {

        cy.get('.border-gray-300').click()

        // cy.contains('Yes').click()

        cy.fixture('master-cashioreason-data.json').then((data) => {

            const specificcashioreason = data[8];

                cy.get('.MuiSelect-select.MuiTablePagination-select').click({force:true});

                cy.get('ul[role="listbox"] li').contains('100').click();

                cy.wait(6000);

                cy.contains('tbody > tr', specificcashioreason.cashioreason).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()
                })

                cy.wait(6000)

                cy.checkElementVisibility('.shadow-lg', '22.1', 'Upon Clicking the "Edit" button:', 'The "Edit Cash In/Out Reason" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '22.1.1', 'Upon clicking the "Edit" button on pager UI', 'Edit Cash In/Out Reason', assertionResults, failureMessages)

                cy.checkLabelCaption('label[for="cashioreason"]', '2.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Reason *', assertionResults,failureMessages)

                cy.checkLabelCaption('label[for="type"]', '2.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Type *', assertionResults, failureMessages)

                cy.validateElements('cashioreason-edit-el.json', '22.1.4 & 22.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

                cy.get('#cashioreason')
                    .should('have.value', specificcashioreason.cashioreason)
                    .clear()

                cy.get('#cashioreason').type(specificcashioreason.editcashioreason)

                cy.get('#type').select(specificcashioreason.edittype)

                cy.get('#button-form-2').click()

                cy.wait(2000)

                cy.checkLabelCaption('.Toastify__toast-body', '25.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '25.2.1', 'Upon Clicking the "Update Data" button:', 'The "Edit Cash In and Out Reason" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificcashioreason.editcashioreason).should('exist')
        })

        cy.wait(6000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-cashioreason-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlyDelete === true) {

                    cy.wait(2000)

                    cy.contains('tbody > tr', data[key].cashioreason).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkElementVisibility('.px-8', '30.1', 'Upon clicking the "Delete" button on pager UI:', 'The "Delete Confirmation" modal is not visible.')

                    cy.checkHeaderTitle('.px-8', '30.2', 'Upon clicking the "Delete" button on pager UI:', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.max-h-\\[450px\\] > h1', 'Do you want to delete: ' + data[key].edittype + ' ?', assertionResults, failureMessages)

                    cy.validateElements('delete-confirm-el.json', '30.3', 'Upon clicking the "Delete" button on pager U/I:', assertionResults, failureMessages)

                    cy.get('.hover\\:bg-green-500').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '30.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.wait(3000)

                    cy.contains('tbody > tr', data[key].cashioreason).within(() => {
                        // 29. Click the delete button within this row
                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()
                    })

                    cy.get('.bg-blue-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '30.5.1', 'Upon Clicking the "Save" button:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '30.5.2 ', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)
                }    
            }    
        })

        cy.wait(6000)

        cy.checkForFailure(assertionResults, failureMessages)
    })


    it('Search Functionality', () => {

        cy.fixture('master-cashioreason-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlySearchVal === true) {

                    cy.wait(2000);

                    cy.get('[data-testid="SearchIcon"]').click();

                    cy.get('#\\:re\\:')
                      .clear()
                      .type(data[key].cashioreason)
                      .type('{enter}')

                    cy.wait(2000)

                    cy.get('.MuiTableBody-root').contains(data[key].cashioreason).should('exist')
                }

                if (data[key].onlySearchInval === true) {

                    cy.wait(2000)
                
                    cy.get('[data-testid="SearchIcon"]').click()

                    cy.get('#\\:re\\:')
                      .clear()
                      .type(data[key].cashioreason)

                    cy.wait(6000)

                    // cy.get('td > .MuiTypography-root').should('have.text', 'No records to display')

                    cy.get('td > .MuiTypography-root').should('not.contain', data[key].cashioreason)
                }
            }
        })
    })

    it.skip('Print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]').click()

        cy.wait(8000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {

            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file))

            expect(fileName).to.exist;
        })
    })

    it('Back Button Functionality', () => {

        cy.wait(2000)

        cy.get(':nth-child(1) > .flex > .anticon > svg').click()

        cy.get('.text-\\[3rem\\]').should('be.visible')
          .should('have.text', 'Masterfile')
    })
})
