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
import "cypress-xpath";

const mysql = require('mysql');
const addContext = require('mochawesome/addContext');



Cypress.Commands.add('queryDatabase', (query) => {
  const connection = mysql.createConnection({
    host: Cypress.env('host'),
    user: Cypress.env('user'),
    password: Cypress.env('password'),
    database: Cypress.env('database')
  });
  
  return new Promise ((resolve, reject) =>{
    connection.connect((error) => {
      connection.end();
      if (error) {
        reject(error);
        return
      } 

      connection.query(query, (error, results, fields) => {
        connection.end();
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      })
    })
  })
});

Cypress.Commands.add('login', (userCode, userPassword) => {
  
    cy.visit(Cypress.config('baseUrl'), 5000)
    cy.get('span[role="img"][aria-label="close"][tabindex="-1"].anticon.anticon-close').click();
    cy.wait(4000);
    cy.get('#usrcde').should('be.enabled')
    cy.get('#usrcde').clear();
    cy.get('#usrcde').realType('lstv');
    cy.get('#usrpwd').should('be.enabled')
    cy.get('#usrpwd').clear();
    cy.get('#usrpwd').realType('lstventures');
    cy.get('.sc-guDLey').should('be.enabled')
    cy.get('button.sc-guDLey.decbXQ[form="login"]').click();
    cy.wait(4000)
    cy.url({timeout: 10000}).should('contain', '/home')
    cy.get('.text-\\[2rem\\]').should('have.text', 'Welcome, lstv!');
    cy.wait(4000);
  })

  Cypress.Commands.add('navigateToModule', (menuSelector, submenuSelector) => {
    cy.contains(menuSelector).click();
    cy.wait(2000); 
    cy.contains(submenuSelector).click();
    cy.wait(2000); 
  });


  Cypress.Commands.add('addTestContext', (context) => {
    addContext({ test: cy.state('test') }, context);
  });
  