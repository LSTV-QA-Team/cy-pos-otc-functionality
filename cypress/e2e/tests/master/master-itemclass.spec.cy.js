
let visibility = [];
let failureMessages = [];

describe('Item Classification', () => {


    before(() => {
        // Clear the itemclassfile table before tests
        cy.task("queryDb","TRUNCATE TABLE itemclassfile");

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM itemclassfile").then((records) => {
            expect(records.length).to.be.equal(0);
        });

        // Delete all file in downloads for check print functinality test case
        cy.task('clearDownloads');
    });
    
    beforeEach(() => {

        cy.wrap(false).as('hasFailure');

        // reset visibility for each test case
        visibility = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login();

        // Navigate to page
        cy.navigateToModule('Master File', 'Item Classifications');
    });

    it('Verify if user is on Item Classification Page', () => {

        cy.addTestContext(`
            Verify that the test is running on the intended webpage by checking the URL (web address), It should not failed
        `)
        // isang asserion na lang
        // include na lang sa ibang test cases
        // Summarization ng test cases
        // Verify that the main heading on the page reads "Item Classification".
        // Verify that a table is present. 
        // Verify that the table on the page has a specific header labeled "Description".

        // 1. Verify that the correct page is open by checking the URL.
        cy.url({timeout: 10000})
            .should('contain', '/itemClassifications/?menfield=masterfile_itemclass');

        // 2. Verify the page header text should be 'Item Classifications'
        cy.get(':nth-child(1) > .text-\\[2rem\\]')
            .should('have.text', 'Item Classifications');

        // 3. Verify that a table is present
        cy.get('.MuiTable-root.css-12lx6p8-MuiTable-root')
            .should('be.visible');     

        // 4. Verify table visibility and has a header labeled "Description" 
        cy.get('.css-za273f-MuiTableCell-root')
            .should('contain', 'Description'); 
    });

    it('Verify if user can add valid data', () => {

        cy.addTestContext(`
            Verify that the user can successfully add valid data; it should appear in the Item Class table. 
        ;`) 

        cy.fixture('item_class.json').then((data) => {

            for (const key in data){

                cy.wait(2000);

                // 1. "Add" button should be clickable
                cy.get('.sc-eDLKkx > .anticon > svg')
                  .should('not.be.disabled')
                  .click();

                cy.wait(4000);  

                // 2. Verify Add Modal should have specific title "Add new item classification" and be visible.
                cy.checkLabel('.px-8', 'Add new item classification', visibility, failureMessages);  
                
                // 3. Verify Add Modal has a text field labeled "Description *", indicating it's a required field.
                cy.checkLabel('.mb-2', 'Description *', visibility, failureMessages);

                // 4. Verify that text field allows users to enter text.
                cy.get('#itmcladsc')
                  .should('be.enabled')
                  .clear();

                // 5. Type valid data in Item Class text field (ex. Beverages).
                cy.get('#itmcladsc').type(data[key].itemClass);

                // 6. Verify that Item Class text field has valid data before clicking 'Add Data' button.
                cy.get('#itmcladsc').should('have.value', data[key].itemClass);

                // 7. Verify "Add Data" button should be clickable.
                cy.get('.border-blue-500')
                  .should('be.enabled')
                  .click();

                // 8. Verify "Successfully uploaded" pop-up (modal) should be visible. 
                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully uploaded'); 

                // 9. Verify that the added data is visible in Item Class table.
                cy.get('.MuiTableBody-root').contains(data[key].itemClass).should('exist');
            }
        }) 

        cy.checkForFailure(visibility, failureMessages);
        
    });

    it('Verify if special characters are allowed', () => {

        cy.addTestContext(`
            1. Verify that the "Add" button is visible and not disabled.
            2. Click 'Add' button
            2. Verify that a pop-up (modal) appears with a specific title: "Add new item classification".
            3. Verify the pop-up has a text field labeled "Description *", indicating it's a required field.
            4. Verify that the text field is enabled (not disabled) and allows users to enter text.
            5. Type a special character (&-_/.) in Item Class text field.
            6. Verify that Item Class text field has text special character (&-_/.).
            7. Verify that 'Add Data' button is enabled.
            8. Click 'Add Data' button.
            9. Verify "Successfully uploaded" pop-up (modal) should be visible.
            10. Verify that the added data is visible in Item Class table.  
        `)

        cy.fixture('allowed_special_char.json').then((data) => {
            for (const key in data){

                cy.wait(2000);

                // "Add" button should be visible and clickable
                cy.get('.sc-eDLKkx > .anticon > svg')
                  .should('be.visible')
                  .and('not.be.disabled')
                  .click();

                // Verify Add Modal should have specific title "Add new item classification" and be visible
                cy.checkHeader('.px-8', 'Add new item classification', visibility);  

                // Verify the pop-up has a text field labeled "Description *", indicating it's a required field.
                cy.checkLabel('.mb-2', 'Description', visibility);

                // Verify that text field allows users to enter text.
                cy.get('#itmcladsc')
                  .should('be.enabled')
                  .clear();

                // Type data in Item Class text field
                cy.get('#itmcladsc').type(data[key].allowSpecialChar);

                // Verify that Item Class text field has data before clicking 'Add Data' button
                cy.get('#itmcladsc').should('have.value', data[key].allowSpecialChar);

                // Verify "Add Data" button should be clickable
                cy.get('.border-blue-500')
                  .should('be.enabled')
                  .click();

                // Verify "Successfully uploaded" pop-up (modal) should be visible 
                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully uploaded'); 

                // Verify that the added data is visible in Item Class table
                cy.get('.MuiTableBody-root').contains(data[key].allowSpecialChar).should('exist');
            }
        })

        
        // Check the contents of the JSON file
        cy.fixture('message.json').then((data) => {
        
            // Check if 'failed' is present only when there should be a failure
            // checks if there is any entry in the  visibility array where the property is equal to 'failed'  

            if (visibility.some(entry => entry.data === 'failed')) {   
                
                expect(data.some(entry => entry.data === 'failed')).to.be.true;
                cy.fail('Test failed, should be Add new item classification');

            } else { // skip visibility for 'passed'

                cy.log('No failures detected!');
            }
        });

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

        cy.get('.sc-eDLKkx > .anticon > svg')
          .should('be.visible')
          .click();

        cy.get('.px-8')
          .should('have.text', 'Add new item classification')
          .and('be.visible');

        cy.get('.mb-2').should('have.text', 'Item Classification Name *');

        cy.get('#itmcladsc')
          .should('be.enabled')
          .click();

        // Item Class field should be 'empty'
        cy.get('#itmcladsc').should('be.empty');

        cy.get('.border-blue-500')
          .should('be.enabled')
          .click();

                                        cy.get('.text-sm').then(($element) => {

                                            // If locator is found

                                            if ($element.text().includes('Item Classification Name * is required')) {


                                                cy.wrap($element).should('be.visible');
                                                cy.log('visibility Passed');
                                                visibility.push({ data: "passed" });
                                                

                                            } 
                                            
                                            else {


                                                cy.log('visibility Failed');
                                                visibility.push({ data: "failed" });

                                            }

                                        });


        cy.get('.px-8 > .flex > .anticon > svg').click();

        cy.then(() => {


            cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility))


        })

        
        // Check the contents of the JSON file
        cy.fixture('message.json').then((data) => {
        
            // Check if 'failed' is present only when there should be a failure
            // checks if there is any entry in the  visibility array where the property is equal to 'failed'  

            if (visibility.some(entry => entry.data === 'failed')) {   
                
                expect(data.some(entry => entry.data === 'failed')).to.be.true;
                cy.fail('Test failed, empty validation should be visible');

            } else { // skip visibility for 'passed'

                cy.log('No failures detected!');
            }
        });
    });

    it('Check upon adding an existing data', () => {
        cy.fixture('item_class.json').then((data) => {
            for (const key in data){

                cy.wait(2000);

                cy.get('.sc-eDLKkx > .anticon > svg').should('be.visible');

                cy.get('.sc-eDLKkx > .anticon > svg').click();

                cy.get('.px-8')
                  .should('have.text', 'Add new item classification')
                  .and('be.visible');

                cy.get('.mb-2').should('have.text', 'Item Classification Name *');

                cy.get('#itmcladsc')
                  .should('be.enabled')
                  .clear();

                cy.get('#itmcladsc').type(data[key].itemClass);

                cy.get('.border-blue-500')
                  .should('be.enabled')
                  .click();


                                        cy.get('.Toastify__toast-body').then(($element) => {

                                        // If locator is found

                                        if ($element.text().includes('Duplicate entry! Kindly check your inputs.')) {


                                            cy.wrap($element).should('be.visible');
                                            cy.log('visibility Passed');
                                            visibility.push({ data: "passed" });
                                            

                                        } 
                                        
                                        else {


                                            cy.log('visibility Failed');
                                            visibility.push({ data: "failed" });

                                        }

                                    });

                cy.get('.anticon.anticon-close').click();
  
                cy.wait(2000)

                cy.get('.MuiTableBody-root').find('tr').contains(data[key].itemClass)
                  .should('have.length', 1);
            }

        }).then(() => {


            cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility))


        })

        
        // Check the contents of the JSON file
        cy.fixture('message.json').then((data) => {
        
            // Check if 'failed' is present only when there should be a failure
            // checks if there is any entry in the  visibility array where the property is equal to 'failed'  

            if (visibility.some(entry => entry.data === 'failed')) {   
                
                expect(data.some(entry => entry.data === 'failed')).to.be.true;
                cy.fail('Test failed, "Duplicate entry! Kindly check your inputs." should be visible');

            } else { // skip visibility for 'passed'

                cy.log('No failures detected!');
            }
        });
    });

    it('Check if user can edit data', () => {
        cy.fixture('item_class.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);

                // Should have an existing data to edit
                // Find the table row containing the desired data to be edited
                cy.contains('tbody > tr', data[key].itemClass).within(() => {
                    // Click the edit button within this row
                    cy.get('[data-icon="edit"][aria-hidden="true"]').click();
                });

                                        cy.get('.px-8').then(($element) => {

                                            // If locator is found

                                            if ($element.text().includes('Edit Item Classification')) {


                                                cy.wrap($element).should('be.visible');
                                                cy.log('visibility Passed');
                                                visibility.push({ data: "passed" });
                                                

                                            } 
                                            
                                            else {


                                                cy.log('visibility Failed');
                                                visibility.push({ data: "failed" });

                                            }

                                        });


                cy.get('.mb-2').should('be.visible');

                cy.get('#itmcladsc')
                  .should('be.enabled')
                  .should('have.value', data[key].itemClass);

                cy.get('#itmcladsc')
                  .clear()
                  .type(data[key].editItemClass);

                cy.get('.border-blue-500')
                  .should('be.visible')
                  .should('be.enabled')
                  .click();

                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully updated Record!'); 

                cy.get('.MuiTableBody-root').contains(data[key].editItemClass).should('exist');
            }


        }).then(() => {


            cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility))


        })

        
        // Check the contents of the JSON file
        cy.fixture('message.json').then((data) => {
        
            // Check if 'failed' is present only when there should be a failure
            // checks if there is any entry in the  visibility array where the property is equal to 'failed'  

            if (visibility.some(entry => entry.data === 'failed')) {   
                
                expect(data.some(entry => entry.data === 'failed')).to.be.true;
                cy.fail('Test failed, edit modal header should be in text "Edit Item Classification"');

            } else { // skip visibility for 'passed'

                cy.log('No failures detected!');
            }
        });
    });

    it('Check if user can search valid data', () => {
        cy.fixture('item_class.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);

                cy.get('[data-testid="SearchIcon"]')
                  .should('be.visible')
                  .click();

                cy.get('#\\:rb\\:').should('be.visible')
                  .should('be.enabled')
                  .clear()
                  .type(data[0].editItemClass)
                  .type('{enter}');

                cy.get('.MuiTableBody-root').contains(data[0].editItemClass).should('exist');
            }
        })
    });

    it('Check if user can search invalid data', () => {
        cy.fixture('item_class.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);
                
                cy.get('[data-testid="SearchIcon"]')
                  .should('be.visible')
                  .click();

                cy.get('#\\:rb\\:')
                  .should('be.visible')
                  .should('be.enabled')
                  .clear()
                  .type('Appetizer')
                  .type('{enter}');

                cy.get('td > .MuiTypography-root')
                  .should('have.text', 'No records to display');

            }
        })
    });

    it('Check if user can delete data', () => {
        cy.fixture('item_class.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);

                // Should have an existing data to delete
                // Find the table row containing the desired data to be deleted
                cy.contains('tbody > tr', data[0].editItemClass).within(() => {
                    // Click the delete button within this row
                    cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                });

                                        cy.get('.px-8').then(($element) => {

                                            // If locator is found

                                            if ($element.text().includes('Delete Confirmation')) {


                                                cy.wrap($element).should('be.visible');
                                                cy.log('visibility Passed');
                                                visibility.push({ data: "passed" });
                                                


                                            } 
                                            
                                            else {


                                                cy.log('visibility Failed');
                                                visibility.push({ data: "failed" });

                                            }

                                        });


                                        cy.get('.h-\\[500px\\] > h1').then(($element) => {

                                            // If locator is found

                                            if ($element.text().includes('Do you want to delete: ' + data[key].editItemClass + ' ?')) {


                                                cy.wrap($element).should('be.visible');
                                                cy.log('visibility Passed');
                                                visibility.push({ data: "passed" });
                                                


                                            } 
                                            
                                            else {


                                                cy.log('visibility Failed');
                                                visibility.push({ data: "failed" });

                                            }

                                        });  

                cy.get('.border-red-500').should('be.visible')
                  .should('be.enabled')
                  .should('have.text', 'Confirm')
                  .click();

                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully deleted Record!');
            }
        }).then(() => {


            cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility))


        })

        
        // Check the contents of the JSON file
        cy.fixture('message.json').then((data) => {
        
            // Check if 'failed' is present only when there should be a failure
            // checks if there is any entry in the  visibility array where the property is equal to 'failed'  

            if (visibility.some(entry => entry.data === 'failed')) {   
                
                expect(data.some(entry => entry.data === 'failed')).to.be.true;
                cy.fail('Test failed, this should be visible "Do you want to delete: ' + data[key].editItemClass + ' ?"');

            } else { // skip visibility for 'passed'

                cy.log('No failures detected!');
            }
        });
    });

    it('Check back functionality', () => {

        cy. wait(2000);

        cy.get(':nth-child(1) > .flex > .anticon > svg > path').should('be.visible');

        cy.get(':nth-child(1) > .flex > .anticon > svg').click();

        cy.get('.text-\\[3rem\\]').should('be.visible')
          .should('have.text', 'Masterfile');
    });

    it('Check print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]')
          .should('be.visible')
          .click();

        cy.wait(8000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {
            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file));
            expect(fileName).to.exist;
        });
    });
});

