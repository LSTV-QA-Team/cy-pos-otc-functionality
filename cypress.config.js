// cypress.config.js

require("dotenv").config(); // Load environment variables from .env file

const { defineConfig } = require("cypress");
const mysql = require("mysql");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { exec } = require("child_process");

module.exports = defineConfig({
  env: {
    userCode: "lstv",
    userPassword: "lstventures",

    db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  },

  redirectionLimit: 1000,

  // experimentalMemoryManagement: true,

  // defaultCommandTimeout: 4000,

  // pageLoadTimeout: 100000,

  watchForFileChanges: false,

  hideXHRInCommandLog: true,

  video: false,

  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    charts: true,
    reportPageTitle: "Cypress POS-OTC Functionality Report",
    reportFilename: `[status]-[name]-${moment().format("YYYY-MM-DD")}-report`,
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
    baseUrl: "http://localhost:5173/#/pages",
    experimentalStudio: true,
    testIsolation: false,
    experimentalRunAllSpecs: true,

    viewportWidth: 1280,
    viewportHeight: 720,
    
    // implement node event listeners here
    setupNodeEvents(on, config) {
      // config.specPattern = [
      //   'cypress/e2e/tests/master',
      //   'cypress/e2e/tests/chashiering',
      //   'cypress/e2e/tests/ordering',
      // ]

      config.specPattern = [
        "cypress/e2e/tests/master/01-master-item-class.spec.cy.js",
        "cypress/e2e/tests/master/02-master-item-subclass.spec.cy.js",
        "cypress/e2e/tests/master/03-master-memc.spec.cy.js",
        "cypress/e2e/tests/master/04-master-item.spec.cy.js",
        "cypress/e2e/tests/master/05-select-memc.spec.cy.js",
        "cypress/e2e/tests/master/06-master-order-type.spec.cy.js",
        "cypress/e2e/tests/master/07-master-discount.spec.cy.js",
        "cypress/e2e/tests/master/08-master-card-type.spec.cy.js",
        "cypress/e2e/tests/master/09-master-payment-type.spec.cy.js",
        "cypress/e2e/tests/master/10-master-free-reasons.spec.cy.js",
        "cypress/e2e/tests/master/11-master-pricelist.spec.cy.js",
        "cypress/e2e/tests/master/12-master-special-request.spec.cy.js",
        "cypress/e2e/tests/master/13-master-void-refund-reasons.spec.cy.js",
        "cypress/e2e/tests/master/14-master-footer.spec.cy.js",
        "cypress/e2e/tests/master/15-master-header.spec.cy.js",
        "cypress/e2e/tests/master/16-master-other-charges.spec.cy.js",
        "cypress/e2e/tests/master/17-master-system.parameter.spec.cy.js",
        // 'cypress/e2e/tests/master/18-master-cash-in-out-reason.spec.cy.js',

        "cypress/e2e/tests/cashiering/cashiering-cashfund.spec.cy.js",
        "cypress/e2e/tests/cashiering/cashiering-cash-in.spec.cy.js",
        "cypress/e2e/tests/cashiering/cashiering-cash-out.spec.cy.js",

        "cypress/e2e/tests/ordering/01-ordering.spec.cy.js",
        "cypress/e2e/tests/ordering/01.2-ordering.spec.cy.js",
        "cypress/e2e/tests/ordering/02-ordering-negative.spec.cy.js",
        "cypress/e2e/tests/ordering/03-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/04-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/05-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/06-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/07-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/08-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/09-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/10-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/11-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/12-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/13-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/14-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/15-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/16-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/17-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/18-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/19-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/20-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/21-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/22-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/23-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/24-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/25-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/26-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/27-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/28-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/29-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/30-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/31-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/32-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/33-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/34-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/35-transaction.spec.cy.js",
        "cypress/e2e/tests/ordering/36-transaction.spec.cy.js",

        "cypress/e2e/tests/cashiering/cashiering-cash-declaration.spec.cy.js",
      ];

      require("cypress-mochawesome-reporter/plugin")(on);

      on("before:browser:launch", (browser = {}, launchOptions) => {
        console.log(launchOptions.args);

        if (browser.name == "chrome") {
          launchOptions.args.push(["--no-sandbox", "--disable-gpu"]);
        }

        return launchOptions;
      });

      // Define the "queryDb" task9
      on("task", {
        queryDb: (query) => {
          return queryTestDb(query, config);
        },
      });

      // verify downloded file
      on("task", {
        verifyDownloads: (downloadsPath) => {
          try {
            return fs.readdirSync(downloadsPath);
          } catch (err) {
            console.error("Error reading downloads:", err);
            return null;
          }
        },
      });

      // delete files in download
      on("task", {
        clearDownloads() {
          try {
            const downloadsFolder = path.join(
              config.projectRoot,
              "cypress",
              "downloads"
            );
            fs.readdirSync(downloadsFolder).forEach((file) => {
              const filePath = path.join(downloadsFolder, file);
              fs.unlinkSync(filePath);
            });
            return null;
          } catch (err) {
            console.error("Error clearing downloads:", err);
            return null;
          }
        },
      });

      // exec
      on("task", {
        async execute(command) {
          return new Promise((resolve, reject) => {
            try {
              // Execute the command using exec with the shell option set to true
              exec(command, { shell: "bash" }, (error, stdout, stderr) => {
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
        },
      });

      return config; // Return the updated configuration
    },

    chromeWebSecurity: false,
    numTestsKeptInMemory: 0,
    defaultCommandTimeout: 10000,
    execTimeout: 60000,
    pageLoadTimeout: 60000,
    requestTimeout: 60000,
    responseTimeout: 60000,
    taskTimeout: 60000,
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
    });
  });
}
