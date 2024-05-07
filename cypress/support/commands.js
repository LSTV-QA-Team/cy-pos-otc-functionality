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
  

// // Custom command that attempts to verify text, but logs error without stopping the test
// Cypress.Commands.add('checkLabel', (selector, expectedText, visibility) => {
//   cy.get(selector).then($element => {
//     if ($element.text().includes(expectedText)) {
      
//       cy.wrap($element).should('be.visible');
//       cy.log('Visibility Passed');
//       visibility.push({ data: "passed" });

//     } else {

//       cy.log('Visibility Failed');
//       cy.log(`Expected text "${expectedText}" not found in ${selector}`);
//       visibility.push({ data: "failed" });

//     }
//   }).then(() => {

//     // / Write the visibility state to a JSON file
//     cy.writeFile('cypress/fixtures/message.json', JSON.stringify(visibility));
//     })
//   })

Cypress.Commands.add('checkLabel', (selector, expectedText, visibility, failureMessages) => {
  cy.get(selector).then($element => {
    const containsExpectedText = $element.text().includes(expectedText);

    if (containsExpectedText) {

      cy.wrap($element).should('be.visible');
      cy.log('Assertion Passed')
      visibility.push({ data: "passed" });

    } 

    else {

      cy.log('Assertion Failed')
      visibility.push({ data: "failed" });
      const failureMessage = `Expected text "${expectedText}" not found in selector ${selector}`;
      failureMessages.push(failureMessage); // Record the failure message

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




// In cypress/support/commands.js

// Custom command for safe assertions
// Cypress.Commands.add('safeAssert', (selector, assertionFn, errorMessage) => {
//   cy.get(selector).then(($element) => {
//     try {
//       assertionFn($element);
//     } catch (e) {
//       cy.log(`Safe assertion failed: ${errorMessage || 'No message provided'}`);
//       // Optionally, you could record the error, or add additional logging here
//     }
//   });
// });

// In cypress/support/commands.js
// Cypress.Commands.add('safeAssert', (selector, assertionFn, errorMessage) => {
//   cy.get(selector).then(($element) => {
//     try {
//       assertionFn($element);
//     } catch (e) {
//       // Take a screenshot on failure
//       const screenshotName = `safe-assertion-failed-${Date.now()}`; 
//       cy.screenshot(screenshotName, {
//         capture: 'runner', // This ensures the whole test runner, including logs and errors, is captured
//       });
  
//       cy.log(`Safe assertion failed: ${errorMessage || 'No message provided'}`);
//       // Set the global failure flag
//       cy.get('@hasFailure').then((hasFailure) => {
//         cy.wrap(true).as('hasFailure');
//       });
//     }
//   });
// });


