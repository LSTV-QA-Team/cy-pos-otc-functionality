
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
    })

    it('Add Functionality', () => {  

        cy.fixture('master-item-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Item', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="barcde"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Barcode', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="itmdsc"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item *', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="itmdscforeign"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Foreign Description', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="itmtyp"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Type *', assertionResults, failureMessages)
            
            cy.checkLabelCaption('label[for="itmclacde"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Classification *', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="itemsubclasscde"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Item Subclassification *', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="untmea"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Unit of Measure', assertionResults, failureMessages)

            // cy.checkLabelCaption('label[for="untcst"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Unit of Cost', assertionResults, failureMessages)

            // cy.checkLabelCaption('label[for="untprc"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Selling Price *', assertionResults, failureMessages)

            // cy.checkLabelCaption('label[for="itmpaxcount"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Good for X Person', assertionResults, failureMessages)

            cy.checkLabelCaption('label[for="taxcde"]', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Tax Code *', assertionResults, failureMessages)
            
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

                const expectedClass = data.itemclass;
                const expectedItemType = data.itemType;
                const expectedTaxCode = data.taxCode;
                const expectedFood = data.food;
                const expectedBeverages = data.beverages;
                const expectedDessert = data.dessert;

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

            cy.fixture('class-dropdown-values.json').then((data) => {

                for (const key in data) {

                    cy.get('#itmclacde').realClick()

                    cy.get('#itmclacde')
                      .select(data[0].classDropdownValues)

                    // cy.get('#itemsubclasscde').should('have.value', '-- Select an option --')

                    cy.get('#itemsubclasscde').realClick()

                    cy.get('#itemsubclasscde')
                      .should('exist')
                      .find('option')
                      .then(($options) => {

                        // Get the text of all options in the dropdown
                        const actualOptions = [...$options].map(option => option.textContent.trim())

                        // Check that each expected option is present in the actual options
                        expectedFood.forEach(expectedOption => {

                            expect(actualOptions).to.include(expectedOption)

                        })
                    })
                    
                    cy.get('#itmclacde').realClick()

                    cy.get('#itmclacde')
                      .select(data[1].classDropdownValues)

                    cy.get('#itemsubclasscde').realClick()

                    cy.get('#itemsubclasscde')
                      .should('exist')
                      .find('option')
                      .then(($options) => {

                        // Get the text of all options in the dropdown
                        const actualOptions = [...$options].map(option => option.textContent.trim())

                        // Check that each expected option is present in the actual options
                        expectedBeverages.forEach(expectedOption => {

                            expect(actualOptions).to.include(expectedOption)

                        })
                    })

                    cy.get('#itmclacde').realClick()

                    cy.get('#itmclacde')
                      .select(data[2].classDropdownValues)

                    cy.get('#itemsubclasscde').realClick()

                    cy.get('#itemsubclasscde')
                      .should('exist')
                      .find('option')
                      .then(($options) => {

                        // Get the text of all options in the dropdown
                        const actualOptions = [...$options].map(option => option.textContent.trim())

                        // Check that each expected option is present in the actual options
                        expectedDessert.forEach(expectedOption => {

                            expect(actualOptions).to.include(expectedOption)

                        })
                    })
                }
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

            // cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]').click()

            for (const key in data){

                // cy.get('.sc-eDLKkx > .anticon > svg').click()

                cy.wait(8000) 

                if (data[key].item === "null") {

                    cy.get('#itmdsc').clear().type(data[key].item)

                    cy.get('#itmdsc').clear()

                    cy.get('.border-blue-500').click()

                    cy.wait(4000)

                    cy.get('form#i-form').within(() => {

                        cy.get('#itmdsc')
                            .should('have.attr', 'aria-invalid', 'true')
                            .siblings('div[role="alert"]')
                            .should('contain', 'Item * is required')
                        
                        cy.get('#itmtyp')
                            .should('have.attr', 'aria-invalid', 'true')
                            .siblings('div[role="alert"]')
                            .should('contain', 'Item Type * is required')
            
                        cy.get('#itmclacde')
                            .should('have.attr', 'aria-invalid', 'true')
                            .siblings('div[role="alert"]')
                            .should('contain', 'Item Classification * is required')

                        cy.get('#itemsubclasscde')
                            .should('have.attr', 'aria-invalid', 'true')
                            .siblings('div[role="alert"]')
                            .should('contain', 'Item Subclassification * is required')
            
                        cy.get('#untprc')
                            .should('have.attr', 'aria-invalid', 'true')
                            .siblings('div[role="alert"]')
                            .should('contain', 'Selling Price * is required')
            
                        cy.get('#taxcde')
                            .should('have.attr', 'aria-invalid', 'true')
                            .siblings('div[role="alert"]')
                            .should('contain', 'Tax Code * is required')
                    })

                    cy.wait(4000)

                    cy.get('#itmdsc').clear().type('Yumburger Solo')

                    cy.get('#itmtyp').select('NON-INVENTORY')

                    cy.get('#itmclacde').select('Food')

                    cy.get('#itemsubclasscde').select('Burger')

                    cy.get('#untmea').clear().type('PCS')

                    cy.get('#untcst').clear().type('0')

                    cy.get('#barcde').clear().type('00000000001')

                    cy.get('#untprc').clear().type(40)

                    cy.get('#itmpaxcount').clear().type(1)

                    cy.get('#taxcde').select('VATABLE')

                    cy.get('.border-blue-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '63.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                    // cy.get('.px-8 > .flex > .anticon > svg').click()

                } 
                
                else if (data[key].item === "Ube Cheese Pie") {

                    cy.wait(8000)

                    cy.checkLabelCaption('.bg-green-200', '4.2.3', 'Upon Clicking the "Save" button:', 'To add another data, fill out the details below then click "Save" button. Click "Cancel" button to cancel adding new data.', assertionResults, failureMessages)

                    cy.get('#itmdsc').clear().type(data[key].item)

                    cy.get('#itmtyp').select(data[key].itemType)

                    cy.get('#itmclacde').select(data[key].itemClass)

                    cy.get('#itemsubclasscde').select(data[key].itemSubclass)

                    cy.wait(2000)

                    cy.get('#untmea').clear().type(data[key].unitMeasure)

                    cy.get('#untcst').clear().type(data[key].unitCost)

                    cy.get('#barcde').clear().type(data[key].barcode)

                    cy.get('#untprc').clear().type(data[key].sellingPrice)

                    cy.get('#itmpaxcount').clear().type(data[key].goodXPerson)

                    cy.get('#taxcde').select(data[key].taxCode)

                    if (data[key].addOn === true) {

                        cy.get('#isaddon').click()

                    } else {

                        cy.get('#isaddon').should('not.be.checked')
                    }

                    if (data[key].inactive === true) {

                        cy.get('#inactive').click()

                    } else {

                        cy.get('#inactive').should('not.be.checked')
                    }

                    if (data[key].comboMeal === true) {

                        cy.get('#chkcombo').click()

                        cy.get('.ant-tabs-tab-active').click()

                        cy.fixture('item-combomeal-data.json').then((comboData) => {

                            cy.wait(8000)

                            if (data[key].item === "FSM A 6-pcs. Chickenjoy Bucket") {
                                
                                comboData.FSMA6.forEach((fsma6) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsma6)

                                    cy.get('.select__menu-list').contains('div', fsma6).click()

                                })

                            } else if (data[key].item === "FSM A 8-pcs. Chickenjoy Bucket") {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMA8.forEach((fsma8) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsma8)

                                    cy.get('.select__menu-list').contains('div', fsma8).click()

                                })

                            } else if (data[key].item === "FSM B 6-pcs. Chickenjoy Bucket") {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMB6.forEach((fsmb6) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsmb6)

                                    cy.get('.select__menu-list').contains('div', fsmb6).click()

                                })
                                
                            } else {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMB8.forEach((fsmb8) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsmb8)

                                    cy.get('.select__menu-list').contains('div', fsmb8).click()

                                })
                            }
                        })
                        

                    } else {

                        cy.get('#chkcombo').should('not.be.checked')
                    }

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

                    cy.wait(4000)

                    cy.get('.sc-eDLKkx > .anticon > svg').click()


                }

                else if (data[key].item === "% & ( ) / - . ,") {

                    cy.wait(8000)

                    cy.get('#itmdsc').clear().type(data[key].item)

                    cy.checkValue('#itmdsc', '0', 'After Encoding in "Item" Textbox:', data[key].item, assertionResults, failureMessages)

                    cy.get('#itmtyp').select(data[key].itemType)

                    cy.checkValue('#itmdsc', '0', 'After Encoding in "Item" Textbox:', data[key].item, assertionResults, failureMessages)

                    cy.get('#itemsubclasscde').select(data[key].itemSubclass)

                    cy.checkValue('#itmdsc', '0', 'After Encoding in "Item" Textbox:', data[key].item, assertionResults, failureMessages)

                    cy.get('#itmclacde').select(data[key].itemClass)

                    cy.checkValue('#itmdsc', '0', 'After Encoding in "Item" Textbox:', data[key].item, assertionResults, failureMessages)

                    cy.wait(2000)

                    cy.get('#untmea').clear().type(data[key].unitMeasure)

                    cy.checkValue('#itmdsc', '0', 'After Encoding in "Item" Textbox:', data[key].item, assertionResults, failureMessages)

                    cy.get('#untcst').clear().type(data[key].unitCost)

                    cy.checkValue('#itmdsc', '0', 'After Encoding in "Item" Textbox:', data[key].item, assertionResults, failureMessages)

                    cy.get('#barcde').clear().type(data[key].barcode)

                    cy.checkValue('#itmdsc', '0', 'After Encoding in "Item" Textbox:', data[key].item, assertionResults, failureMessages)

                    cy.get('#untprc').clear().type(data[key].sellingPrice)

                    cy.checkValue('#itmdsc', '0', 'After Encoding in "Item" Textbox:', data[key].item, assertionResults, failureMessages)

                    cy.get('#itmpaxcount').clear().type(data[key].goodXPerson)

                    cy.checkValue('#itmdsc', '0', 'After Encoding in "Item" Textbox:', data[key].item, assertionResults, failureMessages)

                    cy.get('#taxcde').select(data[key].taxCode)

                    cy.checkValue('#itmdsc', '0', 'After Encoding in "Item" Textbox:', data[key].item, assertionResults, failureMessages)

                    if (data[key].addOn === true) {

                        cy.get('#isaddon').click()

                    } else {

                        cy.get('#isaddon').should('not.be.checked')
                    }

                    if (data[key].inactive === true) {

                        cy.get('#inactive').click()

                    } else {

                        cy.get('#inactive').should('not.be.checked')
                    }

                    if (data[key].comboMeal === true) {

                        cy.get('#chkcombo').click()

                        cy.get('.ant-tabs-tab-active').click()

                        cy.fixture('item-combomeal-data.json').then((comboData) => {

                            cy.wait(8000)

                            if (data[key].item === "FSM A 6-pcs. Chickenjoy Bucket") {

                                comboData.FSMA6.forEach((fsma6) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsma6)

                                    cy.get('.select__menu-list').contains('div', fsma6).click()

                                })

                            } else if (data[key].item === "FSM A 8-pcs. Chickenjoy Bucket") {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMA8.forEach((fsma8) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsma8)

                                    cy.get('.select__menu-list').contains('div', fsma8).click()

                                })

                            } else if (data[key].item === "FSM B 6-pcs. Chickenjoy Bucket") {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMB6.forEach((fsmb6) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsmb6)

                                    cy.get('.select__menu-list').contains('div', fsmb6).click()

                                })
                                
                            } else {

                                comboData.FSMB8.forEach((fsmb8) => {

                                    cy.get('.select__clear-indicator').click()

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsmb8)

                                    cy.get('.select__menu-list').contains('div', fsmb8).click()

                                })
                            }
                        })

                    } else {

                        cy.get('#chkcombo').should('not.be.checked')
                    }

                    cy.get('.border-blue-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '48.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '48.2', 'Upon clicking the "OK" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                    // 43.2.2 Check if the "Description" textbox object is cleared or blank.

                }

                else if (data[key].item === "Delicious and crispy Chickenjoy with a side of Jolly Spaghetti and garlic rice, perfect for a fulfilling meal") {

                    cy.wait(8000)

                    cy.get('#itmdsc').clear().type(data[key].item)

                    cy.checkElementVisibility('.text-sm', '18.1', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                    cy.get('#itmtyp').select(data[key].itemType)

                    cy.get('#itmclacde').select(data[key].itemClass)

                    cy.get('#itemsubclasscde').select(data[key].itemSubclass)

                    cy.wait(2000)

                    cy.get('#untmea').clear().type(data[key].unitMeasure)

                    cy.get('#untcst').clear().type(data[key].unitCost)

                    cy.get('#barcde').clear().type(data[key].barcode)

                    cy.get('#untprc').clear().type(data[key].sellingPrice)

                    cy.get('#itmpaxcount').clear().type(data[key].goodXPerson)

                    cy.get('#taxcde').select(data[key].taxCode)

                    if (data[key].addOn === true) {

                        cy.get('#isaddon').click()

                    } else {

                        cy.get('#isaddon').should('not.be.checked')
                    }

                    if (data[key].inactive === true) {

                        cy.get('#inactive').click()

                    } else {

                        cy.get('#inactive').should('not.be.checked')
                    }

                    if (data[key].comboMeal === true) {

                        cy.get('#chkcombo').click()

                        cy.get('.ant-tabs-tab-active').click()

                        cy.fixture('item-combomeal-data.json').then((comboData) => {

                            cy.wait(8000)

                            if (data[key].item === "FSM A 6-pcs. Chickenjoy Bucket") {

                                comboData.FSMA6.forEach((fsma6) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsma6)

                                    cy.get('.select__menu-list').contains('div', fsma6).click()

                                })
                            } else if (data[key].item === "FSM A 8-pcs. Chickenjoy Bucket") {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMA8.forEach((fsma8) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsma8)

                                    cy.get('.select__menu-list').contains('div', fsma8).click()

                                })

                            } else if (data[key].item === "FSM B 6-pcs. Chickenjoy Bucket") {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMB6.forEach((fsmb6) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsmb6)

                                    cy.get('.select__menu-list').contains('div', fsmb6).click()

                                })
                                
                            } else {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMB8.forEach((fsmb8) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsmb8)

                                    cy.get('.select__menu-list').contains('div', fsmb8).click()

                                })
                            }
                        })

                    } else {

                        cy.get('#chkcombo').should('not.be.checked')
                    }

                    cy.checkElementVisibility('.text-sm', '14.1', 'Upon encoding data:', 'The validation message for "Please limit your input to 50 characters." was not visible." was not visible.', assertionResults, failureMessages)

                    // cy.get('#modgrpcde').click()

                    // cy.get('.select__menu-list--is-multi').contains('.select__option', data[key].itemSubclass).click()

                    cy.get('.border-blue-500').click()

                    cy.wait(2000)

                    cy.checkElementVisibility('.Toastify__toast-body', '14.1', 'Upon clicking the "Save" button:', '"Please limit your input to 50 characters." notificaation message is not visible', assertionResults, failureMessages)

                }

                else if (data[key].item === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                    cy.wait(8000)
                    
                    cy.get('#itmdsc').clear().type(data[key].item)

                    cy.checkLabelCaption('.Toastify__toast-body', '16.1', 'Upon encoding not allowed special characters:', 'Please use only the following approved special characters: % & ( ) / - . ,', assertionResults, failureMessages)

                    cy.get('#itmtyp').select(data[key].itemType)

                    cy.get('#itemsubclasscde').select(data[key].itemSubclass)

                    cy.get('#itmclacde').select(data[key].itemClass)

                    cy.wait(2000)

                    cy.get('#untmea').clear().type(data[key].unitMeasure)

                    cy.get('#untcst').clear().type(data[key].unitCost)

                    cy.get('#barcde').clear().type(data[key].barcode)

                    cy.get('#untprc').clear().type(data[key].sellingPrice)

                    cy.get('#itmpaxcount').clear().type(data[key].goodXPerson)

                    cy.get('#taxcde').select(data[key].taxCode)

                    if (data[key].addOn === true) {

                        cy.get('#isaddon').click()

                    } else {

                        cy.get('#isaddon').should('not.be.checked')
                    }

                    if (data[key].inactive === true) {

                        cy.get('#inactive').click()

                    } else {

                        cy.get('#inactive').should('not.be.checked')
                    }

                    if (data[key].comboMeal === true) {

                        cy.get('#chkcombo').click()

                        cy.get('.ant-tabs-tab-active').click()

                        cy.fixture('item-combomeal-data.json').then((comboData) => {

                            cy.wait(8000)

                            if (data[key].item === "FSM A 6-pcs. Chickenjoy Bucket") {
                                
                                comboData.FSMA6.forEach((fsma6) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsma6)

                                    cy.get('.select__menu-list').contains('div', fsma6).click()

                                })

                            } else if (data[key].item === "FSM A 8-pcs. Chickenjoy Bucket") {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMA8.forEach((fsma8) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsma8)

                                    cy.get('.select__menu-list').contains('div', fsma8).click()

                                })

                            } else if (data[key].item === "FSM B 6-pcs. Chickenjoy Bucket") {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMB6.forEach((fsmb6) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsmb6)

                                    cy.get('.select__menu-list').contains('div', fsmb6).click()

                                })

                            } else {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMB8.forEach((fsmb8) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsmb8)

                                    cy.get('.select__menu-list').contains('div', fsmb8).click()

                                })
                            }
                        })

                    } else {

                        cy.get('#chkcombo').should('not.be.checked')
                    }

                    cy.get('.border-blue-500').click()

                    cy.wait(2000)
                    
                    cy.checkLabelCaption('.Toastify__toast-body', '78.1', 'Upon Clicking the "Save" button:', 'Please use only the following approved special characters: % & ( ) / - .', assertionResults, failureMessages) 

                    // 16.2 click "OK" button on notification message.

                    cy.checkElementInvisibility('.shadow-lg', '78.2', 'Upon clicking the "OK" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                    // 16.2.2 Check if the "Description" textbox object is cleared or blank.

                }

                else {

                    cy.wait(8000)

                    cy.get('#itmdsc').clear().type(data[key].item)

                    cy.get('#itmtyp').realClick()

                    cy.get('#itmtyp').select(data[key].itemType)

                    cy.get('#itmclacde').select(data[key].itemClass)

                    cy.get('#itemsubclasscde').select(data[key].itemSubclass)

                    cy.get('#untmea')
                        .clear()
                        .type(data[key].unitMeasure)

                    cy.get('#untcst')
                        .clear() 
                        .type(data[key].unitCost)

                    cy.get('#barcde')
                        .clear()
                        .type(data[key].barcode)

                    cy.get('#untprc')
                        .clear() 
                        .type(data[key].sellingPrice)

                    cy.get('#itmpaxcount')
                        .clear()
                        .type(data[key].goodXPerson)

                    cy.get('#taxcde').select(data[key].taxCode)

                    if (data[key].addOn === true) {

                        cy.get('#isaddon').click()

                    } else {

                        cy.get('#isaddon').should('not.be.checked')
                    }

                    if (data[key].inactive === true) {

                        cy.get('#inactive').click()

                    } else {

                        cy.get('#inactive').should('not.be.checked')
                    }

                    if (data[key].comboMeal === true) {

                        cy.get('#chkcombo').click()

                        cy.get('.ant-tabs-tab-active').click()

                        cy.fixture('item-combomeal-data.json').then((comboData) => {

                            cy.wait(8000)

                            if (data[key].item === "FSM A 6-pcs. Chickenjoy Bucket") {
                                
                                comboData.FSMA6.forEach((fsma6) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsma6)

                                    cy.get('.select__menu-list').contains('div', fsma6).click()

                                })

                            } else if (data[key].item === "FSM A 8-pcs. Chickenjoy Bucket") {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMA8.forEach((fsma8) => {


                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsma8)

                                    cy.get('.select__menu-list').contains('div', fsma8).click()

                                })

                            } else if (data[key].item === "FSM B 6-pcs. Chickenjoy Bucket") {

                                cy.get('.select__clear-indicator').click()

                                comboData.FSMB6.forEach((fsmb6) => {

                                    cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsmb6)

                                    cy.get('.select__menu-list').contains('div', fsmb6).click()

                                })
                                
                            } else {

                                cy.get('.select__value-container').then($container => {
                                    if ($container.find('.select__multi-value').length > 0) {

                                        cy.get('.select__clear-indicator').click()

                                    } else {

                                        comboData.FSMB8.forEach((fsmb8) => {

                                            cy.get('#selectedItemDefault > .select__control > .select__value-container').click().type(fsmb8)
        
                                            cy.get('.select__menu-list').contains('div', fsmb8).click()
        
                                        })

                                    }
                                })
                            }
                        })

                    } else {

                        cy.get('#chkcombo').should('not.be.checked')
                    }

                    cy.get('.border-blue-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '17.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                    cy.wait(8000)
                    
                    cy.checkElementVisibility('.shadow-lg', '17.2', 'Upon Clicking the "Save" button:', 'The "Add Item" modal window was not visible or active.', assertionResults, failureMessages)

                    // cy.get('.MuiSelect-select.MuiTablePagination-select').click();

                    // cy.get('ul[role="listbox"] li').contains('100').click();
                    
                    // cy.get('.MuiTableBody-root').contains(data[key].item).should('exist')
                }
            }
        })

        cy.wait(8000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    })

    it('Edit Functionality', () => {

        cy.get('.border-red-500').click()

        cy.fixture('master-item-data.json').then((data) => {

            const specificItem = data[2];

                cy.get('.MuiSelect-select.MuiTablePagination-select').click()

                cy.get('ul[role="listbox"] li').contains('100').click()

                cy.wait(2000);

                cy.contains('tbody > tr', specificItem.item).within(() => {

                    cy.get('[data-icon="edit"][aria-hidden="true"]').click()

                })

                cy.wait(2000)

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

                cy.get('#itmdsc').clear().type(specificItem.editItem)

                cy.get('#itmtyp').select(specificItem.editItemType)

                cy.get('#itmclacde').realClick()

                cy.get('#itmclacde').select(specificItem.editItemClass)

                cy.get('#itemsubclasscde').realClick()

                cy.get('#itemsubclasscde').select(specificItem.editItemSubclass)

                cy.get('#untmea').clear().type(specificItem.editUnitMeasure)

                cy.get('#untcst').clear().type(specificItem.editUnitCost)

                cy.get('#barcde').clear().type(specificItem.editBarcode)

                cy.get('#untprc').clear().type('{rightarrow}{rightarrow}').type(specificItem.editSellingPrice)

                cy.get('#itmpaxcount').clear().type(specificItem.editGoodXPerson)

                cy.get('#taxcde').select(specificItem.editTaxCode)

                for (const key in data) {

                    if (data[key].editAddOn === true) {

                        cy.get('#isaddon').click()

                    } else {

                        cy.get('#isaddon').should('not.be.checked')
                    }

                    if (data[key].editInactive === true) {

                        cy.get('#inactive').click()

                    } else {

                        cy.get('#inactive').should('not.be.checked')
                    }

                    if (data[key].editComboMeal === true) {

                        cy.get('#chkcombo').click()

                        // cy.get('#react-select-24-input').select()

                        // cy.get('#react-select-25-input').select()

                        // cy.get('.ant-tabs-tab-active').click()

                        // cy.get('#selectedItemDefault > .select__control > .select__value-container').realClick()

                        // cy.get('#selectedItemDefault > .select__control > .select__value-container').select()



                    } else {

                        cy.get('#chkcombo').should('not.be.checked')
                    }
                }

                cy.get('.border-blue-500').click()

                cy.wait(2000)

                cy.checkLabelCaption('.Toastify__toast-body', '96.1', 'Upon Clicking the "Save" button:', 'Successfully updated.', assertionResults, failureMessages)

                cy.checkElementInvisibility('.shadow-lg', '96.2.1', 'Upon Clicking the "Save" button:', 'The "Edit Item" modal window still visible', assertionResults, failureMessages)

                cy.get('.MuiTableBody-root').contains(specificItem.editItem).should('exist')

                cy.wait(4000)
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
                    
                    cy.checkLabelCaption('.h-\\[500px\\] > h1', '26.3', 'Upon clicking the "Delete" button on pager UI:', 'Do you want to delete: ' + data[key].item + ' ?', assertionResults, failureMessages)

                    cy.validateElements('delete-confirm-el.json', '97.3', 'Upon clicking the "Upon clicking the Delete" button on pager U/I:', assertionResults, failureMessages)

                    cy.get('.border-blue-500').click()

                    cy.wait(3000)

                    cy.checkElementInvisibility('.shadow-lg', '97.4.1', 'Upon Clicking the "Cancel" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                    cy.wait(3000)

                    cy.contains('tbody > tr', data[key].item).within(() => {

                        cy.get('[data-icon="delete"][aria-hidden="true"]').click()

                    })

                    cy.get('.border-red-500').click()

                    cy.wait(2000)

                    cy.checkLabelCaption('.Toastify__toast-body', '97.5.1', 'Upon Clicking the "Yes" button in Delete Confirmation modal:', 'Successfully deleted.', assertionResults, failureMessages) 

                    cy.checkElementInvisibility('.shadow-lg', '97.5.2 ', 'Upon Clicking the "Confirm" button:', 'The "Delete Confirmation" modal window still visible.', assertionResults, failureMessages)

                }
            }
        })

        cy.checkForFailure(assertionResults, failureMessages)
    })


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
    })
})
