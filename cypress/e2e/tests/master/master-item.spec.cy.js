
let assertionResults = [];
let failureMessages = [];

describe('Item', () => {

    before(() => {

        // Clear the itemfile table before tests
        cy.task("queryDb","TRUNCATE TABLE itemfile")

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM itemfile").then((records) => {

            expect(records.length).to.be.equal(0)

        })

        // Delete all file in downloads for check print functinality test case
        cy.task('clearDownloads')

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-item-data')
        cy.execute('npm run sheet-converter module-selector-assert')
        cy.execute('npm run sheet-converter item-add-el')
        cy.execute('npm run sheet-converter item-edit-el')
        cy.wait(4000)

    })
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login('lstv', 'lstventures')

    })

    after(() => {

        // delete unecessary inputed data in the table 'itemfile'
        cy.fixture('data-to-delete.json').then((data) => {

            // Loop through each character and delete corresponding rows from the 'itemfile' table
            data.forEach((item) => {

                const specialChar = item.dataToDelete;
                const deleteQuery = `DELETE FROM itemfile WHERE itmdsc = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {

                    cy.log(`Deleted data with description: ${specialChar}`) // Log successful deletions

                })
            })
    
            // Ensure the table is clear of specified data
            cy.task('queryDb', 'SELECT * FROM itemfile').then((records) => {

                const remainingData = records.map((record) => record.description)
                const deletedChars = data.map((item) => item.dataToDelete)
                
                // Ensure no deleted special characters are still in the table
                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char)

                })
    
                cy.log('Specified data successfully deleted'); // Log success

            })
        })
    })

    it('Check Item Page', () => {  
        
        cy.navigateToModule('Master File', 'Item')

        cy.url({timeout: 10000}).should('contain', 'itemuests/?menfield=masterfile_special_requests')
        
        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Item:', '"Add Item" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Item pager U/I', 'Items', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Description'], '1.2.2', 'Upon Navigating to Item pager U/I', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to Item pager U/I', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Add Functionality', () => {

        cy.fixture('master-item-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', '"Add Item" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Item', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Description *', assertionResults,failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Subclassification *', assertionResults, failureMessages)
            
            cy.get('#itmdsc').invoke('outerWidth').then((width) => {

                 expect(width).to.equal(420)
                    
            })

            cy.get('#itmtyp').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#itemsubclasscde').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#itmclacde').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#untmea').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#untcst').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#barcde').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#untprc').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#itmpaxcount').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            cy.get('#memc').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            // 2.1.5 Check correct all object position

            cy.validateElements('item-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)
                            
            cy.fixture('dropdown-values.json').then((data) => { 

                const expectedSubclass = data.itemSubclass;
                const expectedClass = data.itemclass;
                const expectedItemType = data.itemType;
                const expectedTaxCode = data.taxCode;

                cy.get('#itmtyp').click()

                cy.get('.select__menu-list--is-multi')
                  .children('.select__option')
                  .then(($options) => {

                    // Get the text of all options in the dropdown
                    const actualOptions = [...$options].map(option => option.textContent.trim())

                    // Check that each expected option is present in the actual options
                    expectedItemType.forEach(expectedOption => {

                        expect(actualOptions).to.include(expectedOption)

                    })
                })

                cy.get('#itemsubclasscde').click()

                cy.get('.select__menu-list--is-multi')
                  .children('.select__option')
                  .then(($options) => {

                    // Get the text of all options in the dropdown
                    const actualOptions = [...$options].map(option => option.textContent.trim())

                    // Check that each expected option is present in the actual options
                    expectedSubclass.forEach(expectedOption => {

                        expect(actualOptions).to.include(expectedOption)

                    })
                })

                cy.get('#itmclacde').click()

                cy.get('.select__menu-list--is-multi')
                  .children('.select__option')
                  .then(($options) => {

                    // Get the text of all options in the dropdown
                    const actualOptions = [...$options].map(option => option.textContent.trim())

                    // Check that each expected option is present in the actual options
                    expectedClass.forEach(expectedOption => {

                        expect(actualOptions).to.include(expectedOption)

                    })
                })

                cy.get('#taxcde').click()

                cy.get('.select__menu-list--is-multi')
                  .children('.select__option')
                  .then(($options) => {

                    // Get the text of all options in the dropdown
                    const actualOptions = [...$options].map(option => option.textContent.trim())

                    // Check that each expected option is present in the actual options
                    expectedTaxCode.forEach(expectedOption => {

                        expect(actualOptions).to.include(expectedOption)

                    })
                })
            })

            cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]') .click()

            for (const key in data){

                cy.get('.sc-eDLKkx > .anticon > svg').click()

                cy.wait(4000) 
                
                cy.get('#itmdsc').type(data[key].item)
                  .then(($input) => {

                    if ($input.val() === "null") {

                        cy.get('.border-blue-500').click()

                        cy.wait(4000)

                        cy.checkLabelCaption('.text-sm', '45.2', 'Upon clicking the "Save" button:', 'Item Description * is required', assertionResults, failureMessages)

                        cy.get('#itmdsc').clear()

                        cy.

                        cy.get('#itmtyp').realClick()

                        cy.get('#itemsubclasscde').realClick()

                        cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                        cy.checkLabelCaption('.text-sm', '45.1', 'Upon clicking the "Save" button:', 'Item Subclass Description * is required', assertionResults, failureMessages)

                        cy.wait(4000)

                        cy.get('#modcde').type('Extra Gravy')

                        cy.get('#modgrpcde').click()

                        cy.get('.select__menu-list--is-multi').contains('.select__option', 'Chicken').click()

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '47.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                        cy.get('.px-8 > .flex > .anticon > svg').click()

                    } 
                    
                    else if ($input.val() === "No plastic utensils") {

                        cy.get('#modgrpcde').click()

                        cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                        cy.get('.border-red-500').click()

                        cy.checkLabelCaption('.h-auto', '40.1', 'Upon Clicking the "Save" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                        cy.contains('button[class*="border-red-500"]', 'No').click()

                        cy.wait(3000)

                        cy.checkElementVisibility('.shadow-lg', '6.2.1', 'Upon Clicking the "No" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.border-red-500').click()

                        cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                        cy.wait(3000)

                        cy.checkElementInvisibility('.shadow-lg', '40.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '40.3.2', 'Upon clicking the "Yes" button', 'Item', assertionResults, failureMessages)


                    }

                    else if ($input.val() === "% & ( ) / - .") {

                        cy.get('#modgrpcde').click()

                        cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '11.1', 'Upon Clicking the "Save" button:', 'Successfully saved!', assertionResults, failureMessages) 

                        cy.checkElementInvisibility('.shadow-lg', '11.2.1', 'Upon clicking the "OK" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                        // 43.2.2 Check if the "Description" textbox object is cleared or blank.

                    }

                    else if ($input.val() === "This is a very long string that exceeds the maximum allowed length.") {

                        cy.wrap($input).should('have.value', data[key].item)

                        cy.checkElementVisibility('.text-sm', '51.1', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible." was not visible.', assertionResults, failureMessages)

                        cy.get('#modgrpcde').click()

                        cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                        cy.get('.border-blue-500').click()

                        cy.checkElementVisibility('.text-sm', '52.2', 'Upon clicking the "Save" button:', '"Please limit your input to 50 characters." notificaation message is not visible', assertionResults, failureMessages)

                    }

                    else if ($input.val() === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` \\ ~ \\\" | \\ ] [ ] ; :") {

                        cy.get('#modgrpcde').click()

                        cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                        cy.get('.border-blue-500').click()
                        
                        cy.checkLabelCaption('.Toastify__toast-body', '49.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                        // 16.2 click "OK" button on notification message.

                        cy.checkElementInvisibility('.shadow-lg', '49.2.1', 'Upon clicking the "OK" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                        // 16.2.2 Check if the "Description" textbox object is cleared or blank.


                    }

                    else {

                        cy.wrap($input).should('have.value', data[key].item)

                        cy.get('#itmtyp').select(data[key].item)

                        cy.get('#itemsubclasscde').select()

                        cy.get('#itmclacde').select()

                        cy.get('#untmea').type()

                        cy.get('#untcst').type()

                        cy.get('#barcde').type()

                        cy.get('#untprc').type()

                        cy.get('#itmpaxcount').type()

                        cy.get('#taxcde').select()

                        cy.get('#memc').select()

                        cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved!', assertionResults, failureMessages) 

                        cy.wait(3000)
                        
                        cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.MuiSelect-select.MuiTablePagination-select').click();

                        cy.get('ul[role="listbox"] li').contains('15').click();
                        
                        cy.get('.MuiTableBody-root').contains(data[key].item).should('exist')
                    }
                }) 
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    });

    it('Edit Functionality', () => {

        cy.fixture('master-item-data.json').then((data) => {

            const specificitem = data[7];

                cy.get('.MuiSelect-select.MuiTablePagination-select').click();

                cy.get('ul[role="listbox"] li').contains('15').click();

                cy.wait(2000);

                cy.contains('tbody > tr', specificitem.item).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()

                })

                cy.checkElementVisibility('.shadow-lg', '54.1', 'Upon Clicking the "Edit" button:', 'The "Edit Item" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkHeaderTitle('.px-8', '54.1.1', 'Upon clicking the "Edit" button on pager UI', 'Edit Item', assertionResults, failureMessages)

                cy.checkLabelCaption('.mb-2', '54.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Item Subclass', assertionResults, failureMessages)
            
                // 54.1.3 Check correct object (textbox) width
                // Add when needed

                // 54.1.4 Check correct buttons(s) caption

                // 54.1.5 Check correct all object position

                cy.validateElements('item-edit-el.json', '54.1.4 & 54.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

                cy.get('#modcde')
                  .should('have.value', specificitem.item)
                  .clear()

                cy.get('#modcde').type(specificitem.edititem)

                cy.contains('.select__multi-value', specificitem.itemSubclass)
                  .find(`div[aria-label="Remove ${specificitem.itemSubclass}"]`)
                  .click()

                cy.get('#modgrpcde').click()

                cy.get('.select__menu-list--is-multi').contains('.select__option', specificitem.editItemSubclass).click()

                cy.get('.border-blue-500').click()

                cy.checkLabelCaption('.Toastify__toast-body', '57.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '57.2.1', 'Upon Clicking the "Update Data" button:', 'The "Edit Item" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificitem.edititem).should('exist')
            })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Delete Functionality', () => {

        cy.fixture('master-item-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlyDelete === true) {

                    cy.wait(4000)

                    cy.contains('tbody > tr', data[key].item).within(() => {
                        
                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.checkElementVisibility('.px-8', '26.1', 'Upon clicking the "Delete" button on pager UI:', 'The "Delete Confirmation" modal is not visible.')

                    cy.checkHeaderTitle('.px-8', '26.2', 'Upon clicking the "Delete" button on pager UI:', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', '26.3', 'Do you want to delete: ' + data[key].item + ' ?', assertionResults, failureMessages)

                    cy.validateElements('delete-confirm-el.json', '26.3', 'Upon clicking the "Upon clicking the Delete" button on pager U/I:', assertionResults, failureMessages)

                    cy.contains('button[class*="border-blue-500"]', 'Cancel').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '26.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.wait(3000)

                    cy.contains('tbody > tr', data[key].item).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.contains('button[class*="border-red-500"]', 'Confirm').click()

                    cy.wait(4000)

                    cy.checkLabelCaption('.Toastify__toast-body', '62.5.1', 'Upon Clicking the "Yes" button in Delete Confirmation modal:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '62.5.2 ', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                }
            }
        })

        cy.checkForFailure(assertionResults, failureMessages);
    });


    it('Search Functionality', () => {

        cy.fixture('master-item-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlySearchVal === true) {

                    // search valid data
                    cy.wait(2000)

                    cy.get('[data-testid="SearchIcon"]').click()

                    cy.get('#\\:rb\\:')
                      .clear()
                      .type(data[key].item)
                      .type('{enter}')

                    cy.wait(2000)
    
                    cy.get('.MuiTableBody-root').contains(data[key].item).should('exist')

                }

                if (data[key].onlySearchInval === true) {

                    // search invalid or not existing data
                    cy.wait(2000)
                            
                    cy.get('[data-testid="SearchIcon"]')
                      .click();
        
                    cy.get('#\\:rb\\:')
                      .clear()
                      .type(data[key].item)
        
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
