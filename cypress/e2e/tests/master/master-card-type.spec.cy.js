
let assertionResults = [];
let failureMessages = [];

describe('Card Type', () => {


    before(() => {
        // Clear the cardtypefile table before tests
        cy.task("queryDb","TRUNCATE TABLE cardtypefile")

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM cardtypefile").then((records) => {
            expect(records.length).to.be.equal(0)
        });

        // Delete all file in downloads for check print functinality test case
        cy.task('clearDownloads')

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-cardtype-data')
        cy.execute('npm run sheet-converter module-selector-assert')
        cy.execute('npm run sheet-converter cardtype-add-el')
        cy.execute('npm run sheet-converter cardtype-edit-el')
        cy.wait(4000)

    });
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        cy.login('lstv', 'lstventures')

    });

    after(() => {

        // delete unecessary inputed data in the table 'cardtypefile'

        cy.fixture('data-to-delete.json').then((data) => {
           
            data.forEach((item) => {
                const specialChar = item.dataToDelete;
                const deleteQuery = `DELETE FROM cardtypefile WHERE cardtype = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {
                    cy.log(`Deleted data with description: ${specialChar}`); 
                });
            });
    
           
            cy.task('queryDb', 'SELECT * FROM cardtypefile').then((records) => {

                const remainingData = records.map((record) => record.description);
                const deletedChars = data.map((item) => item.dataToDelete);
                

                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char);

                });
    
                cy.log('Specified data successfully deleted'); 
            });
        });
    })

    it('Check Card Type Page', () => { 
        
        cy.navigateToModule('Master File', 'Card Types')

        cy.url({timeout: 10000})
            .should('contain', '/cardType/?menfield=masterfile_card_types')

        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Card Type:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Card Type pager U/I:', 'Card Type', assertionResults, failureMessages)

        cy.wait(2000)

        // 1.2.2 Check correct table column(s) header caption. 
        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Card Type pager U/I:', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to Card Type pager U/I:', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Add Functionality', () => {

        cy.fixture('master-cardtype-data.json').then((data) => {

            cy.wait(4000) 

            cy.get('.sc-eDLKkx > .anticon > svg').click()
                
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI:', 'Add Card Type', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I:', 'Description *', assertionResults, failureMessages)
            
            // 2.1.3 Check correct object (textbox) width
            // cy.get('#cardtype')
            //     .invoke('outerWidth')
            //     .should('eq', 420)

            // 2.1.4 Check correct buttons(s) caption

            // 2.1.5 Check correct all object position

            cy.validateElements('cardtype-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]') .click();

            for (const key in data){

                cy.get('.sc-eDLKkx > .anticon > svg').click()
                
                cy.get('#cardtype')
                    .type(data[key].cardType)
                    .then(($input) => {

                            if ($input.val() === "null") {
                                
                                cy.get('#cardtype').clear()

                                cy.get('.border-blue-500').click()

                                cy.checkLabelCaption('.text-sm', '22.1', 'Upon clicking the "Save" button:', 'Description * is required', assertionResults, failureMessages)

                                cy.get('#cardtype').type('Credit Card')

                                cy.get('.border-blue-500').click()

                                cy.checkLabelCaption('.Toastify__toast-body', '25.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                                cy.get('.px-8 > .flex > .anticon > svg').click()

                            } 
                            
                            else if ($input.val() === "Electronic Card") {

                                cy.get('.border-red-500').click()

                                cy.checkLabelCaption('.h-auto', '16.1', 'Upon Clicking the "Cancel" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                                cy.contains('button[class*="border-red-500"]', 'No').click()

                                cy.wait(3000)

                                cy.checkElementVisibility('.shadow-lg', '16.2.1', 'Upon Clicking the "No" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                                cy.get('.border-red-500').click()

                                cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                                cy.wait(3000)

                                cy.checkElementInvisibility('.shadow-lg', '16.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                                cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '16.3.2', 'Upon clicking the "Yes" button', 'Card Type', assertionResults, failureMessages)

                                cy.wait(4000)


                            }

                            else if ($input.val() === "% & ( ) / - .") {

                                cy.get('.border-blue-500').click()

                                cy.checkLabelCaption('.Toastify__toast-body', '20.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                                cy.checkElementInvisibility('.shadow-lg', '20.2.1', 'Upon clicking the "OK" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                                // 11.2.2 Check if the "Description" textbox object is cleared or blank.

                                cy.wait(4000)

                            }

                            else if ($input.val() === "Jollibee Filipino Sweet Style Spaghetti Langhap Sarap") {

                                cy.wrap($input).should('have.value', data[key].cardType);

                                cy.checkElementVisibility('.text-sm', '29.1', 'Upon encoding data:', 'The validation message for "Maximum length exceeded, 50 characters only." was not visible.', assertionResults, failureMessages)

                                cy.get('.border-red-500').click()

                                cy.checkLabelCaption('.h-auto', '16.1', 'Upon Clicking the "Cancel" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                                cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                                cy.wait(4000)

                            }

                            else if ($input.val() === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` \\ ~ \\\" | \\ ] [ ] ; :") {

                                cy.get('.border-blue-500').click()

                                cy.checkLabelCaption('.Toastify__toast-body', '27.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                                // 16.2 click "OK" button on notification message.


                                cy.checkElementInvisibility('.shadow-lg', '27.2.1', 'Upon clicking the "OK" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                                cy.wait(4000)
                                
                            }

                            else {

                                cy.wrap($input).should('have.value', data[key].cardType);

                                cy.get('.border-blue-500').click()

                                cy.wait(2000)

                                cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 
                                
                                cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                                // 4.2.2 Check if the "Description" textbox object is cleared or blank.
                                
                                cy.get('.MuiTableBody-root').contains(data[key].cardType).should('exist')

                                cy.wait(8000)
                            }
                }) 
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    });

    it('Edit Functionality', () => {
        cy.fixture('master-cardtype-data.json').then((data) => {

            const specificCardType = data[4];

                cy.wait(2000)

                cy.contains('tbody > tr', specificCardType.cardType).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()
                })

                cy.checkElementVisibility('.shadow-lg', '21.1', 'Upon Clicking the "Edit" button:', 'The "Edit Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '21.1.1', 'Upon clicking the "Edit" button on pager UI:', 'Edit Card Type', assertionResults, failureMessages)

                cy.checkLabelCaption('.mb-2', '21.1.2', 'Upon clicking the "Edit" button on pager U/I:', 'Description *', assertionResults, failureMessages)
            
                // 21.1.3 Check correct object (textbox) width
                // Add when needed

                // 21.1.4 Check correct buttons(s) caption

                // 21.1.5 Check correct all object position

                cy.validateElements('cardtype-edit-el.json', '21.1.4 & 21.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)
 
                cy.get('#cardtype')
                    .should('have.value', specificCardType.cardType)
                    .clear()

                cy.get('#cardtype').type(specificCardType.editCardType)

                cy.get('.border-blue-500').click()

                cy.wait(2000)

                cy.checkLabelCaption('.Toastify__toast-body', '24.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '24.2.1', 'Upon Clicking the "Update Data" button:', 'The "Edit Card Type" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificCardType.editCardType).should('exist')
            })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Delete Functionality', () => {
        cy.fixture('master-cardtype-data.json').then((data) => {
            
            const specificCardType = data[5];

                cy.wait(2000);

                cy.contains('tbody > tr',specificCardType.cardType).within(() => {

                    cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                });

                cy.checkHeaderTitle('.px-8', '29.1', 'Upon clicking the "Delete" button on pager UI', 'Delete Confirmation', assertionResults, failureMessages)
                
                cy.checkLabelCaption('.h-\\[500px\\] > h1', 'Do you want to delete: ' + specificCardType.cardType + ' ?', assertionResults, failureMessages);

                cy.contains('button[class*="border-blue-500"]', 'Cancel').click()

                cy.wait(3000)

                cy.checkElementInvisibility('.shadow-lg', '29.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                cy.contains('tbody > tr', specificCardType.cardType).within(() => {

                    cy.get('[data-icon="delete"][aria-hidden="true"]').click();
                });

                cy.contains('button[class*="border-red-500"]', 'Confirm').click()

                cy.checkLabelCaption('.Toastify__toast-body', '29.5.1', 'Upon Clicking the "Save" button:', 'Successfully Deleted', assertionResults, failureMessages) 

                cy.checkElementInvisibility('.shadow-lg', '29.41.3.1', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

            })

        cy.checkForFailure(assertionResults, failureMessages)
    });


    it('Search Functionality', () => {
        cy.fixture('master-cardtype-data.json').then((data) => {
            for (const key in data) {

                cy.wait(2000)


                cy.get('[data-testid="SearchIcon"]').click()

  
                cy.get('#\\:rb\\:')
                    .should('be.enabled')
                    .clear()
                    .type(data[0].cardType)
                    .type('{enter}')

                cy.wait(2000)
   
                cy.get('.MuiTableBody-root').contains(data[0].cardType).should('exist')
            }
        })

        cy.wait(2000)
                
                cy.get('[data-testid="SearchIcon"]')
                    .click();

                cy.get('#\\:rb\\:')
                    .clear()
                    .type('Electronic Card')
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


