
let visibility = [];
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
    });
    
    beforeEach(() => {

        // reset visibility for each test case
        visibility = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login()

        // Navigate to page
        cy.navigateToModule('Master File', 'Item Classifications')
    });

    it.only('Check Item Classification Page', () => {

        cy.addTestContext(`
            Verify that the test is running on the intended page by checking the URL, It should not failed
        `)

        // 1.1 Check if correct URL
        cy.url({timeout: 10000})
            .should('contain', '/itemClassifications/?menfield=masterfile_itemclass')

        // 1.2 Check if the pager U/I is displayed 
        

        // 1.2.1 Check title header  
        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', 'Item Classifications', visibility, failureMessages)

        // 1.2.2 Check table column header caption
        cy.get('table.MuiTable-root thead tr') 
            .find('th.MuiTableCell-root')       
            .should('have.length', 2)           
            .then($headers => {                 
                // Check individual headers:
                expect($headers.eq(0)).to.contain.text('Actions');  
                expect($headers.eq(1)).to.contain.text('Description'); 
            });

        // Check enabled/disabled of all objects
        cy.fixture('itemclass-selector.json').then((data) => {
            for (const key in data) {
                cy.get(data[key].itemClassSelector)
                    .should(data[key].assertion)
            }
        })
    });

    it('Add Functionality', () => {
        cy.addTestContext(`
        ;`) 

        cy.fixture('master-itemclass-data.json').then((data) => {

            for (const key in data){

                cy.wait(2000);

                // 1. Verify the page header text should be "Item Classifications".
                cy.checkLabel(':nth-child(1) > .text-\\[2rem\\]', 'Item Classifications', visibility, failureMessages);      

                // 3. Verify table visibility and has a header labeled "Description". 
                cy.checkLabel('.css-za273f-MuiTableCell-root', 'Description', visibility, failureMessages);

                // 4. "Add" button should be visible and clickable.
                cy.get('.sc-eDLKkx > .anticon > svg')
                    .should('not.be.disabled')
                    .click();

                cy.wait(4000);  

                // 5. Verify add modal should have specific title "Add item classification" and be visible.
                cy.checkLabel('.px-8', 'Add item classification', visibility, failureMessages);  
                
                // 6. Verify add modal has a text field labeled "Description *", indicating it's a required field.
                cy.checkLabel('.mb-2', 'Description *', visibility, failureMessages);

                // 7. Verify that text field allows users to enter text.
                cy.get('#itmcladsc')
                    .should('be.enabled')
                    .clear();

                // 8. Type valid data in "Item Class" text field (ex. Beverages).
                cy.get('#itmcladsc').type(data[key].itemClass);

                // 9. Modify the assertion for empty data
                cy.get('#itmcladsc').then(($input) => {

                    if ($input.val() === " ") { 
                         // Check for a single space
                      cy.get('#itmcladsc').clear();

                    } else {

                      // Since we're already inside 'then', the element is accessible
                      cy.wrap($input).should('have.value', data[key].itemClass); 

                    }
                  }); 
                  

                // 10. Verify "Add Data" button should be clickable.
                cy.get('.border-blue-500')
                    .should('be.enabled')
                    .click();

                // 11. Expect either success or a meaningful error message
                cy.get('#itmcladsc').then(($input) => {

                    if ($input.val() === "") { 

                        // Expect success for valid data
                        cy.checkValidation('.text-sm', 'Description * is required', visibility, failureMessages);
                        cy.get('.px-8 > .flex > .anticon > svg').click();

                    } else {

                        // Expect success for valid data
                        cy.checkValidation('.Toastify__toast-body', 'Successfully uploaded', visibility, failureMessages); 

                    }
                  });

                // 12. Verify that the added data is visible in "Item Class" table.
                if (key.itemClass === " ") { 

                    cy.get('.border-red-500').click();

                } else {

                    cy.get('.MuiTableBody-root').contains(data[key].itemClass).should('exist');

                }
                  
            }
        }) 

        cy.checkForFailure(visibility, failureMessages);
        
    });

    it('Verify if special characters are allowed', () => {

        cy.addTestContext(`
            Verify that the user can successfully add valid data with special character(&-_/.'); it should appear in the Item Class table. 
        `)

        cy.fixture('allowed_special_char.json').then((data) => {
            for (const key in data){

                cy.wait(2000);

                // 1. "Add" button should be visible and clickable.
                cy.get('.sc-eDLKkx > .anticon > svg')
                  .and('not.be.disabled')
                  .click();

                // 2. Verify that "Item Class" text field allows users to enter valid data with special characters(&-_/.').
                cy.get('#itmcladsc')
                    .should('be.enabled')
                    .clear();

                // 3. Type data in "Item Class" text field.
                cy.get('#itmcladsc').type(data[key].allowSpecialChar);

                // 4. Verify the "Item Class" text field accepts valid data, including special characters(&-_/.'), before clicking the 'Add Data' button.
                cy.get('#itmcladsc').should('have.value', data[key].allowSpecialChar);

                // 5. Verify "Add Data" button should be clickable.
                cy.get('.border-blue-500')
                    .should('be.enabled')
                    .click();

                // 6. Verify "Successfully uploaded" pop-up (modal) should be visible. 
                cy.checkValidation('.Toastify__toast-body', 'Successfully uploaded', visibility, failureMessages);

                cy.checkForFailure(visibility, failureMessages);

                // 7. Verify that the added data is visible in "Item Class" table.
                cy.get('.MuiTableBody-root').contains(data[key].allowSpecialChar).should('exist');
            }
        })


        // delete the special character data in the table 'itemclassfile'

        cy.fixture('allowed_special_char.json').then((data) => {
            // Loop through each character and delete corresponding rows from the 'itemclassfile' table
            data.forEach((item) => {
                const specialChar = item.allowSpecialChar;
                const deleteQuery = `DELETE FROM itemclassfile WHERE itmcladsc = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {
                    cy.log(`Deleted data with description: ${specialChar}`); // Log successful deletions
                });
            });
    
            // Ensure the table is clear of specified data
            cy.task('queryDb', 'SELECT * FROM itemclassfile').then((records) => {
                const remainingData = records.map((record) => record.description);
                const deletedChars = data.map((item) => item.allowSpecialChar);
                
                // Ensure no deleted characters are still in the table
                deletedChars.forEach((char) => {
                    expect(remainingData).to.not.include(char);
                });
    
                cy.log('Specified data successfully deleted'); // Log success
            });
        });
    });

    it('Check upon adding an empty data', () => {

        cy.wait(2000) 

        // 1. "Add" button should be visible and clickable.
        cy.get('.sc-eDLKkx > .anticon > svg')
            .click();

        // 2. Verify that text field allows users to enter text.  
        cy.get('#itmcladsc')
            .should('be.enabled')
            .click();

        // 3. verify the "Item Class" text field is empty, indicating no data has been entered.
        cy.get('#itmcladsc').should('be.empty');

        // 4. Verify "Add Data" button should be clickable.
        cy.get('.border-blue-500')
            .should('be.enabled')
            .click();

        // 5. Verify that the user cannot leave a required text field empty. A validation message should be visible, stating 'Description * is required'.
        cy.checkLabel('.text-sm', 'Description * is required', visibility, failureMessages);
       
        cy.get('.px-8 > .flex > .anticon > svg').click();

        cy.checkForFailure(visibility, failureMessages);


    });

    it('Check upon adding an existing data', () => {
        cy.fixture('master-itemclass-data.json').then((data) => {
            for (const key in data){

                cy.wait(2000);

                // 1. "Add" button should be visible and clickable.
                cy.get('.sc-eDLKkx > .anticon > svg')
                    .should('not.be.disabled')
                    .click();

                // 2. Verify that "Item Class" text field allows users to enter text.
                cy.get('#itmcladsc')
                    .should('be.enabled')
                    .clear();

                // 3. Type an existing data in "Item Class" text field.    
                cy.get('#itmcladsc').type(data[key].itemClass);

                // 4. Click "Add Data"
                cy.get('.border-blue-500')
                    .should('be.enabled')
                    .click();

                // 5. Verify that the user cannot add a duplicate data. A validation message should be visible, stating 'Duplicate entry! Kindly check your inputs.'.
                cy.checkValidation('.Toastify__toast-body', 'Duplicate entry! Kindly check your inputs.', visibility, failureMessages);


                // 6. Click "Canncel" button.
                cy.get('.anticon.anticon-close').click();
  
                cy.wait(2000);

                // 7. Verify that there are no duplicate entries for the given "Item Class" value in the table.
                cy.get('.MuiTableBody-root').find('tr').contains(data[key].itemClass)
                  .should('have.length', 1);
            }
        })

        cy.checkForFailure(visibility, failureMessages);
    })

    it('Check if user can edit data', () => {
        cy.fixture('master-itemclass-data.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);

                // 1. Should have an existing data to edit 
                cy.contains('tbody > tr', data[5].itemClass).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click();
                })

                // 2. Verify add modal should have specific title "Edit item classification" and be visible.
                cy.checkLabel('.px-8', 'Edit Item Classification', visibility, failureMessages);

                
                cy.get('#itmcladsc')
                    .should('be.enabled')
                    .should('have.value', data[5].itemClass);

                // 3. Edit the existing data. 
                cy.get('#itmcladsc')
                  .clear()
                  .type(data[5].editItemClass);

                // 4. "Update" button should be clickable.
                cy.get('.border-blue-500')
                  .should('be.enabled')
                  .click();

                // 5. Verify that the user can edit data. A validation message should be visible, stating 'Duplicate entry! Kindly check your inputs.'.
                cy.checkValidation('.Toastify__toast-body', 'Successfully updated Record!', visibility, failureMessages);

                cy.checkForFailure(visibility, failureMessages);

                // 6. Check that the edited data appears in the table. 
                cy.get('.MuiTableBody-root').contains(data[5].editItemClass).should('exist');
            }
        })

        cy.checkForFailure(visibility, failureMessages);
    });

    it('Check if user can search valid data', () => {
        cy.fixture('master-itemclass-data.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);

                // 1. Verify the "Search" button is visible and clickable.
                cy.get('[data-testid="SearchIcon"]')
                    .click();

                // 2. Enter an existing value in the search field to search for specific data.  
                cy.get('#\\:rb\\:')
                    .should('be.enabled')
                    .clear()
                    .type(data[0].editItemClass)
                    .type('{enter}');

                // 3. Confirm that the searched item is visible in the table.    
                cy.get('.MuiTableBody-root').contains(data[0].editItemClass).should('exist');
            }
        })
    });

    it('Check if user can search invalid data', () => {
        cy.fixture('master-itemclass-data.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);
                
                // 1. Verify the "Search" button is visible and clickable.
                cy.get('[data-testid="SearchIcon"]')
                    .click();

                // 2. Enter an invalid search term and initiate search 
                cy.get('#\\:rb\\:')
                    .should('be.enabled')
                    .clear()
                    .type('Appetizer')
                    .type('{enter}');

                // 3. Verify that there's no data matching the search term. A validation message should be visible, stating 'No records to display'.    
                cy.get('td > .MuiTypography-root')
                    .should('have.text', 'No records to display');

            }
        })
    });

    it('Check if user can delete data', () => {
        cy.fixture('master-itemclass-data.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);

                // 1. Should have an existing data to delete
                cy.contains('tbody > tr', data[0].editItemClass).within(() => {
                    // Click the delete button within this row
                    cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                });


                // 2. Verify delete modal should have specific title " Delete Confirmation" and be visible.
                cy.checkValidation('.px-8', 'Delete Confirmation', visibility, failureMessages);

                // 3. Verify that the data to be deleted matches the expected value
                cy.checkValidation('.h-\\[500px\\] > h1', 'Do you want to delete: ' + data[key].editItemClass + ' ?', visibility, failureMessages);
                                
                // 4. Click "Confirm" button.
                cy.get('.border-red-500')
                  .should('be.enabled')
                  .should('have.text', 'Confirm')
                  .click();

                // 5. Verify it was deleted successfully
                cy.checkValidation('.Toastify__toast-body', 'Successfully deleted Record!', visibility, failureMessages);
            }
        })

        cy.checkForFailure(visibility, failureMessages);
    });

    it('Check back functionality', () => {

        cy.wait(2000);

        // 1. Click 'back' button.
        cy.get(':nth-child(1) > .flex > .anticon > svg').click();

        // 2. Masterfile Menu should be visible.
        cy.get('.text-\\[3rem\\]').should('be.visible')
            .should('have.text', 'Masterfile');
    });

    it('Check print functionality', () => {

        cy.wait(2000)

        // 1. Click 'Print' button.
        cy.xpath('//span[@aria-label="printer"]')
          .click();

        cy.wait(8000)

        // 2. After clicking print button verify the downloaded file.
        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {
            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file));
            expect(fileName).to.exist;
        });
    });
});


