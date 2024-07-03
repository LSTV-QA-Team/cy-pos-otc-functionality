
let assertionResults = [];
let failureMessages = [];

describe('MEMC', () => {

    before(() => {

        cy.task("queryDb","TRUNCATE TABLE memcfile")

        cy.task("queryDb", "SELECT * FROM memcfile").then((records) => {

            expect(records.length).to.be.equal(0)
        })

        cy.task('clearDownloads')

        cy.wait(4000)
        cy.execute('npm run sheet-converter master-memc-data')
        cy.execute('npm run sheet-converter module-selector-assert')
        // cy.execute('npm run sheet-converter memc-add-el')
        // cy.execute('npm run sheet-converter memc-edit-el')
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
                const deleteQuery = `DELETE FROM memcfile WHERE codedsc = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {

                    cy.log(`Deleted data with description: ${specialChar}`)

                })
            })
    
            cy.task('queryDb', 'SELECT * FROM memcfile').then((records) => {

                const remainingData = records.map((record) => record.description);
                const deletedChars = data.map((item) => item.dataToDelete);
                
                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char)

                })
    
                cy.log('Specified data Successfully deleted.')
            })
        })
    })

    it('Check MEMC Page', () => {   

        cy.navigateToModule('Master File', 'MEMC')

        cy.url({timeout: 10000}).should('contain', '/memc/?menfield=masterfile_memc')

        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to MEMC:', ' "MEMC" pager U/I window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to MEMC pager U/I', 'MEMC', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'MEMC', 'Value (PHP)'], '1.2.2', 'Upon Navigating to MEMC pager U/I', assertionResults, failureMessages)

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to MEMC pager U/I', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Add Functionality', () => {

        cy.fixture('master-memc-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', '"Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add MEMC', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="codedsc"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Description *', assertionResults,failureMessages)

            cy.checkLabelCaption('label[for="itmdsc"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Value *', assertionResults,failureMessages)

            cy.get('#codedsc').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#value').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            for (const key in data){

                cy.wait(4000) 
                
                    if (data[key].memc === "null") {

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.get('.border-blue-500').click()

                        cy.wait(4000)

                        cy.checkLabelCaption('.text-sm', '13.2', 'Upon clicking the "Save" button:', 'MEMC * is required', assertionResults, failureMessages)

                        cy.get('#codedsc').clear()

                        cy.get('#value').clear().type(data[key].value)

                        cy.checkLabelCaption('.text-sm', '13.1', 'Upon clicking the "Save" button:', 'MEMC * is required', assertionResults, failureMessages)

                        cy.wait(4000)

                        cy.get('#codedsc').clear().type(data[0].memc)

                        cy.get('#value').clear().type(data[0].value)

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '15.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                        cy.get('.px-8 > .flex > .anticon > svg').click()
                    } 
                    
                    else if (data[key].memc === "MEMC 600") {

                        cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.get('#value').realClick()

                        cy.get('.border-red-500').click()

                        cy.checkLabelCaption('.h-auto', '8.1', 'Upon Clicking the "Save" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                        cy.contains('button[class*="border-red-500"]', 'No').click()

                        cy.wait(3000)

                        cy.checkElementVisibility('.shadow-lg', '8.2.1', 'Upon Clicking the "No" button:', 'The "Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.border-red-500').click()

                        cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                        cy.wait(3000)

                        cy.checkElementInvisibility('.shadow-lg', '48.3.1', 'Upon Clicking the "Yes" button:', 'The "Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '40.3.2', 'Upon clicking the "Yes" button', 'MEMC', assertionResults, failureMessages)

                        cy.wait(4000)

                        cy.get('.sc-eDLKkx > .anticon > svg').click()
                    }

                    else if (data[key].memc === "% & ( ) / - .") {

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.get('#value').clear().type(data[key].value)

                        cy.get('.border-blue-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.checkElementVisibility('.shadow-lg', '11.2.1', 'Upon clicking the "OK" button:', 'The "Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)
                    }

                    else if (data[key].memc === "Jollibee Filipino Sweet Style Spaghetti Langhap Sarap") {

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.checkInputMaxLength('#codedsc', 50, '19.1', 'Upon Encoding in "Free Reasons" Textbox:', assertionResults, failureMessages)

                        // cy.checkElementVisibility('.Toastify__toast-body', '19.1', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                        cy.get('#value').clear().type(data[key].value)

                        cy.get('.border-blue-500').click()

                    }

                    else if (data[key].memc === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.checkLabelCaption('.Toastify__toast-body', '16.1', 'Upon encoding not allowed special characters:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                        cy.get('#value').realClick()

                        cy.get('#value').clear().type(data[key].value)

                        cy.get('.border-blue-500').click()

                        cy. wait(2000)
                        
                        cy.checkLabelCaption('.Toastify__toast-body', '17.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                        cy.checkElementVisibility('.shadow-lg', '17.2.1', 'Upon clicking the "OK" button:', 'The "Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.wait(4000)
                    }

                    else {

                        cy.wait(4000)

                        cy.get('#codedsc').clear().type(data[key].memc)

                        cy.get('#value').clear().type(data[key].value)

                        cy.get('.border-blue-500').click()  
                        
                        cy. wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.wait(4000)
                        
                        cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add MEMC" modal window was not visible or active.', assertionResults, failureMessages)
                        
                        cy.get('.MuiTableBody-root').contains(data[key].memc).should('exist')
                    }
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    })

    it('Edit Functionality', () => {

        cy.get('.border-red-500').click()

        cy.fixture('master-memc-data.json').then((data) => {

            const specificmemc = data[8];

                cy.wait(2000)

                // 54. Should have an existing data to edit 
                cy.contains('tbody > tr', specificmemc.memc).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()
                })

                cy.wait(4000)

                cy.checkElementVisibility('.shadow-lg', '22.1', 'Upon Clicking the "Edit" button:', 'The "Edit MEMC" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '22.1.1', 'Upon clicking the "Edit" button on pager UI', 'Edit MEMC', assertionResults, failureMessages)

                cy.checkLabelCaption('label[for="codedsc"]', '22.1.2', 'Upon clicking the "Edit" button on pager U/I', 'MEMC *', assertionResults, failureMessages)

                cy.checkLabelCaption('label[for="itmdsc"]', '22.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Value *', assertionResults, failureMessages)

                cy.get('#codedsc')
                  .should('have.value', specificmemc.memc)
                  .clear()

                cy.get('#codedsc').clear().type(specificmemc.editmemc)

                cy.get('#value').clear().type('{rightarrow}{rightarrow}').type(specificmemc.editvalue)

                cy.wait(4000)

                cy.get('.border-blue-500').click()

                cy.wait(2000)

                cy.checkLabelCaption('.Toastify__toast-body', '25.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '25.2.1', 'Upon Clicking the "Update" button:', 'The "Edit MEMC" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificmemc.editmemc).should('exist')
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-memc-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlyDelete === true){

                    cy.wait(2000)

                    cy.contains('tbody > tr', data[key].memc).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkElementVisibility('.px-8', '30.1', 'Upon clicking the "Delete" button on pager UI:', 'The "Delete Confirmation" modal is not visible.')

                    cy.checkHeaderTitle('.px-8', '30.2', 'Upon clicking the "Delete" button on pager UI:', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', 'Do you want to delete: ' + data[key].memc + ' ?', assertionResults, failureMessages)

                    cy.validateElements('delete-confirm-el.json', '30.3', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

                    cy.get('.border-blue-500').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '30.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.wait(3000)

                    cy.contains('tbody > tr', data[key].memc).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.get('.border-red-500').click()

                    cy.wait(4000)

                    cy.checkLabelCaption('.Toastify__toast-body', '30.5.1', 'Upon Clicking the "Save" button:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '30.5.2 ', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                }

            }

        })

        cy.checkForFailure(assertionResults, failureMessages)
    })


    it('Search Functionality', () => {

        cy.fixture('master-memc-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlySearchVal === true) {

                    // search valid data
                    cy.wait(2000)

                    cy.get('[data-testid="SearchIcon"]').click()
    
                    cy.get('input[placeholder="Search Discount"]')
                      .clear().type(data[key].memc)

                    cy.wait(2000)
    
                    cy.get('.MuiTableBody-root').contains(data[key].memc).should('exist')

                }

                if (data[key].onlySearchInval === true) {

                    // search invalid or not existing data
                    cy.wait(2000)
                
                    cy.get('[data-testid="SearchIcon"]').click()

                    cy.get('input[placeholder="Search MEMC"]')
                    .clear()
                    .clear().type(data[key].memc)

                    cy.wait(8000)

                    // cy.get('td > .MuiTypography-root').should('have.text', 'No records to display')
                    cy.get('td > .MuiTypography-root').should('not.conatain', data[key].memc)
            
                }    
            }
        })
    })

    it('Print functionality', () => {

        cy.wait(2000)

        cy.xpath('//span[@aria-label="printer"]').click()

        cy.wait(8000)

        cy.task('verifyDownloads', Cypress.config('downloadsFolder')).then((files) => {

            const fileName = files.find(file => /^[0-9a-fA-F\-]+\.pdf$/.test(file))
            expect(fileName).to.exist;
        
        })
    })

    it('Back Button Functionality', () => {

        cy.wait(2000)

        cy.get(':nth-child(1) > .flex > .anticon > svg').click()

        cy.get('.text-\\[3rem\\]').should('be.visible').should('have.text', 'Masterfile')
        
    })
})
