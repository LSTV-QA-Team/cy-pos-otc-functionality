let assertionResults = [];
let failureMessages = [];

describe('Price List', () => {

    before(() => {

        // Clear the pricecodefile1 table before tests
        cy.task("queryDb","TRUNCATE TABLE pricecodefile1")

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM pricecodefile1").then((records) => {

            expect(records.length).to.be.equal(0)

        })

        // Delete all file in downloads for check print functinality test case
        cy.task('clearDownloads')

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-pricelist-data')
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

        // delete unecessary inputed data in the table 'pricecodefile1'

        cy.fixture('data-to-delete.json').then((data) => {

            // Loop through each character and delete corresponding rows from the 'pricecodefile1' table
            data.forEach((item) => {

                const specialChar = item.dataToDelete;
                const deleteQuery = `DELETE FROM pricecodefile1 WHERE prcdsc = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {
                    
                    cy.log(`Deleted data with description: ${specialChar}`); // Log successful deletions

                })
            })
    
            // Ensure the table is clear of specified data
            cy.task('queryDb', 'SELECT * FROM pricecodefile1').then((records) => {

                const remainingData = records.map((record) => record.description)
                const deletedChars = data.map((item) => item.dataToDelete)

                
                // Ensure no deleted special characters are still in the table
                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char)

                })
    
                cy.log('Specified data Successfully deleted.')// Log success

            })
        })
    })
    it('Check Price List Page', () => {   

        cy.navigateToModule('Master File', 'Price List')

        cy.url({timeout: 10000}).should('contain', '/priceList/?menfield=masterfile_pricelist')
           
        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Price List:', ' "Add Price List" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Price List pager U/I', 'Price List', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Price List', 'Order Type'], '1.2.2', 'Upon Navigating to Price List pager U/I', assertionResults, failureMessages) 

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to Price List pager U/I', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Add Functionality', () => {

        cy.fixture('master-pricelist-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', '"Add Price List" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Price List', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Price List *', assertionResults, failureMessages)
            
            cy.get('#prcdsc').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            // 2.1.5 Check correct all object position

            // cy.validateElements('pricelist-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            // cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]') .click()

            cy.wait(4000)

            for (const key in data){
            
                    if (data[key].pricelist === "null") {

                        cy.wait(8000)

                        cy.get('#prcdsc').clear().type(data[key].pricelist)
                        
                        cy.get('#prcdsc').clear()

                        cy.checkValue('#prcdsc', '0', 'After encoding data', data[key].pricelist, assertionResults, failureMessages)

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.text-sm', '13.1', 'Upon clicking the "Save" button:', 'Price List * is required', assertionResults, failureMessages)
                        
                        cy.get('#prcdsc').type('Jollibee 1')

                        cy.get('#postypcde').select('Dine-In')

                        cy.get('.border-blue-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '15.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                    } 
                    
                    else if (data[key].pricelist === "Jollibee 6") {

                        cy.wait(8000)

                        cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                        cy.get('#prcdsc').clear().type(data[key].pricelist)

                        cy.get('#postypcde').select(data[key].ordertype)

                        cy.get('.border-red-500').click()

                        cy.checkLabelCaption('.h-auto', '8.1', 'Upon Clicking the "Cancel" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                        cy.contains('button[class*="border-red-500"]', 'No').click()

                        cy.wait(3000)

                        cy.checkElementVisibility('.shadow-lg', '8.2.1', 'Upon Clicking the "No" button in "Cancel" modal:', 'The "Add Price List" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.border-red-500').click()

                        cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                        cy.wait(3000)

                        cy.checkElementInvisibility('.shadow-lg', '8.3.1', 'Upon Clicking the "Yes" button in "Cancel" modal:', 'The "Add Price List" modal window was visible or active.', assertionResults, failureMessages)

                        cy.checkElementVisibility('.h-screen', '8.3.2', 'Upon clicking the "Yes" button:', 'Should back in Price List Pager U/I', assertionResults, failureMessages)

                        cy.wait(4000)

                        cy.get('.sc-eDLKkx > .anticon > svg').click()

                    }

                    else if (data[key].pricelist === "% & ( ) / - .") {

                        cy.wait(8000)

                        cy.get('#prcdsc').clear().type(data[key].pricelist)

                        cy.get('#postypcde').select(data[key].ordertype)

                        cy.checkValue('#prcdsc', '0', 'After encoding data', data[key].pricelist, assertionResults, failureMessages)

                        cy.get('.border-blue-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.checkElementVisibility('.shadow-lg', '11.2.1', 'Upon clicking the "Save" button:', 'The "Add Price List" modal window was not visible or active.', assertionResults, failureMessages)

                        // 11.2.2 Check if the "Description" textbox object is cleared or blank.

                    }

                    else if (data[key].pricelist === "This is a test string that exceeds fifty characters in length.") {

                        cy.wait(8000)

                        cy.get('#prcdsc').clear().type(data[key].pricelist)

                        cy.checkInputMaxLength('#prcdsc', 50, '19.1', 'The validation message "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                        // cy.checkInputMaxLength('#prcdsc', '50', '19.1', 'After encoding data, 'The validation message "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                        cy.get('#postypcde').select(data[key].ordertype)

                        // cy.get('.border-blue-500').click()

                        // cy.wait(2000)


                    }

                    else if (data[key].pricelist === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                        cy.wait(8000)

                        cy.get('#prcdsc').clear().type(data[key].pricelist)

                        cy.checkLabelCaption('.Toastify__toast-body', '16.1', 'Upon encoding not allowed special characters:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 
                        
                        cy.get('#postypcde').select(data[key].ordertype)

                        cy.get('.border-blue-500').click()

                        cy.wait(2000)

                        // cy.checkLabelCaption('.Toastify__toast-body', '17.1', 'Upon Clicking the "Save" button:', '"Please use only the following approved special characters: % & ( ) / - ."', assertionResults, failureMessages) 

                        cy.checkElementVisibility('.shadow-lg', '17.2.1', 'Upon clicking the "Save" button:', 'The "Add Price List" modal window was not visible or active.', assertionResults, failureMessages)

                        // Check if the "Description" textbox object is cleared or blank. 

                    }

                    else {

                        cy.wait(8000)

                        cy.get('#prcdsc').clear().type(data[key].pricelist)

                        cy.get('#postypcde').select(data[key].ordertype)

                        cy.get('.border-blue-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '5.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.wait(3000)
                        
                        cy.checkElementVisibility('.shadow-lg', '5.2.1', 'Upon Clicking the "Save" button:', 'The "Add Price List" modal window was not visible or active.', assertionResults, failureMessages)

                    }
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    })

    it('Add Data in Table Functionality', () => {

        cy.wait(2000)

        cy.get('.border-red-500').click()

        cy.get('.bg-black\\/75 > .bg-white > .justify-center > .border-blue-500').click()

        cy.fixture('master-pricelist-data.json').then((data) => {

            for (const key in data) {

                if (data[key].tableData === true) {
    
                    cy.wait(2000)

                    cy.contains('tbody > tr', data[key].pricelist).within(() => {

                        cy.get('svg[data-icon="table"]').click()

                    })

                    cy.wait(2000)

                    cy.contains('div', data[key].pricelist).should('be.visible')

                    cy.contains('p', 'Load data from items').click()

                    cy.wait(2000)

                    cy.get('.shadow-lg').should('be.visible')

                    cy.get('.px-8').should('be.visible').and('have.text', 'Load data')

                    cy.get('.border-red-500').click()

                    cy.wait(4000)

                    cy.contains('p', 'Load data from items').click()

                    cy.wait(2000)

                    cy.get('.shadow-lg').should('be.visible')
                    
                    cy.get('#selectAll').click()

                    cy.get('.border-blue-500').click()

                    cy.get('.pl-10 > .flex').click()
                }
            }
        }) 
    })

    it('Edit Functionality', () => {

        cy.fixture('master-pricelist-data.json').then((data) => {

        const specificpricelist = data[3];

            cy.wait(2000)

            cy.contains('tbody > tr', specificpricelist.pricelist).within(() => {

                cy.get('[data-icon="edit"][aria-hidden="true"]').click()

            })

            cy.wait(2000)

            cy.checkElementVisibility('.shadow-lg', '22.1', 'Upon Clicking the "Edit" button:', '"Edit Price List" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '22.1.1', 'Upon clicking the "Edit" button on pager UI', 'Edit Price List', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '22.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Price List *', assertionResults, failureMessages)
        
            // 21.1.3 Check correct object (textbox) width
            // Add when needed

            // 21.1.4 Check correct buttons(s) caption

            // 21.1.5 Check correct all object position

            // cy.validateElements('pricelist-edit-el.json', '19.1.4 & 19.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            cy.get('#prcdsc')
                .should('have.value', specificpricelist.pricelist)
                .clear()

            cy.get('#prcdsc').type(specificpricelist.editpricelist)

            cy.get('#postypcde').select(specificpricelist.editordertype)

            cy.get('.border-blue-500').click()

            cy.wait(2000)

            cy.checkLabelCaption('.Toastify__toast-body', '25.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

            cy.checkElementInvisibility('.shadow-lg', '25.2.1', 'Upon Clicking the "Update" button:', 'The "Edit Price List" modal window still visible', assertionResults, failureMessages)

            cy.get('.MuiTableBody-root').contains(specificpricelist.editpricelist).should('exist')
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-pricelist-data.json').then((data) => {
            
            for (const key in data) {

                if (data[key].onlyDelete === true) {

                    cy.wait(2000)

                    cy.contains('tbody > tr', data[key].pricelist).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkHeaderTitle('.px-8', '30.1', 'Upon clicking the "Delete" button on pager UI', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', '30.3', 'Upon clicking the "Delete" button on pager UI','Do you want to delete: ' + data[key].pricelist + ' ?', assertionResults, failureMessages);

                    cy.get('.border-blue-500').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '30.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.contains('tbody > tr', data[key].pricelist).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.get('.border-red-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '30.5.1', 'Upon Clicking the "Save" button:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '30.5.2', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)
                }
            }

        })

        cy.checkForFailure(assertionResults, failureMessages)
    })


    it('Search Functionality', () => {

        cy.fixture('master-pricelist-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlySearchVal === true) {

                    // search valid data
                    cy.wait(2000)

                    cy.get('[data-testid="SearchIcon"]').click()
    
                    cy.get('input[placeholder="Search Pricelist"]')
                      .clear()
                      .type(data[key].pricelist)

                    cy.wait(2000)
    
                    cy.get('.MuiTableBody-root').contains(data[key].pricelist).should('exist')

                }

                if (data[key].onlySearchInval === true) {

                    // search invalid or not existing data
                    cy.wait(2000)
                
                    cy.get('[data-testid="SearchIcon"]').click()

                    cy.get('input[placeholder="Search Pricelist"]')
                      .clear()
                      .type(data[key].pricelist)

                    cy.wait(4000)

                    cy.get('td > .MuiTypography-root').should('have.text', 'No records to display')

                }

            }
        })
    })

    it('Print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]').click()

        cy.wait(15000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {

            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file))

            expect(fileName).to.exist;

        })
    })

    it('Back Button Functionality', () => {

        cy.wait(2000);

        cy.get(':nth-child(1) > .flex > .anticon > svg').click();

        cy.get('.text-\\[3rem\\]').should('be.visible')
          .and('have.text', 'Masterfile');
    })
});