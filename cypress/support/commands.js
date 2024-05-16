
import "cypress-real-events";
import "cypress-xpath";
import "cypress-mochawesome-reporter/register";

const mysql = require('mysql');
const addContext = require('mochawesome/addContext');
const failedAssertions = new Set();

const xlsx = require("xlsx");
const fs = require('fs');
const path = require('path');


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



Cypress.Commands.add('checkTableColumnTitle', (expectedColTitle, referenceNumber, errorContext, assertionResults = [], failureMessages = []) => {
  // Track failed assertions to avoid redundant errors
  const failedAssertions = new Set();

  cy.get('table.MuiTable-root thead tr').find('th.MuiTableCell-root').should('have.length', expectedColTitle.length).then($headers => {
    const errorMessages = [];
    const elementPromises = [];

    $headers.each((index, element) => {
      elementPromises.push(new Cypress.Promise((resolve) => {
        const headerText = Cypress.$(element).find('.Mui-TableHeadCell-Content-Wrapper').text();
        let assertionPassed = true;
        let customErrorMessage = '';

        if (headerText !== expectedColTitle[index]) {
          assertionPassed = false;
          customErrorMessage = `The column header should be "${expectedColTitle[index]}" instead of "${headerText}"`;
        }

        if (assertionPassed) {
          cy.wrap(element).should('contain.text', expectedColTitle[index]);
          cy.log('Assertion Passed');
          assertionResults.push({ data: 'passed' });
        } else {
          if (!failedAssertions.has(customErrorMessage)) {
            cy.log('Assertion Failed');
            failedAssertions.add(customErrorMessage);
            failureMessages.push({ referenceNumber, errorContext, message: customErrorMessage });
            cy.screenshot(`failure-${index}-${expectedColTitle[index].replace(/\W/g, '-')}`, { capture: 'fullPage' });
          } else {
            cy.log('Skipping screenshot, failure already captured.');
          }
          assertionResults.push({ data: 'failed' });
          errorMessages.push(customErrorMessage);
        }
        resolve();
      }));
    });

    return Cypress.Promise.all(elementPromises).then(() => {
      if (errorMessages.length > 0) {
        cy.log(`\n${errorMessages.join('\n')}`);
      }
    });
  }).then(() => {
    // Write assertionResults status to a file
    cy.writeFile('cypress/fixtures/message.json', JSON.stringify(assertionResults));
  });
});



Cypress.Commands.add('checkHeaderTitle', (selector, referenceNumber, errorContext, expectedText, assertionResults = [], failureMessages = []) => {
  cy.get(selector).then($element => {
    const actualText = $element.text().trim(); // Get the actual text from the element
    const containsExpectedText = $element.text().includes(expectedText);

    if (containsExpectedText) {
      cy.wrap($element).should('be.visible');
      cy.log('Assertion Passed');
      assertionResults.push({ data: 'passed' });
    } else {
      const failureMessage = `The title header should be "${expectedText}" instead of "${actualText}"`;

      if (!failedAssertions.has(failureMessage)) {
        cy.log('Assertion Failed');
        failedAssertions.add(failureMessage);
        failureMessages.push({ referenceNumber, errorContext, message: failureMessage });
        cy.screenshot(`failure-${failureMessage}-${selector.replace(/\W/g, '-')}`, { capture: 'fullPage' });
      } else {
        cy.log('Skipping screenshot, failure already captured.');
      }
      assertionResults.push({ data: 'failed' });
    }
  }).then(() => {
    cy.writeFile('cypress/fixtures/message.json', JSON.stringify(assertionResults));
  });
});



Cypress.Commands.add('checkForFailure', (assertionResults, failureMessages = []) => {
  cy.fixture('message.json').then((data) => {
    // Check if there's a failure in either the assertions or the JSON data
    const hasFailedAssertions = assertionResults.some(entry => entry.data === 'failed');
    const hasFailedJson = data.some(entry => entry.data === 'failed');

    if (hasFailedAssertions || hasFailedJson) {
      // Consolidate and log all unique failure messages
      const consolidatedErrors = failureMessages.reduce((acc, { referenceNumber, errorContext, message }) => {
        if (!acc[referenceNumber]) {
          acc[referenceNumber] = { context: errorContext, messages: [] };
        }
        acc[referenceNumber].messages.push(message);
        return acc;
      }, {});

      const errorLog = Object.entries(consolidatedErrors).map(([reference, { context, messages }]) => {
        const numberedMessages = messages.map((msg, idx) => `${idx + 1}. ${msg}`).join('\n\t');
        return `Reference No.: ${reference}\n${context}\n\t${numberedMessages}`;
      }).join('\n\n');

      // Log consolidated error messages
      cy.log(errorLog);

      // Throw error if there are failure messages
      if (Object.keys(consolidatedErrors).length > 0) {
        throw new Error(`Test failed with the following errors:\n\n${errorLog}`);
      }
    } else {
      cy.log('No failures detected.');
    }
  });
});



Cypress.Commands.add('checkLabelCaption', (selector, referenceNumber, errorContext, expectedText, assertionResults = [], failureMessages = []) => {
  cy.get(selector).then($element => {
    const actualText = $element.text().trim(); // Get the actual text from the element
    const containsExpectedText = $element.text().includes(expectedText);

    if (containsExpectedText) {
      cy.wrap($element).should('be.visible');
      cy.log('Assertion Passed');
      assertionResults.push({ data: 'passed' });
    } else {
      const failureMessage = `The title header should be "${expectedText}" instead of "${actualText}"`;

      if (!failedAssertions.has(failureMessage)) {
        cy.log('Assertion Failed');
        failedAssertions.add(failureMessage);
        failureMessages.push({ referenceNumber, errorContext, message: failureMessage });
        cy.screenshot(`failure-${failureMessage}-${selector.replace(/\W/g, '-')}`, { capture: 'fullPage' });
      } else {
        cy.log('Skipping screenshot, failure already captured.');
      }
      assertionResults.push({ data: 'failed' });
    }
  }).then(() => {
    cy.writeFile('cypress/fixtures/message.json', JSON.stringify(assertionResults));
  });
});



Cypress.Commands.add('validateElements', (fixtureFileName, referenceNumber, errorContext, assertionResults = [], failureMessages = []) => {
  const failedAssertions = new Set(); // Track failed assertions to avoid redundant errors

  cy.fixture(fixtureFileName).then((elements) => {
    const elementPromises = elements.map((element) => {
      return cy.get(element.sel).then(($el) => {
        const actualAssertion = element.assertion;
        let assertionPassed = true;
        let customErrorMessage = '';

        // Check different assertions
        switch (actualAssertion) {
          case 'not.be.enabled':
            assertionPassed = !$el.is(':enabled');
            break;
          case 'be.enabled':
            assertionPassed = $el.is(':enabled');
            break;
          case 'not.be.disabled':
            assertionPassed = !$el.is(':disabled');
            break;
          case 'be.disabled':
            assertionPassed = $el.is(':disabled');
            break;
          case 'exist':
            assertionPassed = $el.length > 0;
            break;
          case 'not.exist':
            assertionPassed = $el.length === 0;
            break;
          case 'be.visible':
            assertionPassed = $el.is(':visible');
            break;
          case 'not.be.visible':
            assertionPassed = !$el.is(':visible');
            break;
          case 'have.class':
            assertionPassed = $el.hasClass(element.className);
            break;
          case 'not.have.class':
            assertionPassed = !$el.hasClass(element.className);
            break;
          case 'have.text':
            assertionPassed = $el.text() === element.expectedText;
            break;
          case 'not.have.text':
            assertionPassed = $el.text() !== element.expectedText;
            break;
          case 'contain.text':
            assertionPassed = $el.text().includes(element.expectedText);
            break;
          case 'not.contain.text':
            assertionPassed = !$el.text().includes(element.expectedText);
            break;
          case 'have.value':
            assertionPassed = $el.val() === element.expectedValue;
            break;
          case 'not.have.value':
            assertionPassed = $el.val() !== element.expectedValue;
            break;
          case 'contain.value':
            assertionPassed = $el.val().includes(element.expectedValue);
            break;
          case 'not.contain.value':
            assertionPassed = !$el.val().includes(element.expectedValue);
            break;
          case 'be.checked':
            assertionPassed = $el.is(':checked');
            break;
          case 'not.be.checked':
            assertionPassed = !$el.is(':checked');
            break;
          case 'be.selected':
            assertionPassed = $el.is(':selected');
            break;
          case 'not.be.selected':
            assertionPassed = !$el.is(':selected');
            break;
          case 'be.empty':
            assertionPassed = $el.is(':empty');
            break;
          case 'not.be.empty':
            assertionPassed = !$el.is(':empty');
            break;
          default:
            assertionPassed = false;
            customErrorMessage = `Unknown assertion: ${actualAssertion}`;
        }

        if (!assertionPassed) {
          customErrorMessage = element.customErrorMsg || customErrorMessage;
        }

        if (assertionPassed) {
          if (['have.text', 'not.have.text', 'contain.text', 'not.contain.text'].includes(actualAssertion)) {
            cy.wrap($el).should(actualAssertion, element.expectedText);
          } else if (['have.value', 'not.have.value', 'contain.value', 'not.contain.value'].includes(actualAssertion)) {
            cy.wrap($el).should(actualAssertion, element.expectedValue);
          } else {
            cy.wrap($el).should(actualAssertion);
          }
          cy.log('Assertion Passed');
          assertionResults.push({ data: 'passed' });
        } else {
          if (!failedAssertions.has(customErrorMessage)) {
            cy.log('Assertion Failed');
            failedAssertions.add(customErrorMessage);
            failureMessages.push({ referenceNumber, errorContext, message: customErrorMessage });
            cy.screenshot(`failure-${failureMessage}-${element.sel.replace(/\W/g, '-')}`, { capture: 'fullPage' });
          } else {
            cy.log('Skipping screenshot, failure already captured.');
          }
          assertionResults.push({ data: 'failed' });
        }
      });
    });

    return Cypress.Promise.all(elementPromises);
  }).then(() => {
    cy.writeFile('cypress/fixtures/message.json', JSON.stringify(assertionResults));
  });
});


// Check element shoulb be visible
Cypress.Commands.add('checkElementVisibility', (selector, referenceNumber, errorContext, errorMsg, assertionResults = [], failureMessages = []) => {
  cy.get('body').then(($body) => {

    // Check if the element exists
    if ($body.find(selector).length > 0) {

      // If the element exists, get the element and check visibility
      cy.get(selector).then($element => {

        const isVisible = $element.is(':visible');

        if (isVisible) {

          cy.log('Assertion Passed');
          assertionResults.push({ data: 'passed' });

        } else {

          const failureMessage = errorMsg;

          if (!failedAssertions.has(failureMessage)) {

            cy.log('Assertion Failed');
            failedAssertions.add(failureMessage);
            failureMessages.push({ referenceNumber, errorContext, message: failureMessage });
            cy.screenshot(`failure-${failureMessage}-${selector.replace(/\W/g, '-')}`, { capture: 'fullPage' });

          } else {

            cy.log('Skipping screenshot, failure already captured.');

          }

          assertionResults.push({ data: 'failed' });
        }
      })

    } else {

      // Handle the case where the element is not found
      const failureMessage = errorMsg;

      if (!failedAssertions.has(failureMessage)) {

        cy.log('Assertion Failed');
        failedAssertions.add(failureMessage);
        failureMessages.push({ referenceNumber, errorContext, message: failureMessage });
        cy.screenshot(`failure-${selector.replace(/\W/g, '-')}`, { capture: 'fullPage' });

      } else {

        cy.log('Skipping screenshot, failure already captured.');

      }
      assertionResults.push({ data: 'failed' });
    }
  }).then(() => {

    cy.writeFile('cypress/fixtures/message.json', JSON.stringify(assertionResults));

  });
});


// Check element should not be visible
Cypress.Commands.add('checkElementInvisibility', (selector, referenceNumber, errorContext, errorMsg, assertionResults = [], failureMessages = []) => {
  cy.get('body').then(($body) => {

    // Check if the element exists
    if ($body.find(selector).length > 0) {

      // If the element exists, get the element and check visibility
      cy.get(selector).then($element => {

        const isVisible = $element.is(':visible');

        if (!isVisible) {

          cy.log('Assertion Passed');
          assertionResults.push({ data: 'passed' });

        } else {

          const failureMessage = errorMsg;

          if (!failedAssertions.has(failureMessage)) {

            cy.log('Assertion Failed');
            failedAssertions.add(failureMessage);
            failureMessages.push({ referenceNumber, errorContext, message: failureMessage });
            cy.screenshot(`failure-${failureMessage}-${selector.replace(/\W/g, '-')}`, { capture: 'fullPage' });

          } else {

            cy.log('Skipping screenshot, failure already captured.');

          }

          assertionResults.push({ data: 'failed' });
        }
      })

    } else {

      // Handle the case where the element is not found
      cy.log('Assertion Passed');
      assertionResults.push({ data: 'passed' });
    }
  }).then(() => {

    cy.writeFile('cypress/fixtures/message.json', JSON.stringify(assertionResults));
    
  });
});


Cypress.Commands.add('execute', (command) => {
  return cy.task('execute', command);
})