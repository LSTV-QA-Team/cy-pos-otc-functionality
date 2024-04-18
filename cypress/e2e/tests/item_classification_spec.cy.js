describe('Item Classification', () => {

    before(() => {
        // Clear the itemclassfile table before tests
        cy.task("queryDb","TRUNCATE TABLE itemclassfile");

        // Verify that the table is empty
        cy.task("queryDb", "SELECT * FROM itemclassfile").then((records) => {
            expect(records.length).to.be.equal(0);
        });
    });
    
    beforeEach(() => {
        cy.login();
        cy.navigateToModule('Master File', 'Item Classifications'); 
    });

    it.skip('Check should be in Item Classification module', () => {
        cy.url({timeout: 10000}).should('contain', '/itemClassifications/?menfield=masterfile_itemclass');

        cy.get(':nth-child(1) > .text-\\[2rem\\]').should('have.text', 'Item Classifications');

        cy.get('div.Mui-TableHeadCell-Content-Wrapper[title="Description"]').should('have.text', 'Item Classifications');
    });

    it('Check user can add valid data', () => {
        cy.fixture('item_class.json').then((data) => {
            for (const key in data){
                cy.get('.sc-eDLKkx > .anticon > svg').should('be.visible');

                cy.get('.sc-eDLKkx > .anticon > svg').click();

                cy.get('.px-8').should('be.visible');

                cy.get('.px-8').should('have.text', 'Add new item classification');

                cy.get('.mb-2').should('have.text', 'Item Classification Name *');

                cy.get('#itmcladsc').should('be.enabled');

                cy.get('#itmcladsc').clear();

                cy.get('#itmcladsc').type(data[key].itemClass);

                cy.get('.border-blue-500').should('be.enabled');

                cy.get('.border-blue-500').click();

                cy.get('.Toastify__toast-body').should('be.visible').contains('Successfully uploaded'); 

                cy.get('.MuiTableBody-root').contains('Beverages').should('exist');
            }
        });
    });

    it('Check special characters are allowed', () => {
        cy.fixture('allowed_special_char.json').then((data) => {
            for (const key in data){
                cy.get('.sc-eDLKkx > .anticon > svg').should('be.visible');

                cy.get('.sc-eDLKkx > .anticon > svg').click();

                cy.get('.px-8').should('be.visible');

                cy.get('.px-8').should('have.text', 'Add new item classification');

                cy.get('.mb-2').should('have.text', 'Item Classification Name *');

                cy.get('#itmcladsc').should('be.enabled');

                cy.get('#itmcladsc').clear();

                cy.get('#itmcladsc').type(data[key].allowSpecialChar);

                cy.get('.border-blue-500').should('be.enabled');

                cy.get('.border-blue-500').click();

                cy.get('.Toastify__toast-body').should('be.visible').contains('Successfully uploaded'); 

                cy.get('.MuiTableBody-root').contains(data[key].allowSpecialChar).should('exist');
            }
        });
    });

    it('Check adding an empty data', () => {
        
    });
});

