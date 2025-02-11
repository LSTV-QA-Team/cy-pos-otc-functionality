
let assertionResults = [];
let failureMessages = [];

describe('Order Type', () => {


    before(() => {
        cy.task("queryDb","TRUNCATE TABLE postypefile")

        cy.task("queryDb", "SELECT * FROM postypefile").then((records) => {
            expect(records.length).to.be.equal(0)
        })

        cy.task('clearDownloads')

        cy.wait(4000)
        cy.execute('npm run sheet-converter master-ordertype-data')
        cy.execute('npm run sheet-converter ordertype-selector-assert')
        cy.execute('npm run sheet-converter ordertype-add-el')
        cy.execute('npm run sheet-converter ordertype-edit-el')
        cy.wait(4000)

    })
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login('lstv', 'lstventures')
    })

    after(() => {

        cy.fixture('data-to-delete.json').then((data) => {

            data.forEach((item) => {
                const specialChar = item.dataToDelete;
                const deleteQuery = `DELETE FROM postypefile WHERE postypdsc = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {
                    cy.log(`Deleted data with description: ${specialChar}`)
                })
            })
    
            // Ensure the table is clear of specified data
            cy.task('queryDb', 'SELECT * FROM postypefile').then((records) => {
                const remainingData = records.map((record) => record.description)
                const deletedChars = data.map((item) => item.dataToDelete)
                
                deletedChars.forEach((char) => {
                    expect(remainingData).to.not.include(char)
                })
    
                cy.log('Specified data Successfully deleted.')
            })
        })
    })

    it('Check Order Type Page', () => {   

        cy.navigateToModule('Master File', 'Order Type')

        cy.url({timeout: 10000})
            .should('contain', '/dineType/?menfield=masterfile_dinetype')

        cy.wait(4000)

        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Order Type:', 'The "Order Type" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Order Type pager U/I', 'Order Type', assertionResults, failureMessages)

        cy.wait(2000)
 
        cy.checkTableColumnTitle(['Actions', 'Dine Type', 'Order Type'], '1.2.2', 'Upon Navigating to Order Type pager U/I', assertionResults, failureMessages)

        cy.validateElements('ordertype-selector-assert.json', '1.2.5', 'Upon Navigating to Order Type pager U/I', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Add Functionality', () => {

        cy.fixture('master-ordertype-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', 'The "Add Order Type" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Order Type', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="postypdsc"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Dine Type *', assertionResults,failureMessages)

            cy.checkLabelCaption('label[for="ordertyp"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Order Type *', assertionResults, failureMessages)
            
            cy.validateElements('ordertype-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            cy.fixture('dropdown-values.json').then((data) => { 
                const expectedItems = data.orderType;
    
                cy.wait(2000)
    
                cy.get('select[name="ordertyp"]').as('dropdown')
    
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


                cy.wait(8000) 
                
                if (data[key].dineType === "null") {

                    cy.wait(4000)

                    cy.get('#postypdsc').clear().type(data[key].dineType)

                    cy.get('.border-green-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.text-sm', '11.2', 'Upon clicking the "Save" button:', 'Order Type * is required', assertionResults, failureMessages)

                    cy.get('#ordertyp').select(data[key].orderType)

                    cy.get('#postypdsc').clear().should('be.empty')

                    cy.get('.border-green-500').click()
                    
                    cy.wait(2000)

                    cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Dine Type * is required', assertionResults, failureMessages)

                    cy.wait(4000)

                    cy.get('#postypdsc').clear()

                    cy.get('#postypdsc').type(data[0].dineType)

                    cy.get('#ordertyp').select(data[0].orderType)

                    cy.get('.border-green-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '14.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                    cy.wait(4000)
                } 
                
                else if (data[key].dineType === "Reservation") {

                    cy.wait(8000)

                    cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                    cy.get('#postypdsc').clear().type(data[key].dineType)

                    cy.get('#ordertyp').realClick()

                    cy.get('.border-gray-300').click()

                    cy.checkLabelCaption('.h-auto', '6.1', 'Upon Clicking the "Save" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                    cy.contains('button[class*="border-gray-300"]', 'No').click()

                    cy.wait(3000)

                    cy.checkElementVisibility('.shadow-lg', '6.2.1', 'Upon Clicking the "No" button:', 'The "Add Order Type" modal window was not visible or active.', assertionResults, failureMessages)

                    cy.get('.border-gray-300').click()

                    cy.contains('button[class*="border-green-500"]', 'Yes').click()

                    cy.wait(4000)

                    cy.checkElementInvisibility('.shadow-lg', '6.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Special Request" modal window was visible or active.', assertionResults, failureMessages)

                    cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '6.3.2', 'Upon clicking the "Yes" button', 'Order Type', assertionResults, failureMessages)

                    cy.wait(4000)

                    cy.get('.sc-eDLKkx > .anticon > svg').click()
                }

                else if (data[key].dineType === "% & ( ) / - .") {

                    cy.wait(8000)

                    cy.get('#postypdsc').clear().type(data[key].dineType)

                    cy.get('#ordertyp').select(data[key].orderType)

                    cy.get('.border-green-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '5.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.checkElementVisibility('.shadow-lg', '5.2.1', 'Upon clicking the "OK" button:', 'The "Add Order Type" modal window was not visible or active.', assertionResults, failureMessages)
                }

                else if (data[key].dineType === "This is a very long string that exceeds the maximum allowed length") {

                    cy.wait(8000)

                    cy.get('#postypdsc').clear().type(data[key].dineType)

                    cy.checkInputMaxLength('#postypdsc', '50', '19.1', 'The validation message "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                    // cy.checkElementVisibility('.Toastify__toast-body', '19.1', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                    cy.get('#ordertyp').select(data[key].orderType)

                    cy.get('.border-green-500').click()
                }

                else if (data[key].dineType === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                    cy.wait(8000)

                    cy.get('#postypdsc').clear().type(data[key].dineType)

                    cy.checkLabelCaption('.Toastify__toast-body', '16.1', 'Upon encoding not allowed special characters:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages)

                    cy.get('#ordertyp').realClick()

                    cy.get('#ordertyp').select(data[key].orderType)

                    cy.get('.border-green-500').click()

                    cy.wait(2000) 

                    cy.checkElementVisibility('.shadow-lg', '16.2.1', 'Upon clicking the "Save" button:', 'The "Add Order Type" modal window was not visible or active.', assertionResults, failureMessages)
                }

                else {

                    cy.wait(8000)

                    cy.get('#postypdsc').clear().type(data[key].dineType)

                    cy.get('#ordertyp').select(data[key].orderType)

                    cy.get('.border-green-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.wait(2000)
                    
                    cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Order Type" modal window was not visible or active.', assertionResults, failureMessages)

                    cy.wait(2000)

                    cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                    // cy.get('.MuiSelect-select.MuiTablePagination-select').click()

                    // cy.get('ul[role="listbox"] li').contains('15').click()

                    // cy.get('.MuiTableBody-root').contains(data[key].dineType).should('exist')
                }
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    })

    it('Edit Functionality', () => {

        cy.get('.border-gray-300').click()

        cy.fixture('master-ordertype-data.json').then((data) => {

            const specificOrderType = data[2];

                cy.get('.MuiSelect-select.MuiTablePagination-select').click()

                cy.get('ul[role="listbox"] li').contains('15').click()

                cy.wait(2000)

                cy.contains('tbody > tr', specificOrderType.dineType).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()
                })

                cy.wait(2000)

                cy.checkElementVisibility('.shadow-lg', '21.1', 'Upon Clicking the "Edit" button:', 'The "Edit Order Type" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '21.1.1', 'Upon clicking the "Edit" button on pager UI', 'Edit Order Type', assertionResults, failureMessages)

                cy.checkLabelCaption('.mb-2', '21.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Order Type', assertionResults, failureMessages)

                cy.validateElements('ordertype-edit-el.json', '21.1.4 & 21.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

                cy.get('#postypdsc')
                    .should('have.value', specificOrderType.dineType)
                    .clear()

                cy.get('#postypdsc').type(specificOrderType.editDineType)

                cy.get('#ordertyp').select(specificOrderType.editOrderType)

                cy.get('.border-green-500').click()

                cy.wait(2000)

                cy.checkLabelCaption('.Toastify__toast-body', '26.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '26.2.1', 'Upon Clicking the "Update" button:', 'The "Edit Order Type" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificOrderType.editDineType).should('exist')

                cy.wait(10000)
            })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-ordertype-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlyDelete === true) {

                    cy.wait(2000)

                    cy.contains('tbody > tr', data[key].dineType).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkElementVisibility('.px-8', '27.1', 'Upon clicking the "Delete" button on pager UI:', 'The "Delete Confirmation" modal is not visible.')

                    cy.checkHeaderTitle('.px-8', '27.2.1', 'Upon clicking the "Delete" button on pager UI:', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.max-h-\\[450px\\] > h1', 'Do you want to delete: ' + data[key].dineType + ' ?', assertionResults, failureMessages)

                    cy.validateElements('delete-confirm-el.json', '27.3', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

                    cy.get('.hover\\:bg-green-500').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '27.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.wait(3000)

                    cy.contains('tbody > tr', data[key].dineType).within(() => {
                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()
                    })

                    cy.wait(4000)

                    cy.get('.bg-blue-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '27.5.1', 'Upon Clicking the "Save" button:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '27.5.2 ', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                }
            }

        })

        cy.checkForFailure(assertionResults, failureMessages)
    })


    it('Search Functionality', () => {

        cy.fixture('master-ordertype-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlySearch === true) {

                    cy.wait(2000)

                    cy.get('[data-testid="SearchIcon"]').click()

                    cy.get('input[placeholder="Search Dine Type')
                        .should('be.enabled')
                        .clear()
                        .type(data[key].dineType)
                        .type('{enter}')

                    cy.wait(2000)
    
                    cy.get('.MuiTableBody-root').contains(data[key].dineType).should('exist')
                }

                if (data[key].onlySearchInval === true) {

                    // search invalid or not existing data
                    cy.wait(2000)
                            
                    cy.get('[data-testid="SearchIcon"]').click()
        
                    cy.get('input[placeholder="Search Dine Type')
                        .clear()
                        .type(data[key].dineType)
        
                    cy.wait(4000)
        
                    cy.get('td > .MuiTypography-root').should('have.text', 'No records to display')
                }
            }
        })
    })

    it.skip('Print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]').click()

        cy.wait(8000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {
            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file));
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
