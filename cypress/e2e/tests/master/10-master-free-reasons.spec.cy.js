
let assertionResults = [];
let failureMessages = [];

describe('Free Reasons', () => {

    before(() => {

        cy.task("queryDb","TRUNCATE TABLE freereasonfile")

        cy.task("queryDb", "SELECT * FROM freereasonfile").then((records) => {

            expect(records.length).to.be.equal(0)

        })


        cy.task('clearDownloads')

        cy.wait(4000)
        cy.execute('npm run sheet-converter master-freereasons-data')
        cy.execute('npm run sheet-converter module-selector-assert')
        cy.execute('npm run sheet-converter freereasons-add-el')
        cy.execute('npm run sheet-converter freereasons-edit-el')
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
                const deleteQuery = `DELETE FROM freereasonfile WHERE freereason = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {

                    cy.log(`Deleted data with description: ${specialChar}`)

                })
            })
    
           
            cy.task('queryDb', 'SELECT * FROM freereasonfile').then((records) => {

                const remainingData = records.map((record) => record.description)
                const deletedChars = data.map((item) => item.dataToDelete)
                

                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char)

                })
    
                cy.log('Specified data Successfully deleted.')
            })
        })
    })

    it('Check Free Reasons Page', () => { 
        
        cy.navigateToModule('Master File', 'Free Reasons')

        cy.url({timeout: 10000}).should('contain', 'freereasons/?menfield=masterfile_free_reasons')

        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Free Reasons:', 'The "Add Free Reasons" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Free Reasons pager U/I:', 'Free Reasons', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Free Reasons pager U/I:', assertionResults, failureMessages)

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to Free Reasons pager U/I:', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Add Functionality', () => {

        cy.fixture('master-freereasons-data.json').then((data) => {

            cy.wait(4000) 

            cy.get('.sc-dntaoT > .anticon > svg').click()

            cy.wait(2000)
                
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', 'The "Add Free Reasons" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI:', 'Add Free Reason', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I:', 'Description *', assertionResults, failureMessages)
            
            cy.get('#freereason').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.validateElements('freereasons-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            for (const key in data){

                cy.wait(8000)

                    if (data[key].freeReasons === "null") {

                        cy.wait(4000)
                        
                        cy.get('#freereason').clear().type(data[key].freeReasons)

                        cy.get('#freereason').clear()

                        cy.get('.border-green-500').click()

                        cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Description * is required', assertionResults, failureMessages)

                        cy.get('#freereason').type(data[0].freeReasons)

                        cy.get('.border-green-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '13.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                        cy.wait(4000)
                    } 
                    
                    else if (data[key].freeReasons === "Customer Appreciation") {

                        cy.wait(4000)

                        cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                        cy.get('#freereason').clear().type(data[key].freeReasons)

                        cy.get('.border-gray-300').click()

                        cy.checkLabelCaption('.h-auto', '6.1', 'Upon Clicking the "Cancel" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                        cy.contains('button[class*="border-gray-300"]', 'No').click()

                        cy.wait(3000)

                        cy.checkElementVisibility('.shadow-lg', '6.2.1', 'Upon Clicking the "No" button:', 'The "Add Free Reasons" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.border-gray-300').click()

                        cy.contains('button[class*="border-green-500"]', 'Yes').click()

                        cy.wait(4000)

                        cy.checkElementInvisibility('.shadow-lg', '6.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Free Reasons" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '6.3.2', 'Upon clicking the "Yes" button', 'Free Reasons', assertionResults, failureMessages)

                        cy.wait(6000)

                        cy.get('.sc-dntaoT > .anticon > svg').click()
                    }

                    else if (data[key].freeReasons === "% & ( ) / - .") {

                        cy.wait(8000)

                        cy.get('#freereason').clear().type(data[key].freeReasons)

                        cy.get('.border-green-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '9.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.checkElementVisibility('.shadow-lg', '9.2.1', 'Upon clicking the "OK" button:', 'The "Add Free Reasons" modal window was not visible or active.', assertionResults, failureMessages)
                    }

                    else if (data[key].freeReasons === "This is a very long string that exceeds the maximum allowed length.") {

                        cy.wait(8000)

                        cy.get('#freereason').clear().type(data[key].freeReasons)

                        cy.checkInputMaxLength('#freereason', 50, '17.1', 'Upon Encoding in "Free Reasons" Textbox:', assertionResults, failureMessages)

                        // cy.checkElementVisibility('.text-sm', '17.2', 'Upon encoding data:', 'The validation message for "check if the validation message appear "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                        cy.get('.border-green-500').click()
                    }

                    else if (data[key].freeReasons === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                        cy.wait(8000)

                        cy.get('#freereason').clear().type(data[key].freeReasons)

                        cy.checkLabelCaption('.Toastify__toast-body', '15.1', 'Upon encoding not allowed special characters:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                        cy.get('.border-green-500').click()

                        cy.checkElementVisibility('.shadow-lg', '15.2.1', 'Upon clicking the "Save" button:', 'The "Add Free Reasons" modal window was not visible or active.', assertionResults, failureMessages)
                    }

                    else {

                        cy.wait(8000)
                        
                        cy.get('#freereason').clear().type(data[key].freeReasons)

                        cy.get('#freereason').should('have.value', data[key].freeReasons)

                        cy.get('.border-green-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 
                        
                        cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Free Reasons" modal window was not visible or active.', assertionResults, failureMessages)
                        
                        // cy.get('.MuiTableBody-root').contains(data[key].freeReasons).should('exist')

                    } 
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    });

    it('Edit Functionality', () => {

        cy.get('.border-gray-300').click()

        cy.fixture('master-freereasons-data.json').then((data) => {

            const specificFreeReasons = data[7];

                cy.wait(2000)

                cy.contains('tbody > tr', specificFreeReasons.freeReasons).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()

                })

                cy.wait(2000)

                cy.checkElementVisibility('.shadow-lg', '20.1', 'Upon Clicking the "Edit" button:', 'The "Edit Free Reasons" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '20.1.1', 'Upon clicking the "Edit" button on pager UI:', 'Edit Free Reasons', assertionResults, failureMessages)

                cy.checkLabelCaption('.mb-2', '20.1.2', 'Upon clicking the "Edit" button on pager U/I:', 'Description *', assertionResults, failureMessages)

                cy.validateElements('freereasons-edit-el.json', '20.1.4 & 20.1.6', 'Upon clicking the "Edit" button on pager U/I:', assertionResults, failureMessages)
 
                cy.get('#freereason')
                  .should('have.value', specificFreeReasons.freeReasons)
                  .clear()

                cy.get('#freereason').type(specificFreeReasons.editFreeReasons)

                cy.get('.border-green-500').click()

                cy.wait(2000)

                cy.checkLabelCaption('.Toastify__toast-body', '23.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '23.2.1', 'Upon Clicking the "Save" button:', 'The "Edit Free Reasons" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificFreeReasons.editFreeReasons).should('exist')
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-freereasons-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlyDelete === true) {

                    cy.wait(2000);

                    cy.contains('tbody > tr', data[key].freeReasons).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkHeaderTitle('.px-8', '24.2', 'Upon clicking the "Delete" button on pager UI', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.max-h-\\[450px\\] > h1', '24.3', 'Upon clicking the "Delete" button on pager UI', 'Do you want to delete: ' + data[key].freeReasons + ' ?', assertionResults, failureMessages)

                    cy.get('.hover\\:bg-green-500').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '24.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.contains('tbody > tr', data[key].freeReasons).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.get('.bg-blue-500').click()

                    cy.wait(3000)

                    cy.checkLabelCaption('.Toastify__toast-body', '24.5.1', 'Upon Clicking the "Save" button:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.wait(8000)

                    cy.checkElementInvisibility('.shadow-lg', '24.1.3.1', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)
                }
            }
        })

        cy.checkForFailure(assertionResults, failureMessages)
    })


    it('Search Functionality', () => {

        cy.fixture('master-freereasons-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlySearchVal === true) {

                    // search valid data
                    cy.wait(2000)

                    cy.get('[data-testid="SearchIcon"]').click()
    
                    cy.get('input[placeholder="Search Free Reason"]')
                      .clear().type(data[key].freeReasons)

                    cy.wait(2000)
    
                    cy.get('.MuiTableBody-root').contains(data[key].freeReasons).should('exist')

                }

                if (data[key].onlySearchInval === true) {

                    // search invalid or not existing data
                    cy.wait(2000)
                
                    cy.get('[data-testid="SearchIcon"]').click()

                    cy.get('input[placeholder="Search Free Reason"]').then($input => {
                        if ($input.attr('placeholder') !== 'Search Free Reason') {
                          throw new Error('Placeholder text does not match the expected value. Should be "Search Free Reason".')
                        }
                    })

                    cy.get('input[placeholder="Search Free Reason"]').clear()
                      .type(data[key].freeReasons)

                    cy.wait(8000)

                    // cy.get('td > .MuiTypography-root').should('have.text', 'No records to display')
                    cy.get('td > .MuiTypography-root').should('not.contain', data[key].freeReasons)

                }
            }
        })
    })

    it.skip('Print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]').click()

        cy.wait(10000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {

            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file))
            expect(fileName).to.exist;

        })
    })

    it('Back Button Functionality', () => {

        cy.wait(2000)

        cy.get(':nth-child(1) > .flex > .anticon > svg').click()

        cy.get('.text-\\[3rem\\]').should('have.text', 'Masterfile')

        cy.get('.bg-white > .flex').click()
    })
})
