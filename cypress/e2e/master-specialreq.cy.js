let visibility = [];
let failureMessages = [];

describe('Special Request', () => {


    before(() => {
        // Clear the itemclassfile table before tests
        cy.task("queryDb","TRUNCATE TABLE modifierfile");

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM modifierfile").then((records) => {
            expect(records.length).to.be.equal(0);
        });

        // Delete all file in downloads for check print functinality test case
        cy.task('clearDownloads');
    });
    
    beforeEach(() => {

        cy.wrap(false).as('hasFailure');

        // reset visibility for each test case
        visibility = [];
        failureMessages = [];

        // Login with valid credentials
        cy.login();

        // Navigate to page
        cy.navigateToModule('Master File', 'Special Request');
    })

    it('Verify if the user is on the Special Request Page', () => { 

        cy.url({timeout: 10000})
            .should('contain', 'specialRequests/?menfield=masterfile_special_requests');

        // cy.get(':nth-child(1) > .text-\[2rem\]')
        //     .should('have.text', 'Special Requests');

        cy.get('td > .MuiTypography-root') 
            .should('be.visible');

        cy.get('.css-68xo7g-MuiTableCell-root')
            .should('contain', 'Special Request'); 

        })

    it.only('Verify if user can add valid data', () => {

        cy.fixture('specialreq.json').then ((data) => {

            for (const key in data){

                cy.wait(2000)

                cy.get('.sc-eDLKkx > .anticon > svg')
                .should('not.be.disabled')
                .click();


                cy.get('#modcde').type(data[key].SpecialRequest)
                cy.get('.select__indicator').click().select(data[key].SpecialRequest)

                cy.get('.border-blue-500')
                .should('be.enabled')
                .click();

            }

        })



    }) 





  }) 