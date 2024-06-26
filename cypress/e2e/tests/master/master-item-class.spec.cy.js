
let assertionResults = [];
let failureMessages = [];

describe('Item Classification', () => {

    before(() => {

        // Clear the itemclassfile table before tests
        cy.task("queryDb","TRUNCATE TABLE itemclassfile")

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM itemclassfile").then((records) => {

            expect(records.length).to.be.equal(0)

        })

        // Delete all file in downloads for check print functinality test case
        cy.task('clearDownloads')

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-itemclass-data')
        cy.execute('npm run sheet-converter itemclass-edit-el')
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

        // delete unecessary inputed data in the table 'itemclassfile'

        cy.fixture('data-to-delete.json').then((data) => {

            // Loop through each character and delete corresponding rows from the 'itemclassfile' table
            data.forEach((item) => {

                const specialChar = item.dataToDelete;
                const deleteQuery = `DELETE FROM itemclassfile WHERE itmcladsc = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {
                    
                    cy.log(`Deleted data with description: ${specialChar}`); // Log successful deletions

                })
            })
    
            // Ensure the table is clear of specified data
            cy.task('queryDb', 'SELECT * FROM itemclassfile').then((records) => {

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

    it('Check Item Classification Page', () => {   

        cy.navigateToModule('Master File', 'Item Classifications')

        cy.url({timeout: 10000}).should('contain', '/itemClassifications/?menfield=masterfile_itemclass')
           
        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Item Classification:', ' "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Item Classification pager U/I', 'Item Classification', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Item Classification pager U/I', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        cy.validateElements('itemclass-selector-assert.json', '1.2.5', 'Upon Navigating to Item Classification pager U/I', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Add Functionality', () => {

        cy.fixture('master-itemclass-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', '"Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Item Classification', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Description *', assertionResults, failureMessages)
            
            cy.get('#itmcladsc').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            // 2.1.5 Check correct all object position

            cy.validateElements('itemclass-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            // cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]') .click()

            for (const key in data){

                // cy.get('.sc-eDLKkx > .anticon > svg').click()
                
                    if (data[key].itemClass === "null") {

                        cy.get('#itmcladsc').clear().type(data[key].itemClass)
                        
                        cy.get('#itmcladsc').clear()

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.text-sm', '10.1', 'Upon clicking the "Save" button:', 'Description * is required', assertionResults, failureMessages)
                        
                        cy.get('#itmcladsc').type('Food')

                        cy.get('.border-blue-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '12.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                        // cy.get('.px-8 > .flex > .anticon > svg').click()

                    } 
                    
                    else if (data[key].itemClass === "Appetizer") {

                        cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                        cy.get('#itmcladsc').clear().type(data[key].itemClass)

                        cy.get('.border-red-500').click()

                        cy.checkLabelCaption('.h-auto', '5.1', 'Upon Clicking the "Cancel" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                        cy.contains('button[class*="border-red-500"]', 'No').click()

                        cy.wait(3000)

                        cy.checkElementVisibility('.shadow-lg', '5.2.1', 'Upon Clicking the "No" button in "Cancel" modal:', 'The "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.border-red-500').click()

                        cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                        cy.wait(3000)

                        cy.checkElementInvisibility('.shadow-lg', '5.3.1', 'Upon Clicking the "Yes" button in "Cancel" modal:', 'The "Add Item Classification" modal window was visible or active.', assertionResults, failureMessages)

                        cy.checkElementVisibility('.h-screen', '5.3.2', 'Upon clicking the "Yes" button:', 'Should back in Item Classification Pager U/I', assertionResults, failureMessages)

                        cy.wait(4000)

                        cy.get('.sc-eDLKkx > .anticon > svg').click()

                    }

                    else if (data[key].itemClass === "% & ( ) / - .") {

                        cy.get('#itmcladsc').clear().type(data[key].itemClass)

                        cy.get('.border-blue-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '8.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.wait(4000)

                        cy.checkElementVisibility('.shadow-lg', '8.2.1', 'Upon clicking the "Save" button:', 'The "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

                        // 11.2.2 Check if the "Description" textbox object is cleared or blank.

                    }

                    else if (data[key].itemClass === "Jollibee Filipino Sweet Style Spaghetti Langhap Sarap") {

                        cy.get('#itmcladsc').clear().type(data[key].itemClass)

                        cy.checkInputMaxLength('#itmcladsc', 50, '16.1', 'Upon Encoding in "Item Classification" Textbox:', assertionResults, failureMessages)

                        // cy.checkElementVisibility('.Toastify__toast-body', '16.2', 'Upon encoding data:', 'The validation message "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                        cy.get('.border-blue-500').click()

                        cy.wait(4000)

                    }

                    else if (data[key].itemClass === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                        cy.get('#itmcladsc').clear().type(data[key].itemClass)

                        cy.checkLabelCaption('.Toastify__toast-body', '14.1', 'Upon Clicking the "Save" button:', '"Please use only the following approved special characters: % & ( ) / - ."', assertionResults, failureMessages) 

                        cy.get('.border-blue-500').click()

                        cy.checkElementVisibility('.shadow-lg', '14.2.1', 'Upon clicking the "Save" button:', 'The "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

                        // Check if the "Description" textbox object is cleared or blank. 

                    }

                    else {

                        cy.wait(4000)

                        cy.get('#itmcladsc').clear().type(data[key].itemClass)

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.wait(3000)
                        
                        cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.MuiTableBody-root').contains(data[key].itemClass).should('exist')
                    } 
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    })

    it('Edit Functionality', () => {

        cy.get('.border-red-500').click()

        cy.fixture('master-itemclass-data.json').then((data) => {

        const specificItemClass = data[4];

            cy.wait(2000)

            cy.contains('tbody > tr', specificItemClass.itemClass).within(() => {

                cy.get('[data-icon="edit"][aria-hidden="true"]').click()

            })

            cy.wait(4000)

            cy.checkElementVisibility('.shadow-lg', '19.1', 'Upon Clicking the "Edit" button:', '"Edit Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '19.1.1', 'Upon clicking the "Edit" button on pager UI', 'Edit Item Classification', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '19.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Description *', assertionResults, failureMessages)
        
            // 21.1.3 Check correct object (textbox) width
            // Add when needed

            // 21.1.4 Check correct buttons(s) caption

            // 21.1.5 Check correct all object position

            cy.validateElements('itemclass-edit-el.json', '19.1.4 & 19.1.6', 'Upon clicking the "Edit" button on pager U/I:', assertionResults, failureMessages)

            cy.get('#itmcladsc')
                .should('have.value', specificItemClass.itemClass)
                .clear()

            cy.get('#itmcladsc').type(specificItemClass.editItemClass)

            cy.get('.border-blue-500').click()

            cy.checkLabelCaption('.Toastify__toast-body', '22.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

            cy.checkElementInvisibility('.shadow-lg', '22.2.1', 'Upon Clicking the "Save" button:', 'The "Edit Item Classification" modal window still visible', assertionResults, failureMessages)

            cy.get('.MuiTableBody-root').contains(specificItemClass.editItemClass).should('exist')
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-itemclass-data.json').then((data) => {
            
            for (const key in data) {

                if (data[key].onlyDelete === true) {

                    cy.wait(2000)

                    cy.contains('tbody > tr', data[key].editItemClass).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkHeaderTitle('.px-8', '28.1', 'Upon clicking the "Delete" button on pager UI', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', '41.3', 'Upon clicking the "Delete" button on pager UI', 'Do you want to delete: ' + data[key].editItemClass + ' ?', assertionResults, failureMessages);

                    cy.get('.border-blue-500').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '28.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.wait(4000)

                    cy.get('[data-testid="SearchIcon"]').click()
    
                    cy.get('#\\:rb\\:')
                    .should('be.enabled')
                    .clear()
                    .type(data[key].editItemClass)

                    cy.contains('tbody > tr', data[key].editItemClass).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.get('.border-red-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '28.5.1', 'Upon Clicking the "Save" button:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '28.5.2', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)
                }
            }

        })

        cy.checkForFailure(assertionResults, failureMessages)
    })


    it('Search Functionality', () => {

        cy.fixture('master-itemclass-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlySearchVal === true) {

                    // search valid data
                    cy.wait(2000)

                    cy.get('[data-testid="SearchIcon"]').click()
    
                    cy.get('#\\:rb\\:')
                    .should('be.enabled')
                    .clear()
                    .type(data[0].itemClass)

                    cy.wait(2000)
    
                    cy.get('.MuiTableBody-root').contains(data[0].itemClass).should('exist')

                }

                if (data[key].onlySearchInval === true) {

                    // search invalid or not existing data
                    cy.wait(2000)
                
                    cy.get('[data-testid="SearchIcon"]').click()

                    cy.get('#\\:rb\\:')
                    .clear()
                    .type('Appetizer')

                    cy.wait(4000)

                    cy.get('td > .MuiTypography-root').should('have.text', 'No records to display')

                }

            }
        })
    })

    it('Print functionality', () => {

        cy.wait(2000)

        cy.get('span[role="img"][aria-label="printer"].anticon.anticon-printer.text-center').click()

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
})


