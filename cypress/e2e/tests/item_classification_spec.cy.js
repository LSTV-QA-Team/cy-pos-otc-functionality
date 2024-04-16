describe('Header', () => {

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
        cy.navigateToModule(':nth-child(1) > .sc-beySPh', '[href="#/pages/itemClassifications/?menfield=masterfile_itemclass"] > .font-montserrat'); //click menu and submenu
    });

    it('Check should be in Item Classification page', () => {
        cy.url({timeout: 10000}).should('contain', '/itemClassifications/?menfield=masterfile_itemclass');

        cy.get(':nth-child(1) > .text-\\[2rem\\]').should('be.visible');

        cy.get(':nth-child(1) > .text-\\[2rem\\]').should('have.text', 'Item Classifications');

        cy.get(':nth-child(2) > .sc-guDLey').should('be.visible');

        cy.get('[data-testid="SearchIcon"]').should('be.visible');

        cy.get('[data-testid="FilterListIcon"] > path').should('be.visible');

        cy.get('[data-testid="ViewColumnIcon"] > path').should('be.visible');

        cy.get('[data-testid="DensityMediumIcon"] > path').should('be.visible');

        cy.get('[data-testid="FullscreenIcon"]').should('be.visible');

        cy.get('.css-wiq0yp-MuiTableCell-root > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-Content-Labels > .Mui-TableHeadCell-Content-Wrapper').should('be.visible');

        cy.get('.css-za273f-MuiTableCell-root > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-Content-Labels > .Mui-TableHeadCell-Content-Wrapper').should('be.visible');

        cy.get('.css-za273f-MuiTableCell-root > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-Content-Labels > .Mui-TableHeadCell-Content-Wrapper').should('have.text', 'Description');

        cy.get('.w-\\[90\\%\\]').should('be.visible');

        cy.get('.h-screen').click();

        cy.get('.sc-eDLKkx > .anticon > svg').should('be.visible');

        cy.get('.sc-eDLKkx > .anticon > svg').click();

        cy.get('.me-2').should('be.visible');

        cy.get('.me-2').should('have.text', 'Add new item classification');

        cy.get('#itmcladsc').should('be.visible');

        cy.get('.mb-2').should('be.visible');

        cy.get('.mb-2').should('have.text', 'Item Classification Name *');

        cy.get('.border-red-500').should('be.visible');

        cy.get('.border-blue-500').should('be.visible');
    });

    it('Check a-z and A-Z characters are allowed', () => {
        cy.fixture('allowed_char.json').then((data) => {
            for (const key in data ) {
                cy.get('[d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"]').should('be.visible');

                cy.get('.sc-eDLKkx > .anticon > svg').click();

                cy.get('.shadow-lg').should('be.visible');

                cy.get('.me-2').should('be.visible');

                cy.get('.me-2').should('have.text', 'Add new item classification');

                cy.get('.mb-2').should('be.visible');

                cy.get('.mb-2').should('have.text', 'Item Classification Name *');

                cy.get('#itmcladsc').should('be.visible');

                cy.get('#itmcladsc').should('be.enabled');

                cy.get('#itmcladsc').click();

                cy.get('#itmcladsc').clear();

                cy.get('#itmcladsc').type(data[key].allowedChar);

                cy.get('.border-blue-500').should('be.enabled');

                cy.get('.border-blue-500').click();

                cy.contains(data[key].allowedChar).should('exist');
            }
        })
    });

    it('Check maximum character limit', () => {
        cy.get(':nth-child(1) > .text-\\[2rem\\]').should('be.visible');

        cy.get(':nth-child(1) > .text-\\[2rem\\]').should('have.text', 'Item Classifications');

        cy.get('[d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"]').click();

        cy.get('.px-8').should('be.visible');

        cy.get('.me-2').should('have.text', 'Add new item classification');

        cy.get('.mb-2').should('have.text', 'Item Classification Name *');

        cy.get('#itmcladsc').as('textField');

        cy.get('@textField').should('be.enabled');

        cy.get('@textField').clear();

        // Input text equal to the maximum characters
        const maxChars = 'a'.repeat(30);
        cy.get('@textField').type(maxChars);

        // Ensure the input field contains the maximum characters
        cy.get('@textField').should('have.value', maxChars)

        // Input additional characters beyond the maximum
        const beyondMaxChars = 'a'.repeat(40);
        cy.get('@textField').type(beyondMaxChars);

        cy.get('.border-blue-500').should('be.enabled');

        cy.get('.border-blue-500').click();

        // Validate 'Up to 30 character(s) only.'should be visible
        cy.contains('Up to 30 character(s) only.').should('exist');
    });

    it('Check numeric value are allowed', () => {
        cy.get('[d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"]').should('be.visible');

        cy.get('.sc-eDLKkx > .anticon > svg').click();

        cy.get('.shadow-lg').should('be.visible');

        cy.get('.me-2').should('be.visible');

        cy.get('.me-2').should('have.text', 'Add new item classification');

        cy.get('.mb-2').should('be.visible');

        cy.get('.mb-2').should('have.text', 'Item Classification Name *');

        cy.get('#itmcladsc').should('be.visible');

        cy.get('#itmcladsc').should('be.enabled');

        cy.get('#itmcladsc').click();

        cy.get('#itmcladsc').clear();

        cy.get('#itmcladsc').type('1234567890');

        cy.get('.border-blue-500').should('be.enabled');

        cy.get('.border-blue-500').click();

        cy.contains('1234567890').should('exist');
    });

    it('Check alphanumeric value should be allowed', () => {
        cy.get('[d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"]').should('be.visible');

        cy.get('.sc-eDLKkx > .anticon > svg').click();

        cy.get('.shadow-lg').should('be.visible');

        cy.get('.me-2').should('be.visible');

        cy.get('.me-2').should('have.text', 'Add new item classification');

        cy.get('.mb-2').should('be.visible');

        cy.get('.mb-2').should('have.text', 'Item Classification Name *');

        cy.get('#itmcladsc').should('be.visible');

        cy.get('#itmcladsc').should('be.enabled');

        cy.get('#itmcladsc').click();

        cy.get('#itmcladsc').clear();

        cy.get('#itmcladsc').type('abcd1234');

        cy.get('.border-blue-500').should('be.enabled');

        cy.get('.border-blue-500').click();

        cy.contains('abcd1234').should('exist');
    });
});

