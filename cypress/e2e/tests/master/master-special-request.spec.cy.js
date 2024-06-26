
let assertionResults = [];
let failureMessages = [];

describe('Special Request', () => {

    before(() => {

        cy.task("queryDb","TRUNCATE TABLE modifierfile")

        cy.task("queryDb", "SELECT * FROM modifierfile").then((records) => {

            expect(records.length).to.be.equal(0)

        })

        cy.task('clearDownloads')

        cy.wait(4000)
        cy.execute('npm run sheet-converter master-specialreq-data')
        cy.execute('npm run sheet-converter module-selector-assert')
        cy.execute('npm run sheet-converter specialreq-add-el')
        cy.execute('npm run sheet-converter specialreq-edit-el')
        cy.wait(4000)

    })
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login('lstv', 'lstventures')

    })

    // after(() => {

    //     cy.fixture('data-to-delete.json').then((data) => {

    //         data.forEach((item) => {

    //             const specialChar = item.dataToDelete;
    //             const deleteQuery = `DELETE FROM modifierfile WHERE modcde = '${specialChar}'`;
                
    //             cy.task('queryDb', deleteQuery).then(() => {

    //                 cy.log(`Deleted data with description: ${specialChar}`)

    //             })
    //         })
    
    //         cy.task('queryDb', 'SELECT * FROM modifierfile').then((records) => {

    //             const remainingData = records.map((record) => record.description)
    //             const deletedChars = data.map((item) => item.dataToDelete)
                
    //             deletedChars.forEach((char) => {

    //                 expect(remainingData).to.not.include(char)

    //             })
    
    //             cy.log('Specified data Successfully deleted.')

    //         })
    //     })
    // })

    it.only('Check Special Request Page', () => {  
        
        cy.navigateToModule('Master File', 'Special Request')

        cy.url({timeout: 10000}).should('contain', 'specialRequests/?menfield=masterfile_special_requests')
        
        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Special Request:', 'The "Special Request" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Special Request pager U/I', 'Special Request', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Special Request pager U/I', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to Special Request pager U/I', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it.only('Add Functionality', () => {

        cy.fixture('master-specialreq-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', '"Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Special Request', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="modcde"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Special Request *', assertionResults,failureMessages)

            cy.checkLabelCaption('label[for="modgrpcde"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Subclassification *', assertionResults, failureMessages)
            
            cy.get('#modcde').invoke('outerWidth').then((width) => {

                 expect(width).to.equal(420)
                    
            })

            cy.get('#modgrpcde').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            // 2.1.5 Check correct all object position

            cy.validateElements('specialreq-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)
                            
            cy.fixture('dropdown-values.json').then((data) => { 

                const expectedOptions = data.itemSubclass;

                cy.get('#modgrpcde').click()

                cy.wait(2000)

                cy.get('.select__menu-list--is-multi')
                  .children('.select__option')
                  .then(($options) => {

                    const actualOptions = [...$options].map(option => option.textContent.trim())

                    expectedOptions.forEach(expectedOption => {

                        expect(actualOptions).to.include(expectedOption)

                    })
                })
            })

            // cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]') .click()

            for (const key in data){

                // cy.get('.sc-eDLKkx > .anticon > svg').click()

                cy.wait(4000) 
                
                if (data[key].specialReq === "null") {

                    cy.wait(4000)

                    cy.get('#modcde').clear().type(data[key].specialReq)

                    cy.get('.border-blue-500').click()

                    cy.checkLabelCaption('.text-sm', '11.2', 'Upon clicking the "Save" button:', 'Item Subclassification * is required', assertionResults, failureMessages)

                    cy.get('#modcde').clear()

                    cy.get('#modgrpcde').click()

                    cy.get('.select__menu-list--is-multi').contains('.select__option', 'Snacks').click()

                    cy.wait(2000)

                    cy.get('.border-blue-500').click()

                    cy.checkLabelCaption('.text-sm', '11.1', 'Upon clicking the "Save" button:', 'Special Request * is required', assertionResults, failureMessages)

                    cy.get('#modcde').clear()

                    cy.get('#modcde').type('Extra Gravy')

                    cy.get('#modgrpcde').click()

                    cy.get('.select__menu-list--is-multi').contains('.select__option', 'Chicken').click()

                    cy.get('.border-blue-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '14.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 
                } 
                
                else if (data[key].specialReq === "No plastic utensils") {

                    cy.wait(4000)

                    cy.get('#modcde').clear().type(data[key].specialReq)

                    cy.get('#modgrpcde').click()

                    cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                    cy.get('.border-red-500').click()

                    cy.checkLabelCaption('.h-auto', '6.1', 'Upon Clicking the "Save" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                    cy.contains('button[class*="border-red-500"]', 'No').click()

                    cy.wait(3000)

                    cy.checkElementVisibility('.shadow-lg', '6.2.1', 'Upon Clicking the "No" button:', 'The "Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                    cy.get('.border-red-500').click()

                    cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                    cy.checkElementInvisibility('.shadow-lg', '6.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Special Request" modal window was visible or active.', assertionResults, failureMessages)

                    cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '6.3.2', 'Upon clicking the "Yes" button', 'Special Request', assertionResults, failureMessages)

                    cy.wait(4000)

                    cy.get('.sc-eDLKkx > .anticon > svg').click()


                }

                else if (data[key].specialReq === "% & ( ) / - .") {

                    cy.wait(4000)

                    cy.get('#modcde').clear().type(data[key].specialReq)

                    cy.get('#modgrpcde').click()

                    cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                    cy.get('.border-blue-500').click()


                    cy.checkLabelCaption('.Toastify__toast-body', '5.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '5.2.1', 'Upon clicking the "Save" button:', 'The "Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                    // 43.2.2 Check if the "Description" textbox object is cleared or blank.

                }

                else if (data[key].specialReq === "This is a very long string that exceeds the maximum allowed length.") {

                    cy.wait(4000)

                    cy.get('#modcde').clear().type(data[key].specialReq)

                    cy.checkElementVisibility('.text-sm', '19.1', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible." was not visible.', assertionResults, failureMessages)

                    cy.get('#modgrpcde').click()

                    cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()
                    
                    cy.wait(4000)

                    cy.get('.border-blue-500').click()

                    cy.checkElementVisibility('.text-sm', '19.2', 'Upon clicking the "Save" button:', '"Please limit your input to 50 characters." notificaation message is not visible', assertionResults, failureMessages)


                }

                else if (data[key].specialReq === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                    cy.wait(4000)

                    cy.get('#modcde').clear().type(data[key].specialReq)

                    cy.checkLabelCaption('.Toastify__toast-body', '16.1', 'Upon encoding not allowed special characters:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                    cy.get('#modgrpcde').click()

                    cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                    cy.get('.border-blue-500').click()

                    cy.wait(4000)
                    
                    cy.checkLabelCaption('.Toastify__toast-body', '16.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                    // 16.2 click "OK" button on notification message.

                    cy.checkElementInvisibility('.shadow-lg', '16.2.1', 'Upon clicking the "OK" button:', 'The "Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                    // 16.2.2 Check if the "Description" textbox object is cleared or blank.

                }

                else {

                    cy.wait(4000)

                    cy.get('#modcde').clear().type(data[key].specialReq)

                    cy.get('#modgrpcde').click()

                    cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                    cy.get('.border-blue-500').click()


                    cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.wait(3000)
                    
                    cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                    // cy.get('.MuiSelect-select.MuiTablePagination-select').click();

                    // cy.get('ul[role="listbox"] li').contains('15').click();
                    
                    cy.get('.MuiTableBody-root').contains(data[key].specialReq).should('exist')

                }
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    });

    it('Edit Functionality', () => {

        cy.fixture('master-specialreq-data.json').then((data) => {

            const specificSpecialReq = data[7];

                cy.get('.MuiSelect-select.MuiTablePagination-select').click();

                cy.get('ul[role="listbox"] li').contains('15').click();

                cy.wait(2000);

                cy.contains('tbody > tr', specificSpecialReq.specialReq).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()

                })

                cy.checkElementVisibility('.shadow-lg', '21.1', 'Upon Clicking the "Edit" button:', 'The "Edit Special Request" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '21.1.1', 'Upon clicking the "Edit" button on pager UI', 'Edit Special Request', assertionResults, failureMessages)

                cy.checkLabelCaption('.mb-2', '21.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Item Subclass', assertionResults, failureMessages)
            
                // 54.1.3 Check correct object (textbox) width
                // Add when needed

                // 54.1.4 Check correct buttons(s) caption

                // 54.1.5 Check correct all object position

                cy.validateElements('specialreq-edit-el.json', '21.1.4 & 21.1.6', 'Upon clicking the "Edit" button on pager U/I:', assertionResults, failureMessages)

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


                cy.checkLabelCaption('.Toastify__toast-body', '25.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '25.2.1', 'Upon Clicking the "Save" button:', 'The "Edit Special Request" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificSpecialReq.editSpecialReq).should('exist')

                cy.wait(8000)
            })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-specialreq-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlyDelete === true) {

                    cy.wait(8000)

                    cy.contains('tbody > tr', data[key].specialReq).within(() => {
                        
                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkElementVisibility('.px-8', '26.1', 'Upon clicking the "Delete" button on pager UI:', 'The "Delete Confirmation" modal is not visible.')

                    cy.checkHeaderTitle('.px-8', '26.2', 'Upon clicking the "Delete" button on pager UI:', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', '26.3', 'Upon clicking the "Delete" button on pager UI', 'Do you want to delete: ' + data[key].specialReq + ' ?', assertionResults, failureMessages)

                    cy.validateElements('delete-confirm-el.json', '26.3', 'Upon clicking the "Upon clicking the Delete" button on pager U/I:', assertionResults, failureMessages)

                    cy.contains('button[class*="border-blue-500"]', 'Cancel').click()

                    cy.checkElementInvisibility('.shadow-lg', '26.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.wait(3000)

                    cy.contains('tbody > tr', data[key].specialReq).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.wait(4000)

                    cy.contains('button[class*="border-red-500"]', 'Confirm').click()

                    cy.checkLabelCaption('.Toastify__toast-body', '26.5.1', 'Upon Clicking the "Yes" button in Delete Confirmation modal:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.wait(6000)

                    cy.checkElementInvisibility('.shadow-lg', '26.5.2 ', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                }
            }
        })

        cy.checkForFailure(assertionResults, failureMessages);
    });


    it('Search Functionality', () => {

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

        cy.get('.text-\\[3rem\\]').should('be.visible')
          .should('have.text', 'Masterfile')
    });
});
