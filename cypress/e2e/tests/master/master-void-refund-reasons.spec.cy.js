
let assertionResults = [];
let failureMessages = [];

describe('Void/Refund Reasons', () => {


    before(() => {
        // Clear the voidreasonfile table before tests
        cy.task("queryDb","TRUNCATE TABLE voidreasonfile")

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM voidreasonfile").then((records) => {
            expect(records.length).to.be.equal(0)
        });

        // Delete all file in downloads for check print functinality test case
        cy.task('clearDownloads')

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-voidreasons-data')
        cy.execute('npm run sheet-converter module-selector-assert')
        cy.execute('npm run sheet-converter voidreasons-add-el')
        cy.execute('npm run sheet-converter voidreasons-edit-el')
        cy.wait(4000)

    });
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        cy.login('lstv', 'lstventures')

    });

    after(() => {

        // delete unecessary inputed data in the table 'voidreasonfile'

        cy.fixture('data-to-delete.json').then((data) => {
           
            data.forEach((item) => {
                const specialChar = item.dataToDelete;
                const deleteQuery = `DELETE FROM voidreasonfile WHERE voidcde = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {
                    cy.log(`Deleted data with description: ${specialChar}`); 
                });
            });
    
           
            cy.task('queryDb', 'SELECT * FROM voidreasonfile').then((records) => {

                const remainingData = records.map((record) => record.description);
                const deletedChars = data.map((item) => item.dataToDelete);
                

                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char);

                });
    
                cy.log('Specified data Successfully deleted.'); 
            });
        });
    })

    it('Check Void/Refund Reasons Page', () => { 
        
        cy.navigateToModule('Master File', 'Void/Refund Reasons')

        cy.url({timeout: 10000})
            .should('contain', 'reasons/?menfield=masterfile_void_reasons')

        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Void/Refund Reasons:', 'The "Add Void/Refund Reasons" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Void/Refund Reasons pager U/I:', 'Void/Refund Reasons', assertionResults, failureMessages)

        cy.wait(2000)

        // 1.2.2 Check correct table column(s) header caption. 
        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Void/Refund Reasons pager U/I:', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to Void/Refund Reasons pager U/I:', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Add Functionality', () => {

        cy.fixture('master-voidreasons-data.json').then((data) => {

            cy.wait(4000) 

            cy.get('.sc-eDLKkx > .anticon > svg').click()
                
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', 'The "Add Void/Refund Reasons" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI:', 'Add Void/Refund Reason', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I:', 'Description *', assertionResults, failureMessages)
            
            // 2.1.3 Check correct object (textbox) width
            // cy.get('#voidcde')
            //     .invoke('outerWidth')
            //     .should('eq', 420)

            // 2.1.4 Check correct buttons(s) caption

            // 2.1.5 Check correct all object position

            cy.validateElements('voidreasons-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]') .click();

            for (const key in data){

                cy.get('.sc-eDLKkx > .anticon > svg').click()
                
                cy.get('#voidcde')
                    .type(data[key].voidReasons)
                    .then(($input) => {

                            if ($input.val() === "null") {
                                
                                cy.get('#voidcde').clear()

                                cy.get('.border-blue-500').click()

                                cy.wait(4000)

                                cy.checkLabelCaption('.text-sm', '27.1', 'Upon clicking the "Save" button:', 'Description * is required', assertionResults, failureMessages)

                                cy.get('#voidcde').type('Incorrect Order Entry')

                                cy.get('.border-blue-500').click()

                                cy.checkLabelCaption('.Toastify__toast-body', '29.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                                cy.get('.px-8 > .flex > .anticon > svg').click()

                            } 
                            
                            else if ($input.val() === "Item Out of Stock") {

                                cy.get('.border-red-500').click()

                                cy.checkLabelCaption('.h-auto', '22.1', 'Upon Clicking the "Cancel" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                                cy.contains('button[class*="border-red-500"]', 'No').click()

                                cy.wait(3000)

                                cy.checkElementVisibility('.shadow-lg', '22.2.1', 'Upon Clicking the "No" button:', 'The "Add Void/Refund Reasons" modal window was not visible or active.', assertionResults, failureMessages)

                                cy.get('.border-red-500').click()

                                cy.wait(4000)

                                cy.contains('button[class*="border-blue-500"]', 'Yes').realClick()

                                cy.wait(3000)

                                cy.checkElementInvisibility('.shadow-lg', '22.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Void/Refund Reasons" modal window was not visible or active.', assertionResults, failureMessages)

                                cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '23.', 'Upon clicking the "Yes" button', 'Void/Refund Reason', assertionResults, failureMessages)

                                cy.wait(4000)


                            }

                            else if ($input.val() === "% & ( ) / - .") {

                                cy.get('.border-blue-500').click()
                                
                                cy.wait(4000)

                                cy.checkLabelCaption('.Toastify__toast-body', '25.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                                cy.checkElementInvisibility('.shadow-lg', '25.2.1', 'Upon clicking the "OK" button:', 'The "Add Void/Refund Reasons" modal window was not visible or active.', assertionResults, failureMessages)

                                // 11.2.2 Check if the "Description" textbox object is cleared or blank.

                                cy.wait(4000)

                            }

                            else if ($input.val() === "Jollibee Filipino Sweet Style Spaghetti Langhap Sarap") {

                                cy.wrap($input).should('have.value', data[key].voidReasons);

                                cy.checkElementVisibility('.text-sm', '33.1', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                                cy.get('.border-red-500').click()

                                cy.wait(4000)

                                cy.checkLabelCaption('.h-auto', '35.1', 'Upon Clicking the "Cancel" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                                cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                                cy.wait(4000)

                            }

                            else if ($input.val() === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` \\ ~ \\\" | \\ ] [ ] ; :") {

                                cy.get('.border-blue-500').click()

                                cy.wait(4000)

                                cy.checkLabelCaption('.Toastify__toast-body', '31.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                                // 16.2 click "OK" button on notification message.

                                cy.checkElementInvisibility('.shadow-lg', '31.2.1', 'Upon clicking the "OK" button:', 'The "Add Void/Refund Reasons" modal window was not visible or active.', assertionResults, failureMessages)

                                cy.wait(4000)
                                
                            }

                            else {

                                cy.wrap($input).should('have.value', data[key].voidReasons);

                                cy.get('.border-blue-500').click()

                                cy.wait(4000)

                                cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 
                                
                                cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Void/Refund Reasons" modal window was not visible or active.', assertionResults, failureMessages)

                                // 4.2.2 Check if the "Description" textbox object is cleared or blank.
                                
                                cy.get('.MuiTableBody-root').contains(data[key].voidReasons).should('exist')

                                cy.wait(8000)
                            }
                })
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    });

    it('Edit Functionality', () => {
        cy.fixture('master-voidreasons-data.json').then((data) => {

            const specificVoidReasons = data[7];

                cy.wait(2000)

                cy.contains('tbody > tr', specificVoidReasons.voidReasons).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()
                })

                cy.checkElementVisibility('.shadow-lg', '37.1', 'Upon Clicking the "Edit" button:', 'The "Edit Void/Refund Reasons" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '37.1.1', 'Upon clicking the "Edit" button on pager UI:', 'Edit Void/Refund Reasons', assertionResults, failureMessages)

                cy.checkLabelCaption('.mb-2', '37.1.2', 'Upon clicking the "Edit" button on pager U/I:', 'Description *', assertionResults, failureMessages)
            
                // 37.1.3 Check correct object (textbox) width
                // Add when needed

                // 37.1.5 Check correct all object position

                cy.validateElements('voidreasons-edit-el.json', '37.1.4 & 37.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)
 
                cy.get('#voidcde')
                    .should('have.value', specificVoidReasons.voidReasons)
                    .clear()

                cy.get('#voidcde').type(specificVoidReasons.editVoidReasons)

                cy.get('.border-blue-500').click()

                cy.wait(2000)

                cy.checkLabelCaption('.Toastify__toast-body', '40.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '40.2.1', 'Upon Clicking the "Update Data" button:', 'The "Edit Void/Refund Reasons" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificVoidReasons.editVoidReasons).should('exist')
            })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Delete Functionality', () => {
        cy.fixture('master-voidreasons-data.json').then((data) => {
            for (const key in data) {
                if (data[key].onlyDelete === true) {

                    cy.wait(2000);

                    cy.contains('tbody > tr', data[key].voidReasons).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                    });

                    cy.checkHeaderTitle('.px-8', '41.1', 'Upon clicking the "Delete" button on pager UI', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', 'Do you want to delete: ' + data[key].voidReasons + ' ?', assertionResults, failureMessages);

                    cy.contains('button[class*="border-blue-500"]', 'Cancel').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '41.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.contains('tbody > tr', data[key].voidReasons).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                    });

                    cy.contains('button[class*="border-red-500"]', 'Confirm').click()

                    cy.wait(3000)

                    cy.checkLabelCaption('.Toastify__toast-body', '41.5.1', 'Upon Clicking the "Save" button:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.wait(8000)

                    cy.checkElementInvisibility('.shadow-lg', '41.1.3.1', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)
                }
            }
        })

        cy.checkForFailure(assertionResults, failureMessages)
    });


    it('Search Functionality', () => {
        cy.fixture('master-voidreasons-data.json').then((data) => {
            for (const key in data) {

                if (data[key].onlySearch === true) {

                    cy.wait(2000)


                    cy.get('[data-testid="SearchIcon"]').click()

    
                    cy.get('#\\:rb\\:')
                        .should('be.enabled')
                        .clear()
                        .type(data[key].voidReasons)
                        .type('{enter}')

                    cy.wait(2000)
    
                    cy.get('.MuiTableBody-root').contains(data[key].voidReasons).should('exist')

                }
            }
        })

        cy.wait(2000)
                
                cy.get('[data-testid="SearchIcon"]')
                    .click();

                cy.get('#\\:rb\\:')
                    .clear()
                    .type('Payment Error')
                    .type('{enter}')

                cy.wait(4000)

                cy.get('td > .MuiTypography-root').should('have.text', 'No records to display')
    });

    it('Print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]').click()

        cy.wait(10000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {

            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file));
            expect(fileName).to.exist;
        })
    });

    it('Back Button Functionality', () => {

        cy.wait(2000);

        cy.get(':nth-child(1) > .flex > .anticon > svg').click()

        cy.get('.text-\\[3rem\\]').should('have.text', 'Masterfile')
    });
});


