// cypress.config.js

require('dotenv').config(); // Load environment variables from .env file

const { defineConfig } = require("cypress");
const mysql = require("mysql");

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
      // implement node event listeners here

      // Define the "queryDb" task
      on("task", {
        queryDb: (query) => {
          return queryTestDb(query, config);
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

