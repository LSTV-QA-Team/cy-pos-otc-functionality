
let visibility = []

describe('Item Subclassifications', () => {


    before(() => {
        // Clear the itemsubclassfile table before tests
        cy.task("queryDb","TRUNCATE TABLE itemsubclassfile");

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM itemsubclassfile").then((records) => {
            expect(records.length).to.be.equal(0);
        });

        // Delete the download directory and recreate it
        cy.task('clearDownloads');
    });
    
    beforeEach(() => {

        // reset visibility for each test case
        visibility = [];

        cy.login();
        
        // Navigate to page
        cy.navigateToModule('Master File', 'Item Subclassifications');
    });

    it('Check should be in Item Subclassifications module', () => {
        cy.url({timeout: 10000}).should('contain', 'temSubclassifications/?menfield=masterfile_itemsub');

        cy.get(':nth-child(1) > .text-\\[2rem\\]')
          .should('have.text', 'Item Subclassifications');

                                cy.get('div.Mui-TableHeadCell-Content-Wrapper[title="Subclass"]').then(($element) => {
                                    if ($element.text().includes('Subclass')) {


                                        cy.wrap($element).should('be.visible');
                                        cy.log('Visibility Passed');
                                        visibility.push({ data: "passed" });


                                    }

                                    else {


                                        cy.log('Visibility Failed');
                                        visibility.push({ data: "failed" });


                                    }

        }).then(() => {


            cy.log('Visiblity:', visibility)
            cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility))


        })

        
        // Check the contents of the JSON file
        cy.fixture('message.json').then((data) => {
        
            // Check if 'failed' is present only when there should be a failure
            // checks if there is any entry in the  visibility array where the property is equal to 'failed'  

            if (visibility.some(entry => entry.data === 'failed')) {   
                
                expect(data.some(entry => entry.data === 'failed')).to.be.true;
                cy.fail('Test failed, label should be "Subclass"');

            } else { // skip assertion for 'passed'

                cy.log('No failures detected!');
            }
        });   
    });

    it('Check the dropdown list for Item Class', () => {
        cy.fixture('dropdown_item_class.json').then((data) => { 
            const expectedItems = data.items;

            cy.wait(2000);
            
            cy.get('.sc-eDLKkx > .anticon > svg')
              .should('be.visible')
              .click();

            cy.get('select[name="itmclacde"]').as('dropdown');

            cy.get('@dropdown')
              .find('option')
              .should('have.length', expectedItems.length + 1)
              .each((option, index) => {


                if (index > 0) {
                    cy.wrap(option).should('have.text', expectedItems[index - 1]);
                }
            })
        })
    });

    it('Check if user can add valid data', () => {
        cy.fixture('item_subclass.json').then((data) => {
            for (const key in data){

                cy.wait(2000);

                cy.get('.sc-eDLKkx > .anticon > svg')
                  .should('be.visible')
                  .click();

                    
                                        cy.get('.px-8').then(($element) => {

                                            // If locator is found

                                            if ($element.text().includes('Add new item subclass')) {


                                                cy.wrap($element).should('be.visible');
                                                cy.log('Visibility Passed');
                                                visibility.push({ data: "passed" });


                                            } 
                                            
                                            else {


                                                cy.log('Visibility Failed');
                                                visibility.push({ data: "failed" });

                                            }

                                        });
                                      

                                
                cy.contains('label', 'Item Subclass Description *')
                  .should('be.visible');

                cy.get('#itemsubclassdsc')
                  .should('be.enabled')
                  .clear()
                  .type(data[key].itemSubclass);

                cy.get('#itmclacde')
                  .should('be.enabled')
                  .select(data[key].itemClass)


                cy.get('.border-blue-500')
                  .should('be.enabled')
                  .click();

                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully uploaded'); 

                cy.get('.MuiTableBody-root').contains(data[key].itemSubclass).should('exist');
            }

        }).then(() => {


            cy.log('Visiblity:', visibility)
            cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility))


        })

        
        // Check the contents of the JSON file
        cy.fixture('message.json').then((data) => {
        
            // Check if 'failed' is present only when there should be a failure
            // checks if there is any entry in the  visibility array where the property is equal to 'failed'  

            if (visibility.some(entry => entry.data === 'failed')) {   
                
                expect(data.some(entry => entry.data === 'failed')).to.be.true;
                cy.fail('Test failed, should be Add new item subclass');

            } else { // skip assertion for 'passed'

                cy.log('No failures detected!');
            }
        });
    });

    it('Check if special characters are allowed', () => {
        cy.fixture('allowed_special_char.json').then((data) => {
            for (const key in data){
                cy.wait(2000);

                cy.wait(2000);

                cy.get('.sc-eDLKkx > .anticon > svg')
                  .should('be.visible')
                  .click();

                    
                                        cy.get('.px-8').then(($element) => {

                                            // If locator is found

                                            if ($element.text().includes('Add new item subclass')) {


                                                cy.wait(2000);
                                                cy.wrap($element).should('be.visible');
                                                cy.log('Visibility Passed');
                                                visibility.push({ data: "passed" });
                                                

                                            } 
                                            
                                            else {


                                                cy.log('Visibility Failed');
                                                visibility.push({ data: "failed" });

                                            }

                                        });
                                      

                                
                cy.contains('label', 'Item Subclass Description *').should('be.visible');

                cy.get('#itemsubclassdsc')
                  .should('be.enabled')
                  .clear()
                  .type(data[key].allowSpecialChar);

                cy.get('#itmclacde')
                .should('be.enabled')
                .select('Beverages')
                

                cy.get('.border-blue-500')
                  .should('be.enabled')
                  .click();

                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully uploaded'); 

                cy.get('.MuiTableBody-root').contains(data[key].allowSpecialChar).should('exist');
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
                cy.fail('Test failed, should be Add new item subclass');

            } else { // skip assertion for 'passed'

                cy.log('No failures detected!');
            }
        });
    });

    it('Check upon adding an empty data', () => {

        cy.wait(2000) 

        cy.get('.sc-eDLKkx > .anticon > svg')
          .should('be.visible')
          .click();

        cy.get('.px-8')
          .should('have.text', 'Add new item subclass')
          .and('be.visible');

        cy.contains('label', 'Item Subclass Description *')
          .should('be.visible');

        cy.get('#itemsubclassdsc')
          .should('be.enabled')
          .click();

        // Item Class field should be 'empty'
        cy.get('#itemsubclassdsc').should('be.empty');


        cy.get('#itmclacde').within(() => {
            cy.contains('option', '-- Select an option --')
              .should('have.attr', 'disabled', 'disabled');
        });        

        cy.get('.border-blue-500')
          .should('be.enabled')
          .click();

                                        cy.get('.text-sm').then(($element) => {
                                            
                                            const text = $element.text();

                                            const validationMsg = ['Item Subclassifications Name * is required', 
                                                                        'Item Class * is required']
                                            
                                            const containsExpectdMsg = validationMsg.some(message => text.includes(message))

                                            // If locator is found

                                            if (containsExpectdMsg) {

                                                cy.wrap($element).should('be.visible');
                                                cy.log('Visibility Passed');
                                                visibility.push({ data: "passed" });


                                            } 
                                            
                                            else {


                                                cy.log('Visibility Failed');
                                                visibility.push({ data: "failed" });

                                            }

                                        });


        cy.get('.px-8 > .flex > .anticon > svg').click();

        cy.then(() => {


            cy.log('Visiblity:', visibility)
            cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility))


        })

        
        // Check the contents of the JSON file
        cy.fixture('message.json').then((data) => {
        
            // Check if 'failed' is present only when there should be a failure
            // checks if there is any entry in the  visibility array where the property is equal to 'failed'  

            if (visibility.some(entry => entry.data === 'failed')) {   
                
                expect(data.some(entry => entry.data === 'failed')).to.be.true;
                cy.fail('Test failed, empty validation should be visible');

            } else { // skip assertion for 'passed'

                cy.log('No failures detected!');
            }
        });
    });

    it('Check upon adding an existing data', () => {
        cy.fixture('item_subclass.json').then((data) => {
            for (const key in data){
                cy.get('.sc-eDLKkx > .anticon > svg').should('be.visible');

                cy.get('.sc-eDLKkx > .anticon > svg').click();

                cy.get('.px-8')
                  .should('have.text', 'Add new item subclass')
                  .and('be.visible');

                cy.contains('label', 'Item Subclass Description *').should('be.visible');

                cy.get('#itemsubclassdsc')
                  .should('be.enabled')
                  .clear();

                cy.get('#itemsubclassdsc').type(data[key].itemSubclass);

                cy.get('#itmclacde')
                  .should('be.enabled')
                  .select(data[key].itemClass)

                cy.get('.border-blue-500')
                  .should('be.enabled')
                  .click();


                                        cy.get('.Toastify__toast-body').then(($element) => {

                                        // If locator is found

                                        if ($element.text().includes('Duplicate entry! Kindly check your inputs.')) {


                                            cy.wrap($element).should('be.visible');
                                            cy.log('Visibility Passed');
                                            visibility.push({ data: "passed" });


                                        } 
                                        
                                        else {


                                            cy.log('Visibility Failed');
                                            visibility.push({ data: "failed" });

                                        }

                                    });

                cy.get('.MuiTableBody-root').find('tr').contains(data[key].itemSubclass)
                  .should('have.length', 1);
                  
            }

        }).then(() => {


            cy.log('Visiblity:', visibility)
            cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility))


        })

        
        // Check the contents of the JSON file
        cy.fixture('message.json').then((data) => {
        
            // Check if 'failed' is present only when there should be a failure
            // checks if there is any entry in the  visibility array where the property is equal to 'failed'  

            if (visibility.some(entry => entry.data === 'failed')) {   
                
                expect(data.some(entry => entry.data === 'failed')).to.be.true;
                cy.fail('Test failed, "Duplicate entry! Kindly check your inputs." should be visible');

            } else { // skip assertion for 'passed'

                cy.log('No failures detected!');
            }
        });
    });

    it('Check if user can edit data', () => {
        cy.fixture('item_subclass.json').then((data) => {
            for (const key in data) {
                // Should have an existing data to edit
                // Find the table row containing the desired data to be edited
                cy.contains('tbody > tr', data[key].itemSubclass).within(() => {
                    // Click the edit button within this row
                    cy.get('[data-icon="edit"][aria-hidden="true"]').click();
                });

                                        cy.get('.px-8').then(($element) => {

                                            // If locator is found

                                            if ($element.text().includes('Edit Item Subclassifications')) {


                                                cy.wrap($element).should('be.visible');
                                                cy.log('Visibility Passed');
                                                visibility.push({ data: "passed" });


                                            } 
                                            
                                            else {


                                                cy.log('Visibility Failed');
                                                visibility.push({ data: "failed" });

                                            }

                                        });


                cy.get('.mb-2').should('be.visible');

                cy.get('#itemsubclassdsc')
                  .should('be.enabled')
                  .should('have.value', data[key].itemSubclass);

                cy.get('#itemsubclassdsc')
                  .clear()
                  .type(data[key].editItemSubclass);

                cy.get('#itmclacde')
                .should('be.enabled')
                .select(data[key].editItemClass)  

                cy.get('.border-blue-500')
                  .should('be.visible')
                  .should('be.enabled')
                  .click();

                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully Updated!'); 

                cy.get('.MuiTableBody-root').contains(data[key].edititemSubclass).should('exist');
            }


        }).then(() => {


            cy.log('Visiblity:', visibility)
            cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility))


        })

        
        // Check the contents of the JSON file
        cy.fixture('message.json').then((data) => {
        
            // Check if 'failed' is present only when there should be a failure
            // checks if there is any entry in the  visibility array where the property is equal to 'failed'  

            if (visibility.some(entry => entry.data === 'failed')) {   
                
                expect(data.some(entry => entry.data === 'failed')).to.be.true;
                cy.fail('Test failed, edit modal header should be in text "Edit Item Subclassifications"');

            } else { // skip assertion for 'passed'

                cy.log('No failures detected!');
            }
        });
    });

    it('Check if user can search valid data', () => {
        cy.fixture('item_subclass.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);

                cy.get('[aria-label="Show/Hide search"]')
                  .should('be.visible')
                  .click();

                cy.get('#\\:re\\:').should('be.visible')
                  .should('be.enabled')
                  .clear()
                  .type(data[key].editItemSubclass)
                  .type('{enter}');

                cy.get('.MuiTableBody-root').contains(data[key].editItemSubclass).should('exist');
            }
        })
    });

    it('Check if user can search invalid data', () => {
        cy.fixture('item_subclass.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);

                cy.get('[aria-label="Show/Hide search"]')
                  .should('be.visible')
                  .click();

                cy.get('#\\:re\\:')
                  .should('be.visible')
                  .should('be.enabled')
                  .clear()
                  .type('Chocolate Shake')
                  .type('{enter}');

                cy.wait(2000)  

                cy.get('td > .MuiTypography-root')
                  .should('have.text', 'No records to display');

            }
        })
    });

    it('Check if user can delete data', () => {
        cy.fixture('item_subclass.json').then((data) => {
            for (const key in data) {
                // Should have an existing data to delete
                // Find the table row containing the desired data to be deleted
                cy.contains('tbody > tr', data[key].editItemSubclass).within(() => {
                    // Click the delete button within this row
                    cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                });

                cy.get('.px-8').should('have.text', 'Delete Confirmation')
                  .and('be.visible');

                cy.get('.h-\\[500px\\] > h1')
                  .should('have.text', 'Do you want to delete: ' + data[key].editItemSubclass + ' ?');

                cy.get('.border-red-500').should('be.visible');

                cy.get('.border-red-500').should('be.enabled');

                cy.get('.border-red-500').should('have.text', 'Confirm');

                cy.get('.border-red-500').click();

                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully deleted Record!');
            }
        })
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

        cy.wait(5000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {
            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file));
            expect(fileName).to.exist;
        });
    });
});

