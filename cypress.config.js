// cypress.config.js

require('dotenv').config(); // Load environment variables from .env file

const { defineConfig } = require("cypress");
const mysql = require("mysql");
const fs = require('fs');
const path = require('path');


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

  experimentalMemoryManagement: true,

  defaultCommandTimeout: 4000,

  pageLoadTimeout: 100000,

  watchForFileChanges: false,

  hideXHRInCommandLog: true,



  e2e: {
    baseUrl: 'http://localhost:5173/#/pages/login',
    experimentalStudio: true,

    setupNodeEvents(on, config) {

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

