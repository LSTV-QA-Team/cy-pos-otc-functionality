// cypress.config.js

require('dotenv').config(); // Load environment variables from .env file

const { defineConfig } = require("cypress");
const mysql = require("mysql");
const fs = require('fs');
const path = require('path');
const { report } = require('process');


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

  reporter: 'cypress-mochawesome-reporter',

  video: false,

  screenshotsFolder: 'cypress/reports/screenshots',


  reporter: 'cypress-mochawesome-reporter',

  reporterOptions: {

            charts: true,
            reportPageTitle: 'Cypress React-POS Report',
            embeddedScreenshots: true, 
            html: true,
            json: true,
            inlineAssets: true,
            enableCode: false,
            reportFilename: "[status]_[datetime]-[name]-report",
            timestamp: "longDate",
            // autoOpen: false,
            debug: false,
            quiet: true,
            overwrite: true,
            // saveAllAttempts: false,
            screenshotOnRunFailure: true

        
        
  },



  e2e: {

    baseUrl: 'http://localhost:5173/#/pages/login',
    experimentalStudio: true,
    reporter: 'cypress-mochawesome-reporter',

    // implement node event listeners here
    setupNodeEvents(on, config) {

      require('cypress-mochawesome-reporter/plugin')(on);


          on('before:browser:launch', (browser = {}, launchOptions) => {


            console.log(launchOptions.args)
        
            if (browser.name == 'chrome') {
              launchOptions.args.push(['--no-sandbox','--disable-gpu','--headless'])
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

