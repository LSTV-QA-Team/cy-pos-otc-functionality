
let visibility = []

describe('Order Type', () => {


    before(() => {
        // Clear the postypefile table before tests
        cy.task("queryDb","TRUNCATE TABLE postypefile");

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM postypefile").then((records) => {
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
        cy.navigateToModule('Master File', 'Order Type');
    });

    it('Check should be in Order Type module', () => {
        cy.url({timeout: 10000}).should('contain', '/dineType/?menfield=masterfile_dinetype');

        cy.get(':nth-child(1) > .text-\\[2rem\\]')
          .should('have.text', 'Order Type');

                                cy.get('div.Mui-TableHeadCell-Content-Wrapper[title="Dine Type"]').then(($element) => {
                                    if ($element.text().includes('Dine Type')) {


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
                cy.fail('Test failed, label should be "Dine Type"');

            } else { // skip assertion for 'passed'

                cy.log('No failures detected!');
            }
        });   
    });

    it('Check the dropdown list for  Order Type', () => {
        cy.fixture('dropdown_order_type.json').then((data) => { 
            const expectedItems = data.items;

            cy.wait(2000);
            
            cy.get('.sc-eDLKkx > .anticon > svg')
              .should('be.visible')
              .click();

            cy.get('select[name="ordertyp"]').as('dropdown');

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
        cy.fixture('order_type.json').then((data) => {
            for (const key in data){

                cy.wait(2000);

                cy.get('.sc-eDLKkx > .anticon > svg')
                  .should('be.visible')
                  .click();

                    
                                        cy.get('.px-8').then(($element) => {

                                            // If locator is found

                                            if ($element.text().includes('Create new order type')) {


                                                cy.wrap($element).should('be.visible');
                                                cy.log('Visibility Passed');
                                                visibility.push({ data: "passed" });


                                            } 
                                            
                                            else {


                                                cy.log('Visibility Failed');
                                                visibility.push({ data: "failed" });

                                            }

                                        });
                                      

                                
                cy.contains('label', 'Item Dine Type Description *')
                  .should('be.visible');

                cy.get('#postypdsc')
                  .should('be.enabled')
                  .clear()
                  .type(data[key].dineType);

                cy.get('#ordertyp')
                  .should('be.enabled')
                  .select(data[key].orderType)


                cy.get('.border-blue-500')
                  .should('be.enabled')
                  .click();

                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully uploaded'); 

                cy.get('.MuiTableBody-root').contains(data[key].dineType).should('exist');
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
                cy.fail('Test failed, should be Create new order type');

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

                                            if ($element.text().includes('Create new order type')) {


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
                                      

                                
                cy.contains('label', 'Item Dine Type Description *').should('be.visible');

                cy.get('#postypdsc')
                  .should('be.enabled')
                  .clear()
                  .type(data[key].dineTypeallowSpecialChar);

                cy.get('#ordertyp')
                .should('be.enabled')
                .select('Beverages')
                

                cy.get('.border-blue-500')
                  .should('be.enabled')
                  .click();

                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully uploaded'); 

                cy.get('.MuiTableBody-root').contains(data[key].dineTypeallowSpecialChar).should('exist');
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
                cy.fail('Test failed, should be Create new order type');

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
          .should('have.text', 'Create new order type')
          .and('be.visible');

        cy.contains('label', 'Item Dine Type Description *')
          .should('be.visible');

        cy.get('#postypdsc')
          .should('be.enabled')
          .click();

        // Item Class field should be 'empty'
        cy.get('#postypdsc').should('be.empty');


        cy.get('#ordertyp').within(() => {
            cy.contains('option', '-- Select an option --')
              .should('have.attr', 'disabled', 'disabled');
        });        

        cy.get('.border-blue-500')
          .should('be.enabled')
          .click();

                                        cy.get('.text-sm').then(($element) => {
                                            
                                            const text = $element.text();

                                            const validationMsg = ['Order Type Name * is required', 
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
        cy.fixture('order_type.json').then((data) => {
            for (const key in data){
                cy.get('.sc-eDLKkx > .anticon > svg').should('be.visible');

                cy.get('.sc-eDLKkx > .anticon > svg').click();

                cy.get('.px-8')
                  .should('have.text', 'Create new order type')
                  .and('be.visible');

                cy.contains('label', 'Item Dine Type Description *').should('be.visible');

                cy.get('#postypdsc')
                  .should('be.enabled')
                  .clear();

                cy.get('#postypdsc').type(data[key].dineType);

                cy.get('#ordertyp')
                  .should('be.enabled')
                  .select(data[key].orderType)

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

                cy.get('.MuiTableBody-root').find('tr').contains(data[key].dineType)
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
        cy.fixture('order_type.json').then((data) => {
            for (const key in data) {
                // Should have an existing data to edit
                // Find the table row containing the desired data to be edited
                cy.contains('tbody > tr', data[key].dineType).within(() => {
                    // Click the edit button within this row
                    cy.get('[data-icon="edit"][aria-hidden="true"]').click();
                });

                                        cy.get('.px-8').then(($element) => {

                                            // If locator is found

                                            if ($element.text().includes('Edit Order Type')) {


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

                cy.get('#postypdsc')
                  .should('be.enabled')
                  .should('have.value', data[key].dineType);

                cy.get('#postypdsc')
                  .clear()
                  .type(data[key].dineTypeedit);

                cy.get('#ordertyp')
                .should('be.enabled')
                .select(data[key].dineTypeeditItemClass)  

                cy.get('.border-blue-500')
                  .should('be.visible')
                  .should('be.enabled')
                  .click();

                cy.get('.Toastify__toast-body')
                  .should('be.visible')
                  .and('have.text', 'Successfully Updated!'); 

                cy.get('.MuiTableBody-root').contains(data[key].dineTypeedit).should('exist');
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
                cy.fail('Test failed, edit modal header should be in text "Edit Order Type"');

            } else { // skip assertion for 'passed'

                cy.log('No failures detected!');
            }
        });
    });

    it('Check if user can search valid data', () => {
        cy.fixture('order_type.json').then((data) => {
            for (const key in data) {

                cy.wait(2000);

                cy.get('[aria-label="Show/Hide search"]')
                  .should('be.visible')
                  .click();

                cy.get('#\\:re\\:').should('be.visible')
                  .should('be.enabled')
                  .clear()
                  .type(data[key].dineTypeedit)
                  .type('{enter}');

                cy.get('.MuiTableBody-root').contains(data[key].dineTypeedit).should('exist');
            }
        })
    });

    it('Check if user can search invalid data', () => {
        cy.fixture('order_type.json').then((data) => {
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
        cy.fixture('order_type.json').then((data) => {
            for (const key in data) {
                // Should have an existing data to delete
                // Find the table row containing the desired data to be deleted
                cy.contains('tbody > tr', data[key].dineTypeedit).within(() => {
                    // Click the delete button within this row
                    cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                });

                cy.get('.px-8').should('have.text', 'Delete Confirmation')
                  .and('be.visible');

                cy.get('.h-\\[500px\\] > h1')
                  .should('have.text', 'Do you want to delete: ' + data[key].dineTypeedit + ' ?');

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

