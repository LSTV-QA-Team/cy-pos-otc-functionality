let assertionResults = [];
let failureMessages = [];
describe('Select MEMC', () => {

    before(() => {
        cy.execute('npm run sheet-converter master-item-data')
    })

    beforeEach(() => {

        assertionResults = [];
        failureMessages = [];

        cy.login('lstv', 'lstventures')

    })

    it('Select MEMC', () => {

        cy.navigateToModule('Master File', 'Items')

        cy.url({timeout: 10000}).should('contain', 'items/?menfield=masterfile_items')

        cy.fixture('master-item-data.json').then((data) => {

            for (const key in data) {

                if (data[key].onlyMEMC === true) {

                    cy.wait(2000)

                    cy.get('[data-testid="SearchIcon"]').click()

                    cy.get('input[placeholder="Search Item Description"]')
                      .clear()
                      .type(data[key].item)

                    cy.wait(2000)
    
                    cy.get('.MuiTableBody-root').contains(data[key].item).should('exist')

                    cy.contains('tbody > tr', data[key].item).within(() => {

                        cy.get('[data-icon="edit"][aria-hidden="true"]').click()
    
                    })

                    cy.wait(2000)

                    cy.get('#memc').select(data[key].memc)

                    cy.get('.border-blue-500').click()

                }
            }
        })

        cy.checkForFailure(assertionResults, failureMessages)
    })
})