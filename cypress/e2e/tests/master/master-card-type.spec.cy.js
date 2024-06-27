
let assertionResults = [];
let failureMessages = [];

describe('Card Type', () => {


    before(() => {
        cy.task("queryDb","TRUNCATE TABLE cardtypefile")

        cy.task("queryDb", "SELECT * FROM cardtypefile").then((records) => {

            expect(records.length).to.be.equal(0)

        })

        cy.task('clearDownloads')

        cy.wait(4000)
        cy.execute('npm run sheet-converter master-cardtype-data')
        cy.execute('npm run sheet-converter module-selector-assert')
        cy.execute('npm run sheet-converter cardtype-add-el')
        cy.execute('npm run sheet-converter cardtype-edit-el')
        cy.wait(4000)

    })
    
    beforeEach(() => {

        assertionResults = [];
        failureMessages = [];

        cy.login('lstv', 'lstventures')

    })

    after(() => {

        cy.fixture('data-to-delete.json').then((data) => {
           
            data.forEach((item) => {

                const specialChar = item.dataToDelete;
                const deleteQuery = `DELETE FROM cardtypefile WHERE cardtype = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {

                    cy.log(`Deleted data with description: ${specialChar}`)

                })
            })
    
           
            cy.task('queryDb', 'SELECT * FROM cardtypefile').then((records) => {

                const remainingData = records.map((record) => record.description)
                const deletedChars = data.map((item) => item.dataToDelete)
                

                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char);

                })
    
                cy.log('Specified data Successfully deleted.')
            })
        })
    })

    it('Check Card Type Page', () => { 
        
        cy.navigateToModule('Master File', 'Card Types')

        cy.url({timeout: 10000})
          .should('contain', '/cardType/?menfield=masterfile_card_types')

        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Card Type:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Card Type pager U/I:', 'Card Type', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Card Type pager U/I:', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to Card Type pager U/I:', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Add Functionality', () => {

        cy.fixture('master-cardtype-data.json').then((data) => {

            cy.wait(4000) 

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000)
                
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI:', 'Add Card Type', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I:', 'Description *', assertionResults, failureMessages)

            cy.get('#cardtype').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            // Check correct buttons(s) caption
            // Add if needed

            // Check correct all object position

            cy.validateElements('cardtype-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            for (const key in data){

                cy.wait(4000)

                // cy.get('.sc-eDLKkx > .anticon > svg').click()
                
                if (data[key].cardType === "null") {

                    cy.get('#cardtype').clear().type(data[key].cardType)
                    
                    cy.get('#cardtype').clear()

                    cy.get('.border-blue-500').click()

                    cy.checkLabelCaption('.text-sm', '12.1', 'Upon clicking the "Save" button:', 'Description * is required', assertionResults, failureMessages)

                    cy.get('#cardtype').clear().type('Credit Card')

                    cy.get('.border-blue-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '14.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                } 
                
                else if (data[key].cardType === "Electronic Card") {

                    cy.wait(4000)

                    cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                    cy.get('#cardtype').clear().type(data[key].cardType)

                    cy.get('.border-red-500').click()

                    cy.checkLabelCaption('.h-auto', '6.1', 'Upon Clicking the "Cancel" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                    cy.contains('button[class*="border-red-500"]', 'No').click()

                    cy.wait(3000)

                    cy.checkElementVisibility('.shadow-lg', '6.2.1', 'Upon Clicking the "No" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                    cy.get('.border-red-500').click()

                    cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '6.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                    cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '6.3.2', 'Upon clicking the "Yes" button', 'Card Type', assertionResults, failureMessages)

                    cy.get('.sc-eDLKkx > .anticon > svg').click()

                }

                else if (data[key].cardType === "% & ( ) / - .") {

                    cy.wait(4000)

                    cy.get('#cardtype')
                      .clear()
                      .type(data[key].cardType)

                    cy.get('.border-blue-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '10.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.checkElementVisibility('.shadow-lg', '10.2.1', 'Upon clicking the "OK" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                    // 11.2.2 Check if the "Description" textbox object is cleared or blank.

                }

                else if (data[key].cardType === "Jollibee Filipino Sweet Style Spaghetti Langhap Sarap") {

                    cy.wait(4000)

                    cy.get('#cardtype')
                      .clear()
                      .type(data[key].cardType)

                    cy.checkInputMaxLength('#cardtype', 50, '17.1', 'Upon Encoding in "Card Type" Textbox:', assertionResults, failureMessages)

                    // cy.checkElementVisibility('.text-sm', '18.1', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                    cy.get('.border-blue-500').click()

                    // cy.wait(4000)

                    // cy.checkLabelCaption('.Toastify__toast-body', '9.1', 'Upon Clicking the "Save" button:', 'Please input valid data.', assertionResults, failureMessages) 

                }

                else if (data[key].cardType === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                    cy.wait(4000)

                    cy.get('#cardtype').clear().type(data[key].cardType)

                    cy.checkLabelCaption('.Toastify__toast-body', '16.1', 'Upon encoding not allowed special characters:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                    cy.get('.border-blue-500').click()

                    cy.wait(2000)

                    // cy.checkLabelCaption('.Toastify__toast-body', '16.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                    // 16.2 click "OK" button on notification message.

                    cy.checkElementVisibility('.shadow-lg', '16.2.1', 'Upon clicking the "Save" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)
                    
                }

                else {

                    cy.wait(4000)

                    cy.get('#cardtype')
                      .clear()
                      .type(data[key].cardType)

                    cy.get('#cardtype').should('have.value', data[key].cardType)

                    cy.get('.border-blue-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.wait(2000)

                    cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)
                    
                    cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                    // 4.2.2 Check if the "Description" textbox object is cleared or blank.
                    
                    cy.get('.MuiTableBody-root').contains(data[key].cardType).should('exist')

                }
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    })

    it('Edit Functionality', () => {

        cy.get('.border-red-500').click()
        
        cy.fixture('master-cardtype-data.json').then((data) => {

            const specificCardType = data[4];

                cy.wait(2000)

                cy.contains('tbody > tr', specificCardType.cardType).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()
                })

                cy.wait(2000)

                cy.checkElementVisibility('.shadow-lg', '21.1', 'Upon Clicking the "Edit" button:', 'The "Edit Card Type" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '21.1.1', 'Upon clicking the "Edit" button on pager UI:', 'Edit Card Type', assertionResults, failureMessages)

                cy.checkLabelCaption('.mb-2', '21.1.2', 'Upon clicking the "Edit" button on pager U/I:', 'Description *', assertionResults, failureMessages)
            
                // 21.1.3 Check correct object (textbox) width
                // Add when needed

                // 21.1.4 Check correct buttons(s) caption

                // 21.1.5 Check correct all object position

                cy.validateElements('cardtype-edit-el.json', '21.1.4 & 21.1.6', 'Upon clicking the "Edit" button on pager U/I:', assertionResults, failureMessages)
 
                cy.get('#cardtype')
                    .should('have.value', specificCardType.cardType)
                    .clear()

                cy.get('#cardtype').clear().type(specificCardType.editCardType)

                cy.get('.border-blue-500').click()

                cy.wait(2000)

                cy.checkLabelCaption('.Toastify__toast-body', '24.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '24.2.1', 'Upon Clicking the "Save" button:', 'The "Edit Card Type" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificCardType.editCardType).should('exist')
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-cardtype-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlyDelete === true) {

                    cy.wait(2000)

                    cy.contains('tbody > tr',data[key].cardType).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkHeaderTitle('.px-8', '25.1', 'Upon clicking the "Delete" button on pager U/I', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', '25.3', 'Upon clicking the "Delete" button on pager U/I', 'Do you want to delete: ' + data[key].cardType + ' ?', assertionResults, failureMessages)

                    cy.get('.border-blue-500').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '25.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.contains('tbody > tr', data[key].cardType).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.get('.border-red-500').click()

                    cy.wait(4000)

                    cy.checkLabelCaption('.Toastify__toast-body', '25.5.1', 'Upon Clicking the "Yes" button:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '25.41.3.1', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                }
            }

        })

        cy.checkForFailure(assertionResults, failureMessages)
    })


    it('Search Functionality', () => {

        cy.fixture('master-cardtype-data.json').then((data) => {

            for (const key in data) {

                cy.wait(2000)


                cy.get('[data-testid="SearchIcon"]').click()

  
                cy.get('#\\:rb\\:')
                  .clear()
                  .type(data[0].cardType)

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
    })

    it('Print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]').click()

        cy.wait(15000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {

            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file))
            expect(fileName).to.exist;

        })
    })

    it('Back Button Functionality', () => {

        cy.wait(2000);

        cy.get(':nth-child(1) > .flex > .anticon > svg').click()

        cy.get('.text-\\[3rem\\]').should('have.text', 'Masterfile')
    })
})


