
import './commands'
import 'cypress-mochawesome-reporter/register';



// Alternatively you can use CommonJS syntax:
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

/**
 * This uses CSS to prevent the XHR requests from being picked up in the DOM 
 * and thereby reported to the Cypress runner.
 */
if (Cypress.config("hideXHRInCommandLog")) {
  const app = window.top;

  if (
      app &&
      !app.document.head.querySelector("[data-hide-command-log-request]")
  ) {
      const style = app.document.createElement("style");
      style.innerHTML =
      ".command-name-request, .command-name-xhr { display: none }";
      style.setAttribute("data-hide-command-log-request", "");

      app.document.head.appendChild(style);
  }
}
