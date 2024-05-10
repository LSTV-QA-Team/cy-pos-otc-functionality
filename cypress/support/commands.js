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
import "cypress-mochawesome-reporter/register";

const mysql = require('mysql');
const addContext = require('mochawesome/addContext');
const failedAssertions = new Set();


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
  const test = cy.state('test');
  if (test) {
    addContext({ test }, context);
  } else {
    throw new Error("Test context is unavailable.");
  }
});

Cypress.Commands.add('checkHeaderTitle', (selector, expectedText, visibility, failureMessages) => {
  cy.get(selector).then($element => {
    const actualText = $element.text().trim(); // Get the actual text from the element
    const containsExpectedText = $element.text().includes(expectedText);

    if (containsExpectedText) {

      cy.wrap($element).should('be.visible');
      cy.log('Assertion Passed');
      visibility.push({ data: 'passed' });

    } else {
      
      const failureMessage = `The title header should be "${expectedText}" instead of "${actualText}"`;

      if (!failedAssertions.has(failureMessage)) {
        cy.log('Assertion Failed');
        failedAssertions.add(failureMessage);
        failureMessages.push(failureMessage); // Record the failure message
        cy.screenshot(`failure-${selector.replace(/\W/g, '-')}`, { capture: 'runner' });
        
      } 
      
      else {

        cy.log('Skipping screenshot, failure already captured.');

      }
      
      visibility.push({ data: 'failed' });
    }

  }).then(() => {

    cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility));
    
  });
});

Cypress.Commands.add('checkLabel', (selector, expectedText, visibility, failureMessages) => {
  cy.get(selector).then($element => {
    const actualText = $element.text().trim(); // Get the actual text from the element
    const containsExpectedText = $element.text().includes(expectedText);

    if (containsExpectedText) {

      cy.wrap($element).should('be.visible');
      cy.log('Assertion Passed');
      visibility.push({ data: 'passed' });

    } else {
      
      const failureMessage = `Expected text field label should be "${expectedText}" but the actual was "${actualText}" in selector "${selector}"`;

      if (!failedAssertions.has(failureMessage)) {
        cy.log('Assertion Failed');
        failedAssertions.add(failureMessage);
        failureMessages.push(failureMessage); // Record the failure message
        cy.screenshot(`failure-${selector.replace(/\W/g, '-')}`, { capture: 'runner' });
        
      } 
      
      else {

        cy.log('Skipping screenshot, failure already captured.');

      }
      
      visibility.push({ data: 'failed' });
    }

  }).then(() => {

    cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility));
    
  });
});




Cypress.Commands.add('checkForFailure', (assertions, failureMessages = []) => {
  cy.fixture('message.json').then((data) => {
    // Check if there's a failure in either the assertions or the JSON data
    const hasFailedAssertions = assertions.some(entry => entry.data === 'failed');
    const hasFailedJson = data.some(entry => entry.data === 'failed');

    // Get unique failure messages
    const uniqueFailureMessages = Array.from(new Set(failureMessages));

    if (hasFailedAssertions) {
      // Check if there are any corresponding failures in the JSON data
      expect(hasFailedJson).to.be.true;

      // Log all unique failure messages
      uniqueFailureMessages.forEach(message => {
        cy.log(`Failure: ${message}`);
      });

      // Ensure there are no failure messages; if there are, the test should fail
      if (uniqueFailureMessages.length > 0) {
        throw new Error(`Test failed with ${uniqueFailureMessages.length} unique failure(s): ${uniqueFailureMessages.join(', ')}`);
      }
    } else {
      cy.log('No failures detected.');
    }
  });
});


Cypress.Commands.add('checkValidation', (selector, expectedText, visibility, failureMessages) => {
  cy.get(selector).then($element => {
    const actualText = $element.text().trim(); // Get the actual text from the element
    const containsExpectedText = $element.text().includes(expectedText);

    if (containsExpectedText) {

      cy.wrap($element).should('be.visible');
      cy.log('Assertion Passed');
      visibility.push({ data: 'passed' });


    } else {

      const failureMessage = `Upon clicking of "Add" button on pager: Expected validation should be "${expectedText}" but the actual was "${actualText}" in selector "${selector}"`;

      if (!failedAssertions.has(failureMessage)) {
        cy.log('Assertion Failed');
        failedAssertions.add(failureMessage);
        failureMessages.push(failureMessage); // Record the failure message
        cy.screenshot(`failure-${selector.replace(/\W/g, '-')}`, { capture: 'runner' });

      } else {

        cy.log('Skipping screenshot, failure already captured.');

      }
      
      visibility.push({ data: 'failed' });
    }
  }).then(() => {
    cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility));
  });
});


