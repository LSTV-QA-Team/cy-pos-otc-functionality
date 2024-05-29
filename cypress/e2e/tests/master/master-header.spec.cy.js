let assertionResults = [];
let failureMessages = [];

describe('Receipt Header Set Up', () => {


    before(() => {

        // Excel file to JSON Converter
        cy.wait(4000)
        cy.execute('npm run sheet-converter master-header-data')
        cy.execute('npm run sheet-converter header-selector-assert')
        cy.wait(4000)

    })
    
    beforeEach(() => {

        // reset for each test case
        assertionResults = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login('lstv', 'lstventures')


    })

    it('Check Receipt Header Set Up Page', () => {   

        cy.navigateToModule('Master File', 'Header')

        cy.url({timeout: 10000})
            .should('contain', '/masterfile/header/?menfield=masterfile_header')

        cy.checkElementVisibility('.shadow-lg', '1.2', 'Upon Navigating to "Receipt Header Set Up":', '"Receipt Header Set Up" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(2000)

        cy.checkHeaderTitle('.px-8','1.2.1', 'Upon Navigating to "Receipt Header Set Up" pager U/I', 'Receipt Header Set Up', assertionResults, failureMessages)

        cy.wait(2000)

        // Check correct objects position.

        cy.validateElements('header-selector-assert.json', '1.2.2 & 1.2.3 & 1.2.5', 'Upon Navigating to Receipt Header Set Up pager U/I', assertionResults, failureMessages)

        cy.checkForFailure(assertionResults, failureMessages)
    });

    it('Valid Update Functionality', () => {

        cy.fixture('master-Header-data.json').then((data) => {
            for (const key in data){
                if (data[key].forValid === true) {

                    cy.wait(4000)

                    cy.get('#business1')
                        .type(data[key].bus1)


                    cy.get('#business2').clear()
                        .type(data[key].bus2)


                    cy.get('#business3').clear()
                        .type(data[key].bus3)


                    cy.get('#taxpayer').clear()
                        .type(data[key].taxPayer)
                    

                    cy.get('#tin').clear()
                        .type(data[key].vat)


                    cy.get('#chknonvat')
                        .select(data[key].nonVAT)

                    cy.get('#address1').clear()
                        .type(data[key].add1)

                    
                    cy.get('#address2').clear()
                        .type(data[key].add2)
                    
                    cy.get('#address3').clear()
                        .type(data[key].add3)


                    cy.get('#serialno').clear()
                        .type(data[key].serialNo)


                    cy.get('#machineno').clear()
                        .type(data[key].machineNo)


                    cy.get('#brhcde').clear()
                        .type(data[key].branchCode)
                        
                    // cy.get('#postrmno').clear()
                    //     .type(data[key].terminalNo)
                    

                    cy.get('.border-blue-500').click()

                    cy.checkLabelCaption('.Toastify__toast-body', '15.1', 'Upon Clicking the "Update" button:', 'Successfully updated!', assertionResults, failureMessages)

                    // 17.1 Check all encoded data should reflect to the receipt (Validate on Preview) 

                    cy.contains('Header').click()
                } 
                
            } 
        })
        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Check Max Length of Input Characters', () => {
        cy.fixture('master-header-data.json').then((data) => {
            for (const key in data){
                if (data[key].forInvalid === true) {

                    cy.wait(4000)

                    cy.get('#business1').clear()
                        .type(data[key].bus1)

                    cy.checkInputMaxLength('#business1', 50, '20.1', 'Upon Encoding in "Business Name 1" Textbox:', assertionResults, failureMessages)

                    cy.get('#business2').clear()
                        .type(data[key].bus2)

                    cy.checkInputMaxLength('#business2', 50, '21.1', 'Upon Encoding in "Business Name 2" Textbox:', assertionResults, failureMessages)

                    cy.get('#taxpayer').clear()
                        .type(data[key].taxPayer)
                    
                    cy.checkInputMaxLength('#taxpayer', 12, '22.1', 'Upon Encoding in "Tax Payer registered in BIR" Textbox:', assertionResults, failureMessages)

                    cy.get('#tin').clear()
                        .type(data[key].vat)

                    cy.checkInputMaxLength('#tin', 50, '23.1', 'Upon Encoding in "VAT" Textbox:', assertionResults, failureMessages)

                    cy.get('#address1').clear()
                        .type(data[key].add1)

                    cy.checkInputMaxLength('#address1', 50, '24.1', 'Upon Encoding in "Address 1." Textbox:', assertionResults, failureMessages)
                    
                    cy.get('#address2').clear()
                        .type(data[key].add2)

                    cy.checkInputMaxLength('#address2', 5, '25.1', 'Upon Encoding in "Address 2" Textbox:', assertionResults, failureMessages)

                    cy.get('#serialno').clear()
                        .type(data[key].serialNo)

                    cy.checkInputMaxLength('#serialno', 50, '26.1', 'Upon Encoding in "Serial No." Textbox:', assertionResults, failureMessages)

                    cy.get('#machineno').clear()
                        .type(data[key].machineNo)

                    cy.checkInputMaxLength('#machineno', 50, '27.1', 'Upon Encoding in "Machine Number" Textbox:', assertionResults, failureMessages)

                    cy.get('#brhcde').clear()
                        .type(data[key].branchCode)

                    cy.checkInputMaxLength('#brhcde', 50, '28', 'Upon Encoding in "Branch COde" Textbox:', assertionResults, failureMessages)

                    // cy.get('#postrmno').clear()
                    //     .type(data[key].terminalNo)

                    // cy.checkInputMaxLength('#postrmno', 50, '34.1', 'Upon Encoding in "Terminal No. 4" Textbox:', assertionResults, failureMessages)
                          
                    
                    cy.get('.border-blue-500').click()
                }
                
            } 
        })
        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    })

    it('Check Required Field Functionality', () => {

        cy.contains('Header').click()

        cy.wait(4000)

        cy.get('#business1').clear()

        cy.get('#business2').clear()

        cy.get('#business3').clear()

        cy.get('#taxpayer').clear()

        cy.get('#tin').clear()

        cy.get('#chknonvat').realClick()

        cy.get('#address1').clear()
        
        cy.get('#address2').clear()
        
        cy.get('#address3').clear()

        cy.get('#serialno').clear()

        cy.get('#machineno').clear()

        cy.get('#brhcde').clear()

        // cy.get('#postrmno').clear()

        cy.get('.border-blue-500').click()

        cy.checkLabelCaption('.Toastify__toast-body', '36.1', 'Upon Clicking the "Update" button:', 'Please input valid data.', assertionResults, failureMessages)

        cy.wait(4000)

        // cy.checkElementVisibility('.shadow-lg', '19.1', 'Upon Clicking the "Update" button:', '"Receipt Header Set Up" modal window was not visible or active.', assertionResults, failureMessages)

        // cy.checkLabelCaption('#Header-form', '3.1', 'Upon Clicking the "Update" button:', '"Supplier Name * is required" was not visible', assertionResults, failureMessages)

        // cy.checkLabelCaption('#Header-form', '3.1', 'Upon Clicking the "Update" button:', '"Supplier Address * is required" was not visible', assertionResults, failureMessages)

        // cy.checkLabelCaption('#Header-form', '3.1', 'Upon Clicking the "Update" button:', '"Supplier VAT Registered TIN * is required" was not visible', assertionResults, failureMessages)

        // cy.checkLabelCaption('#Header-form', '3.1', 'Upon Clicking the "Update" button:', '"Supplier Non-VAT registered TIN * is required', assertionResults, failureMessages)

        // cy.checkLabelCaption('#Header-form', '3.1', 'Upon Clicking the "Update" button:', '"Accredited No. * is required"', assertionResults, failureMessages)

        // cy.checkLabelCaption('#Header-form', '3.1', 'Upon Clicking the "Update" button:', '"Permit No. * is required', assertionResults, failureMessages)

        // cy.checkLabelCaption('#Header-form', '3.1', 'Upon Clicking the "Update" button:', '"Accredited Data * is required" was not visible', assertionResults, failureMessages)

        // cy.checkLabelCaption('#Header-form', '3.1', 'Upon Clicking the "Update" button:', '"Date Issued * is required" was not visible', assertionResults, failureMessages)

        // cy.checkLabelCaption('#Header-form', '3.1', 'Upon Clicking the "Update" button:', '"Years Validity * is required" was not visible', assertionResults, failureMessages)

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)

    })

    it('Cancel Functionlity', () => {
        
        cy.contains('Header').click()

        cy.wait(4000)

        cy.checkElementVisibility('.shadow-lg', '37.1', 'Upon Clicking the "Header Option" in Master File Menu', '"Receipt Header Set Up" modal window was not visible or active.', assertionResults, failureMessages)

        cy.get('.border-red-500').click()

        cy.checkElementInvisibility('.shadow-lg', '38.1', 'Upon Clicking the "Cancel" button:', '"Receipt Header Set Up" modal window was still visible or active.', assertionResults, failureMessages)

        cy.checkElementVisibility('.h-full', '38.2', 'Upon Clicking the "Cancel" button:', '"Master File Menu" modal window was not visible or active.', assertionResults, failureMessages)

        cy.wait(4000)

        cy.checkForFailure(assertionResults, failureMessages)
    });
})