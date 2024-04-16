const { defineConfig } = require("cypress");

module.exports = defineConfig({

  env: {

    userCode: 'lstv',
    userPassword: 'lstventures'
    
  },

  experimentalMemoryManagement: true,
  defaultCommandTimeout: 4000,
  pageLoadTimeout: 100000,

  e2e: {
    baseUrl: 'http://localhost:5173/#/pages/login',
    experimentalStudio: true,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
