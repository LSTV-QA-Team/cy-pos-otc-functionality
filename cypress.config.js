// cypress.config.js

require('dotenv').config(); // Load environment variables from .env file

const { defineConfig } = require("cypress");
const mysql = require("mysql");
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { exec } = require('child_process');


module.exports = defineConfig({

  env: {

    userCode: 'lstv',
    userPassword: 'lstventures',
    
    db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER, 
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME
    }
  },

  redirectionLimit: 1000,

  // experimentalMemoryManagement: true,

  defaultCommandTimeout: 4000,

  pageLoadTimeout: 100000,

  watchForFileChanges: false,

  hideXHRInCommandLog: true,

  video: false,

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: "cypress/reports",
    charts: true,
    reportPageTitle: 'Cypress POS-OTC Functionality Report',
    reportFilename: `[status]-[name]-${moment().format('YYYY-MM-DD')}-report`,
    embeddedScreenshots: false,
    inlineAssets: true,
    overwrite: true,
    json: true,
    html: true,
    debug: false,
    quiet: true,
    videoOnFailOnly: true,
    code: false,
    saveAllAttempts: false,
    screenshotOnRunFailure: false,
  },

  e2e: {

    baseUrl: 'http://localhost:5173/#/pages',
    experimentalStudio: true,
    testIsolation: false,
    experimentalRunAllSpecs: true,

    // implement node event listeners here
    setupNodeEvents(on, config) {

      config.specPattern = [
        'cypress/e2e/tests/master/master-item-class.spec.cy.js',
        'cypress/e2e/tests/master/master-item-subclass.spec.cy.js',
        'cypress/e2e/tests/master/master-memc.spec.cy.js',
        'cypress/e2e/tests/master/master-item.spec.cy.js',
        'cypress/e2e/tests/master/master-card-type.spec.cy.js',
        'cypress/e2e/tests/master/master-payment-type.spec.cy.js',
        'cypress/e2e/tests/master/master-order-type.spec.cy.js',
        'cypress/e2e/tests/master/master-discount.spec.cy.js',
        'cypress/e2e/tests/master/master-special-request.spec.cy.js',
        'cypress/e2e/tests/master/master-void-refund-reasons.spec.cy.js',
        'cypress/e2e/tests/master/master-free-reasons.spec.cy.js',
        'cypress/e2e/tests/master/master-pricelist.spec.cy.js',
        'cypress/e2e/tests/master/master-other-charges.spec.cy.js',
        'cypress/e2e/tests/master/master-system-parameters.spec.cy.js',
        'cypress/e2e/tests/master/master-header.spec.cy.js',
        'cypress/e2e/tests/master/master-footer.spec.cy.js',
        'cypress/e2e/tests/cashiering/cashiering-cashfund.spec.cy.js',
        'cypress/e2e/tests/cashiering/cashiering-cash-in.spec.cy.js',
        'cypress/e2e/tests/cashiering/cashiering-cash-out.spec.cy.js',
        'cypress/e2e/tests/ordering/ordering.spec.cy.js',
        'cypress/e2e/tests/ordering/ordering-negative.spec.cy.js',
        'cypress/e2e/tests/ordering/with-service-charge.spec.cy.js',
        'cypress/e2e/tests/ordering/void-transactions.spec.cy.js',
        'cypress/e2e/tests/ordering/refund-transaction.spec.cy.js',
        'cypress/e2e/tests/ordering/free-transaction.spec.cy.js',
        'cypress/e2e/tests/cashiering/cashiering-cash-declaration.spec.cy.js',
      ]

      require('cypress-mochawesome-reporter/plugin')(on);
      

          on('before:browser:launch', (browser = {}, launchOptions) => {


            console.log(launchOptions.args)
        
            if (browser.name == 'chrome') {
              launchOptions.args.push(['--no-sandbox','--disable-gpu'])
            }
        
            return launchOptions

          })



      // Define the "queryDb" task9
      on("task", {
        queryDb: (query) => {

          return queryTestDb(query, config);

        },
      });


      // verify downloded file
      on('task', {
        verifyDownloads: (downloadsPath) => {

          try {
            return fs.readdirSync(downloadsPath)
          } catch (err) {
            console.error("Error reading downloads:", err)
            return null;
          }
        },
      });

      
      // delete files in download 
      on('task', {
        clearDownloads() {
          try {
            const downloadsFolder = path.join(config.projectRoot, 'cypress', 'downloads');
            fs.readdirSync(downloadsFolder).forEach((file) => {
              const filePath = path.join(downloadsFolder, file);
              fs.unlinkSync(filePath);
            })
          return null;
          } catch (err) {
            console.error("Error clearing downloads:", err);
            return null;
          }
        },
      });
      
      // exec
      on('task', {
        async execute(command) {
          return new Promise((resolve, reject) => {
            try {
              // Execute the command using exec with the shell option set to true
              exec(command, { shell: 'bash' }, (error, stdout, stderr) => {
                if (error) {
                  // If there's an error, reject the promise with the error object
                  reject(error);
                } else {
                  // If the command executed successfully, resolve the promise with the output
                  resolve({ stdout, stderr });
                }
              });
            } catch (e) {
              // Catch any synchronous errors and reject the promise with the error
              reject(e);
            }
          });
        }
      });
      
      return config; // Return the updated configuration

    },
  },
});

// Database query function
function queryTestDb(query, config) {
  const connection = mysql.createConnection(config.env.db); // Ensure this matches your structure
  
  return new Promise((resolve, reject) => {
    connection.connect();

    connection.query(query, (error, results) => {
      connection.end();
      
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    })
  })
}

