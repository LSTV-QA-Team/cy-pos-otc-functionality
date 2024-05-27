
let assertionResults = [];
let failureMessages = [];

describe('Special Request', () => {


    before(() => {
        // Clear the modifierfile table before tests
        cy.task("queryDb","TRUNCATE TABLE modifierfile")

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM modifierfile").then((records) => {
            expect(records.length).to.be.equal(0)
        });

        // Delete all file in downloads for check print functinality test case
        cy.task('clearDownloads')

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-specialreq-data')
        cy.execute('npm run sheet-converter module-selector-assert')
        cy.execute('npm run sheet-converter specialreq-add-el')
        cy.execute('npm run sheet-converter specialreq-edit-el')
        cy.wait(4000)

    });
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login('lstv', 'lstventures')

        

    });

    // after(() => {

    //     // delete unecessary inputed data in the table 'modifierfile'

    //     cy.fixture('data-to-delete.json').then((data) => {
    //         // Loop through each character and delete corresponding rows from the 'modifierfile' table
    //         data.forEach((item) => {
    //             const specialChar = item.dataToDelete;
    //             const deleteQuery = `DELETE FROM modifierfile WHERE modcde = '${specialChar}'`;
                
    //             cy.task('queryDb', deleteQuery).then(() => {
    //                 cy.log(`Deleted data with description: ${specialChar}`); // Log successful deletions
    //             });
    //         });
    
    //         // Ensure the table is clear of specified data
    //         cy.task('queryDb', 'SELECT * FROM modifierfile').then((records) => {
    //             const remainingData = records.map((record) => record.description);
    //             const deletedChars = data.map((item) => item.dataToDelete);
                
    //             // Ensure no deleted special characters are still in the table
    //             deletedChars.forEach((char) => {
    //                 expect(remainingData).to.not.include(char);
    //             });
    
    //             cy.log('Specified data successfully deleted'); // Log success
    //         });
    //     });
    // })

    it.only('Check Special Request Page', () => {  
        
        cy.navigateToModule('Master File', 'Special Request')

        cy.url({timeout: 10000})
            .should('contain', 'specialRequests/?menfield=masterfile_special_requests')
        
        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Special Request:', 'The"Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Special Request pager U/I', 'Special Request', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Special Request pager U/I', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to Special Request pager U/I', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    });

    it.only('Add Functionality', () => {

        cy.fixture('master-specialreq-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', 'The "Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Special Request', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Special Request Description *', assertionResults,failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Subclassification *', assertionResults, failureMessages)
            
            cy.get('#modcde').invoke('outerWidth').then((width) => {

                 expect(width).to.equal(420);
                    
            })

            cy.get('#modgrpcde').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420);
                   
            })

            // 2.1.5 Check correct all object position

            cy.validateElements('specialReq-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)
                            
            cy.fixture('dropdown-values.json').then((data) => { 

                const expectedOptions = data.itemSubclass;

                cy.get('#modgrpcde').click()

                cy.get('.select__menu-list .select__option').should('have.length', 12);

                cy.get('.select__menu-list--is-multi')
                    .children('.select__option')
                    .then(($options) => {
                    // Get the text of all options in the dropdown
                    const actualOptions = [...$options].map(option => option.textContent.trim());

                    // Check that each expected option is present in the actual options
                    expectedOptions.forEach(expectedOption => {
                        expect(actualOptions).to.include(expectedOption);
                    });
                });

            })

            cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]') .click();

            for (const key in data){

                cy.get('.sc-eDLKkx > .anticon > svg').click()

                cy.wait(4000) 
                
                cy.get('#modcde')
                    .type(data[key].specialReq)
                    .then(($input) => {

                            if ($input.val() === "null") {

                                // 11. Click "Save" button.
                                cy.get('.border-blue-500').click()

                                cy.wait(4000)

                                cy.checkLabelCaption('.text-sm', '45.2', 'Upon clicking the "Save" button:', 'Item Class * is required', assertionResults, failureMessages)

                                cy.get('#modcde').clear()

                                cy.get('#modgrpcde').click()

                                cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                                cy.checkLabelCaption('.text-sm', '45.1', 'Upon clicking the "Save" button:', 'Item Subclass Description * is required', assertionResults, failureMessages)

                                cy.wait(4000)

                                cy.get('#modcde').type('Extra Gravy')

                                cy.get('#modgrpcde').click()

                                cy.get('.select__menu-list--is-multi').contains('.select__option', 'Chicken').click()

                                // 15. Click "Save" button.
                                cy.get('.border-blue-500').click()

                                cy.checkLabelCaption('.Toastify__toast-body', '47.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                                // Click "x" close.
                                cy.get('.px-8 > .flex > .anticon > svg').click()


                            } 
                            
                            else if ($input.val() === "No plastic utensils") {

                                cy.get('#modgrpcde').click()

                                cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                                // 6. Click "Cancel button"
                                cy.get('.border-red-500').click()

                                cy.checkLabelCaption('.h-auto', '40.1', 'Upon Clicking the "Save" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                                // 40.2 Click "No" button
                                cy.contains('button[class*="border-red-500"]', 'No').click()

                                cy.wait(3000)

                                // 6.2.1 Check if the modal window still visible
                                cy.checkElementVisibility('.shadow-lg', '6.2.1', 'Upon Clicking the "No" button:', 'The "Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                                // 40 Click "Cancel" button.
                                cy.get('.border-red-500').click()

                                // 40.3 Click "Yes" button.
                                cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                                cy.wait(3000)

                                cy.checkElementInvisibility('.shadow-lg', '40.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                                cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '40.3.2', 'Upon clicking the "Yes" button', 'Special Request', assertionResults, failureMessages)


                            }

                            else if ($input.val() === "% & ( ) / - .") {

                                cy.get('#modgrpcde').click()

                                cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                                cy.get('.border-blue-500').click()

                                cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon Clicking the "Save" button:', 'Successfully saved', assertionResults, failureMessages) 

                                cy.checkElementInvisibility('.shadow-lg', '11.2.1', 'Upon clicking the "OK" button:', 'The "Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                                // 43.2.2 Check if the "Description" textbox object is cleared or blank.

                            }

                            else if ($input.val() === "This is a very long string that exceeds the maximum allowed length.") {

                                cy.wrap($input).should('have.value', data[key].specialReq);

                                cy.checkElementVisibility('.text-sm', '51.1', 'Upon encoding data:', 'The validation message for "Maximum length exceeded, 50 characters only." was not visible.', assertionResults, failureMessages)

                                cy.get('#modgrpcde').click()

                                cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                                cy.get('.border-blue-500').click()

                                cy.checkElementVisibility('.text-sm', '52.2', 'Upon clicking the "Save" button:', '"Please limit your input to 50 characters." notificaation message is not visible', assertionResults, failureMessages)

                            }

                            else if ($input.val() === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` \\ ~ \\\" | \\ ] [ ] ; :") {

                                cy.get('#modgrpcde').click()

                                cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                                cy.get('.border-blue-500').click()
                                
                                cy.checkLabelCaption('.Toastify__toast-body', '49.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                                // 16.2 click "OK" button on notification message.

                                cy.checkElementInvisibility('.shadow-lg', '49.2.1', 'Upon clicking the "OK" button:', 'The "Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                                // 16.2.2 Check if the "Description" textbox object is cleared or blank.


                            }

                            else {

                                cy.wrap($input).should('have.value', data[key].specialReq)

                                cy.get('#modgrpcde').click()

                                cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                                cy.get('.border-blue-500').click()

                                cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved', assertionResults, failureMessages) 

                                // 4.2 Click "OK" button

                                cy.wait(3000)
                                
                                cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                                cy.get('.MuiSelect-select.MuiTablePagination-select').click();

                                cy.get('ul[role="listbox"] li').contains('15').click();
                                
                                cy.get('.MuiTableBody-root').contains(data[key].specialReq).should('exist')
                            }
                }) 
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    });

    it.only('Edit Functionality', () => {
        cy.fixture('master-specialreq-data.json').then((data) => {

            const specificSpecialReq = data[7];

                cy.get('.MuiSelect-select.MuiTablePagination-select').click();

                cy.get('ul[role="listbox"] li').contains('15').click();

                cy.wait(2000);

                cy.contains('tbody > tr', specificSpecialReq.specialReq).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()
                })

                cy.checkElementVisibility('.shadow-lg', '54.1', 'Upon Clicking the "Edit" button:', 'The "Edit Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '54.1.1', 'Upon clicking the "Edit" button on pager UI', 'Edit Special Request', assertionResults, failureMessages)

                cy.checkLabelCaption('.mb-2', '54.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Item Subclass', assertionResults, failureMessages)
            
                // 54.1.3 Check correct object (textbox) width
                // Add when needed

                // 54.1.4 Check correct buttons(s) caption

                // 54.1.5 Check correct all object position

                cy.validateElements('specialReq-edit-el.json', '54.1.4 & 54.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

                cy.get('#modcde')
                    .should('have.value', specificSpecialReq.specialReq)
                    .clear()

                cy.get('#modcde').type(specificSpecialReq.editSpecialReq)

                cy.contains('.select__multi-value', specificSpecialReq.itemSubclass)
                    .find(`div[aria-label="Remove ${specificSpecialReq.itemSubclass}"]`)
                    .click()

                cy.get('#modgrpcde').click()

                cy.get('.select__menu-list--is-multi').contains('.select__option', specificSpecialReq.editItemSubclass).click()

                cy.get('.border-blue-500').click()

                cy.checkLabelCaption('.Toastify__toast-body', '57.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '57.2.1', 'Upon Clicking the "Update Data" button:', 'The "Edit Special Request" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificSpecialReq.editSpecialReq).should('exist')
            })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    });

    it.only('Delete Functionality', () => {
        cy.fixture('master-specialreq-data.json').then((data) => {
            for (const key in data) {
                if (data[key].onlyDelete === true) {

                    cy.wait(2000);

                    cy.contains('tbody > tr', data[key].specialReq).within(() => {
                        
                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()
                    });

                    cy.checkElementVisibility('.px-8', '62.1', 'Upon clicking the "Delete" button on pager UI:', 'The "Delete Confirmation" modal is not visible.')

                    cy.checkHeaderTitle('.px-8', '62.2.1', 'Upon clicking the "Delete" button on pager UI:', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', 'Do you want to delete: ' + data[key].specialReq + ' ?', assertionResults, failureMessages);

                    cy.validateElements('delete-confirm-el.json', '62.3', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

                    cy.contains('button[class*="border-blue-500"]', 'Cancel').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '62.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.wait(3000)

                    cy.contains('tbody > tr', data[key].specialReq).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                    })

                    cy.contains('button[class*="border-red-500"]', 'Confirm').click()

                    cy.checkLabelCaption('.Toastify__toast-body', '62.5.1', 'Upon Clicking the "Save" button:', 'Successfully Deleted', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '62.5.2 ', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                }
            }
        })

        cy.checkForFailure(assertionResults, failureMessages);
    });


    it.only('Search Functionality', () => {
        cy.fixture('master-specialreq-data.json').then((data) => {
            for (const key in data) {

                if (data[key].onlySearchVal === true) {

                    // search valid data
                    cy.wait(2000)

                    cy.get('[data-testid="SearchIcon"]').click()

                    cy.get('#\\:rb\\:')
                        .clear()
                        .type(data[key].specialReq)
                        .type('{enter}')

                    cy.wait(2000)
    
                    cy.get('.MuiTableBody-root').contains(data[key].specialReq).should('exist')

                }

                if (data[key].onlySearchInval === true) {

                    // search invalid or not existing data
                    cy.wait(2000)
                            
                    cy.get('[data-testid="SearchIcon"]')
                        .click();
        
                    cy.get('#\\:rb\\:')
                        .clear()
                        .type(data[key].specialReq)
        
                    cy.wait(4000)
        
                    cy.get('td > .MuiTypography-root').should('have.text', 'No records to display')
                }
            }
        })
    });

    it.only('Print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]').click()

        cy.wait(8000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {
            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file));
            expect(fileName).to.exist;
        });
    });

    it.only('Back Button Functionality', () => {

        cy.wait(2000);

        cy.get(':nth-child(1) > .flex > .anticon > svg').click();

        cy.get('.text-\\[3rem\\]').should('be.visible')
            .should('have.text', 'Masterfile');
    });
});
