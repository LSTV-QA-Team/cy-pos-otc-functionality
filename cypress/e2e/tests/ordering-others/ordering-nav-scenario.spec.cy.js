describe('Ordering', () => {

    beforeEach(() => {

        cy.login('lstv', 'lstventures')
    })

    it('Navigating to Ordering Scenario', () => {

        cy.contains('Ordering').click()

        cy.wait(2000)

        cy.get('body').then(($body) => {

            if ($body.find('.Toastify__toast-body').is(':visible')) {
            
                cy.contains('Cashiering').click()

                cy.contains('Cash Fund').click()

                // click number 1
                cy.get('.my-4 > :nth-child(1) > :nth-child(1) > .font-montserrat').click()

                for (let i = 0; i < 3; i++) {

                    // click number 0
                    cy.get(':nth-child(4) > :nth-child(2) > .font-montserrat').click()

                }

                cy.get('.flex-col > .text-right').should('have.text', '₱1,000.00')

                //click save 
                cy.get('.border-green-500').click()

                // back
                cy.get('.ps-10 > .flex').click()

                cy.get('.justify-between > .font-montserrat').should('have.text', 'Welcome, lstv!')

                cy.wait(4000)

                cy.contains('Ordering').click()

                cy.get('body').then(($body) => {

                    // if "select pricelist" is visible will do this actions
                    if ($body.find('.px-8').is(':visible')) {
                        
                        cy.get('.px-8').should('have.text', 'Select Pricelist')

                        cy.get('#postypcde').select('Dine-In')

                        cy.get('#warcde').select('Jollibee 3')

                        cy.get('.border-green-500').click()

                    } else {
                        
                        cy.url({timeout: 10000}).should('contain', '/ordering')

                    }

                })
                
            } else if ($body.find('.px-8').is(':visible')) {

                cy.get('.px-8').should('have.text', 'Select Pricelist')

                cy.get('#postypcde').select('Dine-In')

                cy.get('#warcde').select('Jollibee 3')

                cy.get('.border-green-500').click()

                // just to assert if successfully navigated to ordering module
                cy.get('.bg-black > .font-extrabold > :nth-child(1)').should('have.text', 'Grand Total')


            } else {

                cy.url({timeout: 10000}).should('contain', '/ordering')

            }


        })
    })
})