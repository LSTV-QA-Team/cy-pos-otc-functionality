require("dotenv").config();
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
  watchForFileChanges: false,
  hideXHRInCommandLog: true,
  video: false,
  watchForFileChanges: false,

  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    charts: true,
    reportPageTitle: "Cypress POS-OTC Functionality Report",
    reportFilename: `[status]-[name]-${moment().format("YYYY-MM-DD")}-report`,
    embeddedScreenshots: false,
    inlineAssets: true,
    saveJson: true,
    json: true,
    html: true,
    overwrite: false,
    quiet: false,
    screenshotOnRunFailure: true,
  },

  e2e: {
    baseUrl: "http://localhost:5173/#/pages",
    experimentalStudio: true,
    testIsolation: false,
    experimentalRunAllSpecs: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    chromeWebSecurity: false,
    numTestsKeptInMemory: 0,
    defaultCommandTimeout: 10000,
    execTimeout: 60000,
    pageLoadTimeout: 60000,
    requestTimeout: 60000,
    responseTimeout: 60000,
    taskTimeout: 60000,

    setupNodeEvents(on, config) {
      // Configure test specs
      config.specPattern = [
        // Master File tests
        'cypress/e2e/tests/master/**/*.{js,jsx,ts,tsx}',
        
        // Cashiering tests
        'cypress/e2e/tests/cashiering/**/!(cashiering-cash-declaration).{js,jsx,ts,tsx}', 
        
        // Ordering tests
        'cypress/e2e/tests/ordering/**/*.{js,jsx,ts,tsx}',

        // Ordering other tests
        'cypress/e2e/tests/ordering-others/**/*.{js,jsx,ts,tsx}',

        // Report tests
        'cypress/e2e/tests/report/**/*.{js,jsx,ts,tsx}',

        "cypress/e2e/tests/cashiering/cashiering-cash-declaration.spec.cy.js",
      ];

      // Initialize reporter plugin
      require("cypress-mochawesome-reporter/plugin")(on); 

      // Browser launch configuration
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.name === "chrome") {
          launchOptions.args.push("--no-sandbox", "--disable-gpu");
        }
        return launchOptions;
      });

      // Database query task
      on("task", {
        queryDb: (query) => queryTestDb(query, config),
      });

      // File download verification task
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

      // Clear downloads task
      on("task", {
        clearDownloads() {
          try {
            const downloadsFolder = path.join(
              config.projectRoot,
              "cypress",
              "downloads"
            );
            fs.readdirSync(downloadsFolder).forEach((file) => {
              fs.unlinkSync(path.join(downloadsFolder, file));
            });
            return null;
          } catch (err) {
            console.error("Error clearing downloads:", err);
            return null;
          }
        },
      });

      // Command execution task
      on("task", {
        execute: (command) => new Promise((resolve, reject) => {
          exec(command, { shell: "bash" }, (error, stdout, stderr) => {
            if (error) {
              reject(error);
            } else {
              resolve({ stdout, stderr });
            }
          });
        }),
      });

      return config;
    },
  },
});

// Database query function
function queryTestDb(query, config) {
  const connection = mysql.createConnection(config.env.db);

  return new Promise((resolve, reject) => {
    connection.connect();
    connection.query(query, (error, results) => {
      connection.end();
      if (error) reject(error);
      else resolve(results);
    });
  });
}