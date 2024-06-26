
let assertionResults = [];
let failureMessages = [];

describe('MEMC', () => {

    before(() => {

        // Clear the memcfile table before tests
        cy.task("queryDb","TRUNCATE TABLE memcfile")

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM memcfile").then((records) => {

            expect(records.length).to.be.equal(0)
            
        })

        // Delete all file in downloads for check print functinality test case
        cy.task('clearDownloads')

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-memc-data')
        cy.execute('npm run sheet-converter module-selector-assert')
        // cy.execute('npm run sheet-converter memc-add-el')
        // cy.execute('npm run sheet-converter memc-edit-el')
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

        // delete unecessary inputed data in the table 'memcfile'

        cy.fixture('data-to-delete.json').then((data) => {

            // Loop through each character and delete corresponding rows from the 'memcfile' table
            data.forEach((item) => {

                const specialChar = item.dataToDelete;
                const deleteQuery = `DELETE FROM memcfile WHERE codedsc = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {

                    cy.log(`Deleted data with description: ${specialChar}`); // Log successful deletions

                })
            })
    
            // Ensure the table is clear of specified data
            cy.task('queryDb', 'SELECT * FROM memcfile').then((records) => {

                const remainingData = records.map((record) => record.description);
                const deletedChars = data.map((item) => item.dataToDelete);
                
                // Ensure no deleted special characters are still in the table
                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char);

                })
    
                cy.log('Specified data Successfully deleted.'); // Log success
            })
        })
    })

    it('Check MEMC Page', () => {   

        cy.navigateToModule('Master File', 'MEMC')

        cy.url({timeout: 10000}).should('contain', '/memc/?menfield=masterfile_memc')

        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to MEMC:', ' "MEMC" pager U/I window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to MEMC pager U/I', 'MEMC', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'MEMC', 'Value (PHP)'], '1.2.2', 'Upon Navigating to MEMC pager U/I', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to MEMC pager U/I', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Add Functionality', () => {

        cy.fixture('master-memc-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', '"Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add MEMC', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="codedsc"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Description *', assertionResults,failureMessages)

            cy.checkLabelCaption('label[for="itmdsc"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Value *', assertionResults,failureMessages)

            cy.get('#codedsc').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#value').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })
            
            // 2.1.5 Check correct all object position

            // cy.validateElements('memc-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)


            // cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]') .click()

            for (const key in data){

                // cy.get('.sc-eDLKkx > .anticon > svg').click()

                cy.wait(4000) 
                
                    if (data[key].memc === "null") {

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.get('.border-blue-500').click()

                        cy.wait(4000)

                        cy.checkLabelCaption('.text-sm', '13.2', 'Upon clicking the "Save" button:', 'MEMC * is required', assertionResults, failureMessages)

                        cy.get('#codedsc').clear()

                        cy.get('#value').type(data[key].value)

                        cy.checkLabelCaption('.text-sm', '13.1', 'Upon clicking the "Save" button:', 'MEMC * is required', assertionResults, failureMessages)

                        cy.wait(4000)

                        cy.get('#codedsc').type('MEMC 100')

                        cy.get('#value').type('100')

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '15.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                        cy.get('.px-8 > .flex > .anticon > svg').click()

                    } 
                    
                    else if (data[key].memc === "MEMC 600") {

                        cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.get('#value').realClick()

                        cy.get('.border-red-500').click()

                        cy.checkLabelCaption('.h-auto', '8.1', 'Upon Clicking the "Save" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                        cy.contains('button[class*="border-red-500"]', 'No').click()

                        cy.wait(3000)

                        cy.checkElementVisibility('.shadow-lg', '8.2.1', 'Upon Clicking the "No" button:', 'The "Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.border-red-500').click()

                        cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                        cy.wait(3000)

                        cy.checkElementInvisibility('.shadow-lg', '48.3.1', 'Upon Clicking the "Yes" button:', 'The "Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '40.3.2', 'Upon clicking the "Yes" button', 'MEMC', assertionResults, failureMessages)

                        cy.wait(4000)

                        cy.get('.sc-eDLKkx > .anticon > svg').click()

                    }

                    else if (data[key].memc === "% & ( ) / - .") {

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.get('#value').type(data[key].value)

                        cy.get('.border-blue-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.checkElementInvisibility('.shadow-lg', '11.2.1', 'Upon clicking the "OK" button:', 'The "Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)

                        // 43.2.2 Check if the "Description" textbox object is cleared or blank.

                    }

                    else if (data[key].memc === "Jollibee Filipino Sweet Style Spaghetti Langhap Sarap") {

                        cy.get('#codedsc').clear().type(data[key].memc);

                        cy.checkElementVisibility('.text-sm', '19.1', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                        cy.get('#value').type(data[key].value)

                        cy.get('.border-blue-500').click()

                        cy.checkElementVisibility('.text-sm', '20.1', 'Upon clicking the "Save" button:', '"Please input valid data." notificaation message is not visible', assertionResults, failureMessages)

                    }

                    else if (data[key].memc === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.checkLabelCaption('.Toastify__toast-body', '16.1', 'Upon encoding not allowed special characters:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                        cy.get('#value').realClick()

                        cy.get('#value').type(data[key].value)

                        cy.get('.border-blue-500').click()
                        
                        cy.checkLabelCaption('.Toastify__toast-body', '17.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                        cy.checkElementInvisibility('.shadow-lg', '17.2.1', 'Upon clicking the "OK" button:', 'The "Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)

                        // 16.2.2 Check if the "Description" textbox object is cleared or blank.

                        cy.wait(4000)
                    }

                    else {

                        cy.wait(4000)

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.get('#value').type(data[key].value)

                        cy.get('.border-blue-500').click()  
                        
                        cy. wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.wait(2000)
                        
                        cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)
                        
                        cy.get('.MuiTableBody-root').contains(data[key].memc).should('exist')

                    }
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    })

    it('Edit Functionality', () => {

        cy.fixture('master-memc-data.json').then((data) => {

            const specificmemc = data[0];

                cy.wait(2000)

                // 54. Should have an existing data to edit 
                cy.contains('tbody > tr', specificmemc.memc).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()
                })

                cy.checkElementVisibility('.shadow-lg', '22.1', 'Upon Clicking the "Edit" button:', 'The "Edit MEMC" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '22.1.1', 'Upon clicking the "Edit" button on pager UI', 'Edit MEMC', assertionResults, failureMessages)

                cy.checkLabelCaption('label[for="codedsc"]', '22.1.2', 'Upon clicking the "Edit" button on pager U/I', 'MEMC *', assertionResults, failureMessages)

                cy.checkLabelCaption('label[for="itmdsc"]', '22.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Value *', assertionResults, failureMessages)
            
                // 54.1.3 Check correct object (textbox) width
                // Add when needed

                // 54.1.4 Check correct buttons(s) caption

                // 54.1.5 Check correct all object position

                // 54.1.6 Check enabled/disable of all object
                // cy.validateElements('memc-edit-el.json', '22.1.4 & 22.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

                cy.get('#codedsc')
                  .should('have.value', specificmemc.memc)
                  .clear()

                cy.get('#codedsc').clear().type(specificmemc.editmemc)

                cy.get('#value').clear().type('{rightarrow}{rightarrow}').type(specificmemc.editvalue)

                cy.get('.border-blue-500').click()

                cy.checkLabelCaption('.Toastify__toast-body', '25.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '25.2.1', 'Upon Clicking the "Update" button:', 'The "Edit MEMC" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificmemc.editmemc).should('exist')
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-memc-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlyDelete === true){

                    cy.wait(2000)

                    cy.contains('tbody > tr', data[key].memc).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkElementVisibility('.px-8', '30.1', 'Upon clicking the "Delete" button on pager UI:', 'The "Delete Confirmation" modal is not visible.')

                    cy.checkHeaderTitle('.px-8', '30.2', 'Upon clicking the "Delete" button on pager UI:', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', 'Do you want to delete: ' + data[key].memc + ' ?', assertionResults, failureMessages);

                    cy.validateElements('delete-confirm-el.json', '30.3', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

                    cy.contains('button[class*="border-blue-500"]', 'Cancel').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '30.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.wait(3000)

                    cy.contains('tbody > tr', data[key].memc).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.contains('button[class*="border-red-500"]', 'Confirm').click()

                    cy.checkLabelCaption('.Toastify__toast-body', '30.5.1', 'Upon Clicking the "Save" button:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '30.5.2 ', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                }

            }

        })

        cy.checkForFailure(assertionResults, failureMessages);
    })


    it('Search Functionality', () => {

        cy.fixture('master-memc-data.json').then((data) => {

            const specificmemc = data[2];

                cy.wait(2000);


                cy.get('[data-testid="SearchIcon"]')
                    .click();

  
                cy.get('input[placeholder="Search MEMC"]')
                    .clear()
                    .type(specificmemc.memc)
                    .type('{enter}');

                cy.wait(2000)
   
                cy.get('.MuiTableBody-root').contains(specificmemc.memc).should('exist')
        })

        cy.wait(2000);
                
                cy.get('[data-testid="SearchIcon"]')
                    .click();

                cy.get('input[placeholder="Search MEMC"]')
                    .clear()
                    .type('MEMC 500')
                    .type('{enter}')

                cy.wait(4000)

                cy.get('td > .MuiTypography-root').should('have.text', 'No records to display')
    })

    it('Print functionality', () => {

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

        cy.get(':nth-child(1) > .flex > .anticon > svg').click();

        cy.get('.text-\\[3rem\\]').should('be.visible').should('have.text', 'Masterfile')
        
    })
})
