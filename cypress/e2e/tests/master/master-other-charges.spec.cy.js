let assertionResults = [];
let failureMessages = [];

describe('Other Charges', () => {

    // before(() => {

    //     // Clear the pricelistfile table before tests
    //     cy.task("queryDb","TRUNCATE TABLE pricelistfile")

    //     // Verify that the table is empty
    //     cy.task("queryDb", "SELECT * FROM pricelistfile").then((records) => {

    //         expect(records.length).to.be.equal(0)

    //     })

    //     // Delete all file in downloads for check print functinality test case
    //     cy.task('clearDownloads')

    //     // Excel file to JSON Converter
    //     cy.wait(4000)
    //     cy.execute('npm run sheet-converter master-pricelist-data')
    //     cy.wait(4000)

    // })
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login('lstv', 'lstventures')

    })

    // after(() => {

    //     // delete unecessary inputed data in the table 'pricelistfile'

    //     cy.fixture('data-to-delete.json').then((data) => {

    //         // Loop through each character and delete corresponding rows from the 'pricelistfile' table
    //         data.forEach((item) => {

    //             const specialChar = item.dataToDelete;
    //             const deleteQuery = `DELETE FROM pricelistfile WHERE prcdsc = '${specialChar}'`;
                
    //             cy.task('queryDb', deleteQuery).then(() => {
                    
    //                 cy.log(`Deleted data with description: ${specialChar}`); // Log successful deletions

    //             })
    //         })
    
    //         // Ensure the table is clear of specified data
    //         cy.task('queryDb', 'SELECT * FROM pricelistfile').then((records) => {

    //             const remainingData = records.map((record) => record.description)
    //             const deletedChars = data.map((item) => item.dataToDelete)

                
    //             // Ensure no deleted special characters are still in the table
    //             deletedChars.forEach((char) => {

    //                 expect(remainingData).to.not.include(char)

    //             })
    
    //             cy.log('Specified data Successfully deleted.')// Log success

    //         })
    //     })
    // })
    it('Check Other Charges Page', () => {   

        cy.navigateToModule('Master File', 'Other Charges')

        cy.url({timeout: 10000}).should('contain', '/masterfile/otherCharges/?menfield=masterfile_other_charges')
           
        cy.checkElementVisibility('.h-screen ', '1.2', 'Upon Navigating to Other Charges:', ' "Add Other Charges" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        // cy.checkHeaderTitle(':nth-child(1) > .text-\\[2rem\\]','1.2.1', 'Upon Navigating to Other Charges pager U/I', 'Other Charges', assertionResults, failureMessages)

        cy.wait(2000)

        // cy.checkTableColumnTitle(['Actions', 'Other Charges', 'Order Type'], '1.2.2', 'Upon Navigating to Other Charges pager U/I', assertionResults, failureMessages)

        // 1.2.3 Check correct button(s) caption.
        // Not necessary since buttons in pager U/I does not have captions.

        // 1.2.4 Check correct objects position.
        // Add this when needed.  

        // cy.validateElements('module-selector-assert.json', '1.2.5', 'Upon Navigating to Other Charges pager U/I', assertionResults, failureMessages)

        // Consolidate the results of various assertions across multiple custom commands into a single summary.
        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Update Functionality', () => {

        cy.fixture('master-othercharges-data.json').then((data) => {

            cy.get('.sc-eDLKkx > .anticon > svg').click()

            cy.wait(4000) 
            
            cy.checkElementVisibility('.shadow-lg', '2.1', 'Upon Clicking the "Save" button:', '"Add Other Charges" modal window was not visible or active.', assertionResults, failureMessages)

            cy.checkHeaderTitle('.px-8', '2.1.1', 'Upon clicking the "Add" button on pager UI', 'Add Other Charges', assertionResults, failureMessages)

            cy.checkLabelCaption('.mb-2', '2.1.2', 'Upon clicking the "Add" button on pager U/I', 'Other Charges *', assertionResults, failureMessages)
            
            cy.get('#prcdsc').invoke('outerWidth').then((width) => {

                expect(width).to.equal(420)
                   
            })

            // 2.1.5 Check correct all object position

            // cy.validateElements('pricelist-add-el.json', '2.1.4 & 2.1.6', 'Upon clicking the "Add" button on pager U/I:', assertionResults, failureMessages)

            cy.get('svg[data-icon="close"][viewBox="64 64 896 896"]') .click()

            for (const key in data){

                cy.get('.sc-eDLKkx > .anticon > svg').click()
                
                cy.get('#prcdsc')
                  .type(data[key].pricelist)
                  .then(($input) => {

                    if ($input.val() === "null") {
                        
                        cy.get('#prcdsc').clear()

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.text-sm', '10.1', 'Upon clicking the "Save" button:', 'Other Charges * is required', assertionResults, failureMessages)
                        
                        cy.get('#prcdsc').type('Jollibee 1')

                        cy.get('#postypcde').select('Dine-In')

                        cy.get('.border-blue-500').click()

                        cy.wait(2000)

                        cy.checkLabelCaption('.Toastify__toast-body', '12.1', 'Upon Clicking the "Save" button:', 'Duplicate entry! Kindly check your inputs', assertionResults, failureMessages) 

                        cy.get('.px-8 > .flex > .anticon > svg').click()

                    } 
                    
                    else if ($input.val() === "Jollibee 2") {

                        cy.get('#postypcde').select(data[key].ordertype)

                        cy.get('.border-red-500').click()

                        cy.checkLabelCaption('.h-auto', '5.1', 'Upon Clicking the "Cancel" button:', 'Are you sure you want to cancel?', assertionResults, failureMessages)

                        cy.contains('button[class*="border-red-500"]', 'No').click()

                        cy.wait(3000)

                        cy.checkElementVisibility('.shadow-lg', '5.2.1', 'Upon Clicking the "No" button in "Cancel" modal:', 'The "Add Other Charges" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.border-red-500').click()

                        cy.contains('button[class*="border-blue-500"]', 'Yes').click()

                        cy.wait(3000)

                        cy.checkElementInvisibility('.shadow-lg', '5.3.1', 'Upon Clicking the "Yes" button in "Cancel" modal:', 'The "Add Other Charges" modal window was visible or active.', assertionResults, failureMessages)

                        cy.checkElementVisibility('.h-screen', '5.3.2', 'Upon clicking the "Yes" button, should back in Other Charges Pager U/I', assertionResults, failureMessages)

                    }

                    else if ($input.val() === "% & ( ) / - .") {

                        cy.get('#postypcde').select(data[key].ordertype)

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '8.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.checkElementInvisibility('.shadow-lg', '8.2.1', 'Upon clicking the "Save" button:', 'The "Add Other Charges" modal window was not visible or active.', assertionResults, failureMessages)

                        // 11.2.2 Check if the "Description" textbox object is cleared or blank.

                    }

                    else if ($input.val() === "Jollibee Filipino Sweet Style Spaghetti Langhap Sarap") {

                        cy.wrap($input).should('have.value', data[key].pricelist)

                        cy.get('#postypcde').select(data[key].ordertype)

                        cy.checkElementVisibility('.text-sm', '16.1', 'Upon encoding data:', 'The validation message "Please limit your input to 50 characters." was not visible.', assertionResults, failureMessages)

                        cy.get('.border-blue-500').click()

                    }

                    else if ($input.val() === "© ™ ® à á â ñ ä ¢ £ ¥ € ! @ # $ ^ * _ + = < > ? ` ~ \" | \\ [ ] ; :") {

                        cy.get('.border-blue-500').click()

                        cy.get('#postypcde').select(data[key].ordertype)

                        cy.checkLabelCaption('.Toastify__toast-body', '14.1', 'Upon Clicking the "Save" button:', '"Please use only the following approved special characters: % & ( ) / - ."', assertionResults, failureMessages) 

                        cy.checkElementInvisibility('.shadow-lg', '14.2.1', 'Upon clicking the "Save" button:', 'The "Add Other Charges" modal window was not visible or active.', assertionResults, failureMessages)

                        // Check if the "Description" textbox object is cleared or blank. 

                    }

                    else {

                        cy.wrap($input).should('have.value', data[key].pricelist)

                        cy.get('#postypcde').select(data[key].ordertype)

                        cy.get('.border-blue-500').click()

                        cy.checkLabelCaption('.Toastify__toast-body', '4.1', 'Upon Clicking the "Save" button:', 'Successfully saved.', assertionResults, failureMessages) 

                        cy.wait(3000)
                        
                        cy.checkElementVisibility('.shadow-lg', '4.2.1', 'Upon Clicking the "Save" button:', 'The "Add Other Charges" modal window was not visible or active.', assertionResults, failureMessages)

                        cy.get('.MuiTableBody-root').contains(data[key].pricelist).should('exist')
                    }
                }) 
            }
        })

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
        
    })
})