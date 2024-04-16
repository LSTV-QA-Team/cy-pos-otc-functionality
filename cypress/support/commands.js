// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "cypress-real-events";

Cypress.Commands.add('login', (userCode, userPassword) => {
  
    cy.visit(Cypress.config('baseUrl'), 10000)
    cy.get('span[role="img"][aria-label="close"][tabindex="-1"].anticon.anticon-close').click();
    cy.get('#usrcde').realType(userCode)
    cy.get('#usrpwd').realType(userPassword)
    // cy.get().click()
    // cy.url({timeout: 10000}).should('contain', '/home')
  })