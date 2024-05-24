
let assertionResults = [];
let failureMessages = [];

describe('Item Classification', () => {


    before(() => {
        // Clear the itemclassfile table before tests
        cy.task("queryDb","TRUNCATE TABLE itemclassfile")

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM itemclassfile").then((records) => {
            expect(records.length).to.be.equal(0)
        });

        // Delete all file in downloads for check print functinality test case
        cy.task('clearDownloads')

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-itemclass-data')
        cy.wait(4000)

    });
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login('lstv', 'lstventures')

    });

    after(() => {

        // delete unecessary inputed data in the table 'itemclassfile'

        cy.fixture('data-to-delete.json').then((data) => {
            // Loop through each character and delete corresponding rows from the 'itemclassfile' table
            data.forEach((item) => {
                const specialChar = item.dataToDelete;
                const deleteQuery = `DELETE FROM itemclassfile WHERE itmcladsc = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {
                    cy.log(`Deleted data with description: ${specialChar}`); // Log successful deletions
                });
            });
    
            // Ensure the table is clear of specified data
            cy.task('queryDb', 'SELECT * FROM itemclassfile').then((records) => {
                const remainingData = records.map((record) => record.description);
                const deletedChars = data.map((item) => item.dataToDelete);
                
                // Ensure no deleted special characters are still in the table
                deletedChars.forEach((char) => {
                    expect(remainingData).to.not.include(char);
                });
    
                cy.log('Specified data successfully deleted'); // Log success
            });
        });
    })

    it.only('Check Item Classification Page', () => {   

        // 1. Navigate to page
        cy.navigateToModule('Master File', 'Item Classifications')

        // 1.1 Check if correct URL.
        cy.url({timeout: 10000})
            .should('contain', '/itemClassifications/?menfield=masterfile_itemclass')

           
        // 1.2 Check if the pager U/I is displayed. 
        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Item Classification:', 'The"Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)


        cy.wait(2000)

        // 1.2.1 Check title header  
        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Item Classification pager U/I', 'Item Classification', assertionResults, failureMessages)

        cy.wait(2000)

        // 1.2.2 Check correct table column(s) header caption. 
        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Item Classification pager U/I', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        // 1.2.5 Check enabled/disabled of all objects
        cy.validateElements('itemclass-selector-assert.json', '1.2.5', 'Upon Navigating to Item Classification pager U/I', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Add Functionality', () => {

        cy.fixture('master-itemclass-data.json').then((data) => {

            // 2. Click "Add" button from pager U/I
            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            // 2.1 Check if modal window is visible.
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', 'The "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

            // 2.1.1 Check correct modal title header.
            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Item Classification', assertionResults, failureMessages)

            // 2.1.2 Check correct label caption.
            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Description *', assertionResults, failureMessages)
            
            // 2.1.3 Check correct object (textbox) width
            // cy.get('#itmcladsc')
            //     .invoke('outerWidth')
            //     .should('eq', 420)

            // 2.1.4 Check correct buttons(s) caption

            // 2.1.5 Check correct all object position

            // 2.1.6 Check enabled/disable of all object
            cy.validateElements('itemclass-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            for (const key in data){
                
                // 3. Encode on description textbox object
                cy.get('#itmcladsc')
                    .type(data[key].itemClass)
                    .then(($input) => {

                            if ($input.val() === "null") {
                                
                                // 10. Leave the "Description" textbox object blank.
                                cy.get('#itmcladsc').clear()

                                // 11. Click "Save" button.
                                cy.get('.border-blue-500').click()

                                // 11.1 check if the validation message appear "Description * is required." 
                                cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Description * is required', assertionResults, failureMessages)

                                
                                //14. Encode existing data (ex. MAIN COURSE) for duplicate data.
                                cy.get('#itmcladsc').type('MAIN COURSE')

                                // 15. Click "Save" button.
                                cy.get('.border-blue-500').click()

                                // 15.1 Check if the notification message appear "Duplicate entry! Kindly check your inputs"
                                cy.checkLabelCaption('.Toastify__toast-body', '15.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                                // Click "x" close.
                                cy.get('.px-8 > .flex > .anticon > svg').click()


                            } 
                            
                            else if ($input.val() === "BURGERS") {

                                // 6. Click "Cancel button"
                                cy.get('.border-red-500').click()

                                // 6.1 check if the notification message appear "Are you sure you want to cancel?" with "Yes" and "No" button.
                                cy.checkLabelCaption('.h-auto', '6.1', 'Upon Clicking the "Save" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                                // 6.2 Click "No" button
                                cy.contains('button[class*="border-red-500"]', 'No').click()

                                cy.wait(3000)

                                // 6.2.1 Check if the modal window still visible
                                cy.checkElementVisibility('.shadow-lg', '6.2.1', 'Upon Clicking the "No" button:', 'The "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

                                // 6. Click "Cancel" button.
                                cy.get('.border-red-500').click()

                                // 6.3 Click "Yes" button.
                                cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                                cy.wait(3000)

                                // 6.3.1 Check if the modal windows is not visible.
                                cy.checkElementInvisibility('.shadow-lg', '6.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

                                // 6.3.2 Check if the active windows back to Pager U/I.
                                cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '6.3.2', 'Upon clicking the "Yes" button', 'Item Classification', assertionResults, failureMessages)


                            }

                            else if ($input.val() === "% & ( ) / - .") {

                                // 11. Click "Save" button.
                                cy.get('.border-blue-500').click()

                                // 11.1 Check if the notification message appear "Sucessfully saved"
                                cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon Clicking the "Save" button:', 'Successfully saved', assertionResults, failureMessages) 

                                // 11.2.1 Check if the modal active window is still active
                                cy.checkElementInvisibility('.shadow-lg', '11.2.1', 'Upon clicking the "OK" button:', 'The "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

                                // 11.2.2 Check if the "Description" textbox object is cleared or blank.

                            }

                            else if ($input.val() === "Jollibee Filipino Sweet Style Spaghetti Langhap Sarap") {

                                cy.wrap($input).should('have.value', data[key].itemClass);

                                // 18.1 Check if the validation message appear "Maximum length exceeded, 50 characters only."
                                cy.checkElementVisibility('.text-sm', '18.1', 'Upon encoding data:', 'The validation message for "Maximum length exceeded, 50 characters only." was not visible.', assertionResults, failureMessages)

                                // Click "Save" button.
                                cy.get('.border-blue-500').click()

                            }

                            else if ($input.val() === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` \\ ~ \\\" | \\ ] [ ] ; :") {

                                // 16. Click "Save" button.
                                cy.get('.border-blue-500').click()

                                // 16.1 Check if the notification message appear "Sucessfully saved"
                                cy.checkLabelCaption('.Toastify__toast-body', '16.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                                // 16.2 click "OK" button on notification message.


                                // 16.2.1 Check if the modal active window is still active
                                cy.checkElementInvisibility('.shadow-lg', '6.2.1', 'Upon clicking the "OK" button:', 'The "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

                                // 16.2.2 Check if the "Description" textbox object is cleared or blank.


                            }

                            else {

                                cy.wrap($input).should('have.value', data[key].itemClass);

                                // 4. Click "Save" button
                                cy.get('.border-blue-500').click()

                                
                                // 4.1 Check if the notification message appear "Sucessfully saved."
                                cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved', assertionResults, failureMessages) 

                                // 4.2 Click "OK" button

                                cy.wait(3000)
                                
                                // 4.2.1 Check if modal window is still visible.
                                cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

                                
                                // 6.3.2.1 Check encoded data should exist on Pager U/I table.
                                cy.get('.MuiTableBody-root').contains(data[key].itemClass).should('exist')
                            }
                }) 
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    });

    it('Edit Functionality', () => {
        cy.fixture('master-itemclass-data.json').then((data) => {

            const specificItemClass = data[4];

                cy.wait(2000)

                // 21. Should have an existing data to edit 
                cy.contains('tbody > tr', specificItemClass.itemClass).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()
                })

                // 21.1 Check if modal window is visible.
                cy.checkElementVisibility('.shadow-lg', '21.1', 'Upon Clicking the "Edit" button:', 'The "Edit Item Classification" modal window was not visible or active.', assertionResults, failureMessages)

                // 21.1.1 Check correct modal title header.
                cy.checkHeaderTitle('.px-8', '21.1.1', 'Upon clicking the "Edit" button on pager UI', 'Edit Item Classification', assertionResults, failureMessages)

                // 21.1.2 Check correct label caption.
                cy.checkLabelCaption('.mb-2', '21.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Description *', assertionResults, failureMessages)
            
                // 21.1.3 Check correct object (textbox) width
                // Add when needed

                // 21.1.4 Check correct buttons(s) caption

                // 21.1.5 Check correct all object position

                // 21.1.6 Check enabled/disable of all object
                cy.validateElements('itemclass-edit-el.json', '21.1.4 & 21.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

                // 22. Clear "Description" textbox object. 
                cy.get('#itmcladsc')
                    .should('have.value', specificItemClass.itemClass)
                    .clear()

                // 23. Edit the existing data. 
                cy.get('#itmcladsc').type(specificItemClass.editItemClass)

                // 24. Click "Save" button.
                cy.get('.border-blue-500').click()

                // 24.1 Check if the notification message appear "Sucessfully saved."
                cy.checkLabelCaption('.Toastify__toast-body', '24.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                // 24.2.1 Check if the modal windows is not visible.
                cy.checkElementInvisibility('.shadow-lg', '24.2.1', 'Upon Clicking the "Update Data" button:', 'The "Edit Item Classification" modal window still visible', assertionResults, failureMessages)

                // 24.2.3 Check that the edited data appears in the table. 
                cy.get('.MuiTableBody-root').contains(specificItemClass.editItemClass).should('exist')
            })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Delete Functionality', () => {
        cy.fixture('master-itemclass-data.json').then((data) => {
            
            const specificItemClass = data[3];

                cy.wait(2000);

                // 29. Should have an existing data to delete
                cy.contains('tbody > tr',specificItemClass.itemClass).within(() => {
                    // 29. Click the delete button within this row
                    cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                });


                // 29.1 Verify delete modal should have specific title " Delete Confirmation" and be visible.
                cy.checkHeaderTitle('.px-8', '29.1', 'Upon clicking the "Delete" button on pager UI', 'Delete Confirmation', assertionResults, failureMessages)
                

                // 29.3 Check if the notification message appear "Do you want to delete: BREAKFAST?" with "Yes" and "No" button
                cy.checkLabelCaption('.h-\\[500px\\] > h1', 'Do you want to delete: ' + specificItemClass.editItemClass + ' ?', assertionResults, failureMessages);

                // 29.4 Click "Cancel" button
                cy.contains('button[class*="border-blue-500"]', 'Cancel').click()

                cy.wait(3000)

                // 29.4.1 Check if the modal window still visible
                cy.checkElementInvisibility('.shadow-lg', '29.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                // Click "Delete" button
                cy.contains('tbody > tr', specificItemClass.itemClass).within(() => {
                    // 29. Click the delete button within this row
                    cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                });

                // 29.4 Click "Confirm" button.
                cy.contains('button[class*="border-red-500"]', 'Confirm').click()

                // 29.5.1 Verify it was deleted successfully
                cy.checkLabelCaption('.Toastify__toast-body', '29.5.1', 'Upon Clicking the "Save" button:', 'Successfully Deleted', assertionResults, failureMessages) 

                // 29.4.1 Check if the modal windows is not visible.
                cy.checkElementInvisibility('.shadow-lg', '29.41.3.1', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

            })

        cy.checkForFailure(assertionResults, failureMessages);
    });


    it('Search Functionality', () => {
        cy.fixture('master-itemclass-data.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);


                cy.get('[data-testid="SearchIcon"]')
                    .click();

  
                cy.get('#\\:rb\\:')
                    .should('be.enabled')
                    .clear()
                    .type(data[0].itemClass)
                    .type('{enter}');

                cy.wait(2000)
   
                cy.get('.MuiTableBody-root').contains(data[0].itemClass).should('exist');
            }
        })

        cy.wait(2000);
                
                cy.get('[data-testid="SearchIcon"]')
                    .click();

                cy.get('#\\:rb\\:')
                    .clear()
                    .type('Appetizer')
                    .type('{enter}')

                cy.wait(4000)

                cy.get('td > .MuiTypography-root').should('have.text', 'No records to display');
    });

    
    it('Back Button Functionality', () => {

        cy.wait(2000);

        cy.get(':nth-child(1) > .flex > .anticon > svg').click();

        cy.get('.text-\\[3rem\\]').should('be.visible')
            .should('have.text', 'Masterfile');
    });

    it('Print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]')
          .click();

        cy.wait(10000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {
            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file));
            expect(fileName).to.exist;
        });
    });
});


