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
    screenshotsFolder: "cypress/screenshots"
  },

  e2e: {

    baseUrl: 'http://localhost:5173/#/pages',
    experimentalStudio: true,
    testIsolation: false,

    // implement node event listeners here
    setupNodeEvents(on, config) {

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

