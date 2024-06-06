
let assertionResults = [];
let failureMessages = [];

describe('Item', () => {

    before(() => {

        cy.task("queryDb","TRUNCATE TABLE itemfile")

        cy.task("queryDb", "SELECT * FROM itemfile").then((records) => {

            expect(records.length).to.be.equal(0)

        })

        cy.task('clearDownloads')

        cy.wait(4000)
        cy.execute('npm run sheet-converter master-item-data')
        cy.execute('npm run sheet-converter item-selector-assert')
        cy.execute('npm run sheet-converter item-add-el')
        cy.execute('npm run sheet-converter item-edit-el')
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
                const deleteQuery = `DELETE FROM itemfile WHERE itmdsc = '${specialChar}'`;
                
                cy.task('queryDb', deleteQuery).then(() => {

                    cy.log(`Deleted data with description: ${specialChar}`) 

                })
            })
    
            cy.task('queryDb', 'SELECT * FROM itemfile').then((records) => {

                const remainingData = records.map((record) => record.description)
                const deletedChars = data.map((item) => item.dataToDelete)
                
                deletedChars.forEach((char) => {

                    expect(remainingData).to.not.include(char)

                })
    
                cy.log('Specified data Successfully deleted.'); // Log success

            })
        })
    })

    it('Check Item Page', () => {  

        cy.navigateToModule('Master File', 'Items')

        cy.url({timeout: 10000}).should('contain', 'items/?menfield=masterfile_items')
        
        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Item:', '"Item" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Item pager U/I', 'Items', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkTableColumnTitle(['Actions', 'Item', 'Item Class', 'Item Subclass', 'Price (PHP)', 'Tax Code'], '1.2.2', 'Upon Navigating to "Item" pager U/I', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        cy.validateElements('item-selector-assert.json', '1.2.5', 'Upon Navigating to "Item" pager U/I', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Add Functionality', () => {

        cy.addTestContext(`Upon Clicking "Add" button:
                            1. Some data encoded in Item Subclassification does not reflect on Item Subclassification dropdown object.
            `)  

        cy.fixture('master-item-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', '"Add Item" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Item', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="itmdsc"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item *', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="itmtyp"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Type *', assertionResults, failureMessages)
            
            cy.checkLabelCaption('label[for="itmclacde"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Classification *', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="itemsubclasscde"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Subclassification *', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="untmea"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Unit of Measure', assertionResults, failureMessages)

            // cy.checkLabelCaption('label[for="untcst"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Unit of Cost', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="barcde"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Barcode', assertionResults, failureMessages)

            // cy.checkLabelCaption('label[for="untprc"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Selling Price *', assertionResults, failureMessages)

            // cy.checkLabelCaption('label[for="itmpaxcount"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Good for X Person', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="taxcde"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'ax Code *', assertionResults, failureMessages)
            
            cy.get('#itmdsc').invoke('outerWidth').then((width) => {

                 expect(width).to.equal(403)
                    
            })

            cy.get('#itmtyp').invoke('outerWidth').then((width) => {

                expect(width).to.equal(403)
                   
            })

            cy.get('#itemsubclasscde').invoke('outerWidth').then((width) => {

                expect(width).to.equal(403)
                   
            })

            cy.get('#itmclacde').invoke('outerWidth').then((width) => {

                expect(width).to.equal(403)
                   
            })

            cy.get('#untmea').invoke('outerWidth').then((width) => {

                expect(width).to.equal(403)
                   
            })

            cy.get('#untcst').invoke('outerWidth').then((width) => {

                expect(width).to.equal(403)
                   
            })

            cy.get('#barcde').invoke('outerWidth').then((width) => {

                expect(width).to.equal(403)
                   
            })

            cy.get('#untprc').invoke('outerWidth').then((width) => {

                expect(width).to.equal(403)
                   
            })

            cy.get('#itmpaxcount').invoke('outerWidth').then((width) => {

                expect(width).to.equal(403)
                   
            })

            cy.get('#memc').invoke('outerWidth').then((width) => {

                expect(width).to.equal(403)
                   
            })

            // 2.1.5 Check correct all object position

            cy.validateElements('item-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)
                            
            cy.fixture('dropdown-values.json').then((data) => { 

                const expectedSubclass = data.itemSubclass;
                const expectedClass = data.itemclass;
                const expectedItemType = data.itemType;
                const expectedTaxCode = data.taxCode;

                cy.get('#itmtyp')
                  .should('exist')
                  .find('option')
                  .then(($options) => {

                    // Get the text of all options in the dropdown
                    const actualOptions = [...$options].map(option => option.textContent.trim())

                    // Check that each expected option is present in the actual options
                    expectedItemType.forEach(expectedOption => {

                        expect(actualOptions).to.include(expectedOption)

                    })
                })

                cy.get('#itemsubclasscde').realClick()

                cy.get('#itemsubclasscde')
                  .should('exist')
                  .find('option')
                  .then(($options) => {

                    // Get the text of all options in the dropdown
                    const actualOptions = [...$options].map(option => option.textContent.trim())

                    // Check that each expected option is present in the actual options
                    expectedSubclass.forEach(expectedOption => {

                        expect(actualOptions).to.include(expectedOption)

                    })
                })

                cy.get('#itmclacde').realClick()

                cy.get('#itmclacde')
                  .should('exist')
                  .find('option')
                  .then(($options) => {

                    // Get the text of all options in the dropdown
                    const actualOptions = [...$options].map(option => option.textContent.trim())

                    // Check that each expected option is present in the actual options
                    expectedClass.forEach(expectedOption => {

                        expect(actualOptions).to.include(expectedOption)

                    })
                })

                cy.get('#taxcde').realClick()

                cy.get('#taxcde')
                  .should('exist')
                  .find('option')
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

                        cy.get('#itmdsc').clear()

                        cy.get('.border-blue-500').click()

                        cy.wait(4000)

                        cy.checkLabelCaption('.text-sm', '80.1.1', 'Upon clicking the "Save" button:', 'Item * is required', assertionResults, failureMessages)

                        // cy.checkLabelCaption('.text-sm', '80.1.2', 'Upon clicking the "Save" button:', 'Item Type * is required', assertionResults, failureMessages)

                        // cy.checkLabelCaption('.text-sm', '80.1.3', 'Upon clicking the "Save" button:', 'Item Classification * is required', assertionResults, failureMessages)

                        // cy.checkLabelCaption('.text-sm', '80.1.4', 'Upon clicking the "Save" button:', 'Item Subclassification * is required', assertionResults, failureMessages)

                        // cy.checkLabelCaption('.text-sm', '80.1.5', 'Upon clicking the "Save" button:', 'Selling Price * is required', assertionResults, failureMessages)

                        // cy.checkLabelCaption('.text-sm', '80.1.6', 'Upon clicking the "Save" button:', 'Tax Code  * is required', assertionResults, failureMessages)

                        cy.wait(4000)

                        cy.get('#itmdsc').type('Yumburger Solo')

                        cy.get('#itmtyp').select('NON-INVENTORY')

                        cy.get('#itemsubclasscde').select('Food')

                        cy.get('#itmclacde').select('Burgers')

                        cy.get('#untmea').type('PCS')

                        cy.get('#untcst').type('0')

                        cy.get('#barcde').type('00000000001')

                        cy.get('#untprc').type(40)

                        cy.get('#itmpaxcount').type(1)

                        cy.get('#taxcde').select('VATABLE')

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '63.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                        cy.get('.px-8 > .flex > .anticon > svg').click()

                    } 
                    
                    else if ($input.val() === "Ube Cheese Pie") {

                        cy.get('#itmtyp').select(data[key].itemType)

                        cy.get('#itemsubclasscde').select(data[key].itemSubclass)

                        cy.get('#itmclacde').select(data[key].itemClass)

                        cy.get('#untmea').type(data[key].unitMeasure)

                        cy.get('#untcst').type(data[key].unitCost)

                        cy.get('#barcde').type(data[key].barcode)

                        cy.get('#untprc').type(data[key].sellingPrice)

                        cy.get('#itmpaxcount').type(data[key].goodXPerson)

                        cy.get('#taxcde').select(data[key].taxCode)

                        cy.get('.border-red-500').click()

                        cy.checkLabelCaption('.h-auto', '18.1', 'Upon Clicking the "Save" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                        cy.contains('button[class*="border-red-500"]', 'No').click()

                        cy.wait(3000)

                        cy.checkElementVisibility('.shadow-lg', '18.2.1', 'Upon Clicking the "No" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.border-red-500').click()

                        cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                        cy.wait(3000)

                        cy.checkElementInvisibility('.shadow-lg', '18.3.1', 'Upon Clicking the "Yes" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]', '18.3.2', 'Upon clicking the "Yes" button', 'Item', assertionResults, failureMessages)


                    }

                    else if ($input.val() === "% & ( ) / - .") {

                        cy.get('#itmtyp').select(data[key].itemType)

                        cy.get('#itemsubclasscde').select(data[key].itemSubclass)

                        cy.get('#itmclacde').select(data[key].itemClass)

                        cy.get('#untmea').type(data[key].unitMeasure)

                        cy.get('#untcst').type(data[key].unitCost)

                        cy.get('#barcde').type(data[key].barcode)

                        cy.get('#untprc').type(data[key].sellingPrice)

                        cy.get('#itmpaxcount').type(data[key].goodXPerson)

                        cy.get('#taxcde').select(data[key].taxCode)

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '48.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.checkElementInvisibility('.shadow-lg', '48.2', 'Upon clicking the "OK" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                        // 43.2.2 Check if the "Description" textbox object is cleared or blank.

                    }

                    else if ($input.val() === "This is a very long string that exceeds the maximum allowed length.") {

                        cy.wrap($input).should('have.value', data[key].item)

                        cy.get('#itmtyp').select(data[key].itemType)

                        cy.get('#itemsubclasscde').select(data[key].itemSubclass)

                        cy.get('#itmclacde').select(data[key].itemClass)

                        cy.get('#untmea').type(data[key].unitMeasure)

                        cy.get('#untcst').type(data[key].unitCost)

                        cy.get('#barcde').type(data[key].barcode)

                        cy.get('#untprc').type(data[key].sellingPrice)

                        cy.get('#itmpaxcount').type(data[key].goodXPerson)

                        cy.get('#taxcde').select(data[key].taxCode)

                        cy.checkElementVisibility('.text-sm', ' ', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible." was not visible.', assertionResults, failureMessages)

                        cy.get('#modgrpcde').click()

                        cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                        cy.get('.border-blue-500').click()

                        cy.checkElementVisibility('.text-sm', ' ', 'Upon clicking the "Save" button:', '"Please limit your input to 50 characters." notificaation message is not visible', assertionResults, failureMessages)

                    }

                    else if ($input.val() === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                        cy.get('#itmtyp').select(data[key].itemType)

                        cy.get('#itemsubclasscde').select(data[key].itemSubclass)

                        cy.get('#itmclacde').select(data[key].itemClass)

                        cy.get('#untmea').type(data[key].unitMeasure)

                        cy.get('#untcst').type(data[key].unitCost)

                        cy.get('#barcde').type(data[key].barcode)

                        cy.get('#untprc').type(data[key].sellingPrice)

                        cy.get('#itmpaxcount').type(data[key].goodXPerson)

                        cy.get('#taxcde').select(data[key].taxCode)

                        cy.get('.border-blue-500').click()
                        
                        cy.checkLabelCaption('.Toastify__toast-body', '78.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                        // 16.2 click "OK" button on notification message.

                        cy.checkElementInvisibility('.shadow-lg', '78.2', 'Upon clicking the "OK" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                        // 16.2.2 Check if the "Description" textbox object is cleared or blank.


                    }

                    else {

                        cy.wrap($input).should('have.value', data[key].item)

                        cy.get('#itmtyp').select(data[key].itemType)

                        cy.get('#itemsubclasscde').select(data[key].itemSubclass)

                        cy.get('#itmclacde').select(data[key].itemClass)

                        cy.get('#untmea').type(data[key].unitMeasure)

                        cy.get('#untcst').type(data[key].unitCost)

                        cy.get('#barcde').type(data[key].barcode)

                        cy.get('#untprc').type(data[key].sellingPrice)

                        cy.get('#itmpaxcount').type(data[key].goodXPerson)

                        cy.get('#taxcde').select(data[key].taxCode)

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '17.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.wait(3000)
                        
                        cy.checkElementVisibility('.shadow-lg', '17.2', 'Upon Clicking the "Save" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

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

            const specificItem = data[2];

                cy.get('.MuiSelect-select.MuiTablePagination-select').click()

                cy.get('ul[role="listbox"] li').contains('15').click()

                cy.wait(2000);

                cy.contains('tbody > tr', specificItem.item).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()

                })

                cy.checkElementVisibility('.shadow-lg', '81.1', 'Upon Clicking the "Edit" button:', 'The "Edit Item" modal window was not visible or active.', assertionResults, failureMessages)

                cy.checkLabelCaption('label[for="itmdsc"]', '81.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Item *', assertionResults, failureMessages)

                cy.checkLabelCaption('label[for="itmtyp"]', '81.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Item Type *', assertionResults, failureMessages)
                
                cy.checkLabelCaption('label[for="itmclacde"]', '81.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Item Classification *', assertionResults, failureMessages)

                cy.checkLabelCaption('label[for="itemsubclasscde"]', '81.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Item Subclassification *', assertionResults, failureMessages)

                cy.checkLabelCaption('label[for="untmea"]', '81.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Unit of Measure', assertionResults, failureMessages)

                // cy.checkLabelCaption('label[for="untcst"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Unit of Cost', assertionResults, failureMessages)

                cy.checkLabelCaption('label[for="barcde"]', '81.1.2', 'Upon clicking the "Edit" button on pager U/I', 'Barcode', assertionResults, failureMessages)

            
                // 54.1.3 Check correct object (textbox) width
                // Add when needed

                // 54.1.4 Check correct buttons(s) caption

                // 54.1.5 Check correct all object position

                cy.validateElements('item-edit-el.json', '81.1.4 & 81.1.6', 'Upon clicking the "Edit" button on pager U/I:', assertionResults, failureMessages)

                cy.get('#itmdsc').clear().type(specificItem.item)

                cy.get('#itmtyp').select(specificItem.itemType)

                cy.get('#itemsubclasscde').select(specificItem.itemSubclass)

                cy.get('#itmclacde').select(specificItem.itemClass)

                cy.get('#untmea').clear().type(specificItem.unitMeasure)

                cy.get('#untcst').clear().type(specificItem.unitCost)

                cy.get('#barcde').clear().type(specificItem.barcode)

                cy.get('#untprc').clear().type(specificItem.sellingPrice)

                cy.get('#itmpaxcount').clear().type(specificItem.goodXPerson)

                cy.get('#taxcde').select(specificItem.taxCode)

                cy.get('.border-blue-500').click()

                cy.checkLabelCaption('.Toastify__toast-body', '96.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '96.2.1', 'Upon Clicking the "Save" button:', 'The "Edit Item" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificItem.editItem).should('exist')
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

                    cy.checkElementVisibility('.px-8', '97.1', 'Upon clicking the "Delete" button on pager UI:', 'The "Delete Confirmation" modal is not visible.')

                    cy.checkHeaderTitle('.px-8', '97.2', 'Upon clicking the "Delete" button on pager UI:', 'Delete Confirmation', assertionResults, failureMessages)
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', '26.3', 'Do you want to delete: ' + data[key].item + ' ?', assertionResults, failureMessages)

                    cy.validateElements('delete-confirm-el.json', '97.3', 'Upon clicking the "Upon clicking the Delete" button on pager U/I:', assertionResults, failureMessages)

                    cy.contains('button[class*="border-blue-500"]', 'Cancel').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '97.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.wait(3000)

                    cy.contains('tbody > tr', data[key].item).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.contains('button[class*="border-red-500"]', 'Confirm').click()

                    cy.wait(4000)

                    cy.checkLabelCaption('.Toastify__toast-body', '97.5.1', 'Upon Clicking the "Yes" button in Delete Confirmation modal:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '97.5.2 ', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

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

                    cy.get('input[placeholder="Search Item Description"]')
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
        
                    cy.get('input[placeholder="Search Item Description"]')
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
