  const fs = require('fs');
  const path = require('path');

  // Function to generate HTML content for a test case
  function generateTestCaseHTML(code) {
    // Regex to capture `it()` block content
    const testCaseRegex = /it\('(.*?)',\s*\(.*?\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g;
    let testCaseContent = '';
    let testIndex = 1;

    let match;
    while ((match = testCaseRegex.exec(code)) !== null) {
      const testCaseTitle = match[1];
      const testCaseBlock = match[2];

      // Extract all single-line comments with number and period
      const numberedComments = testCaseBlock.match(/\/\/\s*\d+\..*$/gm) || [];

      testCaseContent += `<div class="test-case">
                            <h3>Test Case ${testIndex}: ${testCaseTitle}</h3>\n`;

      if (numberedComments.length > 0) {
        testCaseContent += `<div class="test-steps">`;

        // Loop through all extracted comments
        for (const comment of numberedComments) {
          const cleanedComment = comment.replace(/^\/\/\s*/, '').trim();
          testCaseContent += `<p>${cleanedComment}</p>\n`;
        }

        testCaseContent += `</div>`;
      } else {
        testCaseContent += '<p>No numbered comments found</p>';
      }

      testCaseContent += `</div>`;
      testIndex++;
    }

    return testCaseContent;
  }

  // Recursive function to gather all test cases from a directory
  async function gatherTestCases(directory, reportDir) {
    const results = [];

    try {
      const items = await fs.promises.readdir(directory);

      for (const item of items) {
        const itemPath = path.join(directory, item);

        if ((await fs.promises.lstat(itemPath)).isDirectory()) {
          const subResults = await gatherTestCases(itemPath, reportDir); // Recursive call for subdirectories
          results.push(...subResults);
        } else if (itemPath.endsWith('.spec.cy.js')) { // Process test spec files
          const fileContent = await fs.promises.readFile(itemPath, 'utf8');
          const baseName = path.basename(itemPath, '.spec.cy.js'); // Get the base name of the file
          const uniqueFileName = `${baseName}-report.html`; // Create unique filename
          
          // Generate the test case content
          const testCasesContent = generateTestCaseHTML(fileContent);
          
          // Generate the full HTML report
          const fullReport = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Test Case Report: ${baseName}</title>
            <style>${cssStyles}</style>
          </head>
          <body>
            <h2>Test Case Report for: ${baseName}</h2>\n  
            ${testCasesContent}
          </body>
          </html>`;
          
          const outputFilePath = path.join(reportDir, uniqueFileName); // Path for the report
          
          // Write the report to a unique file
          await fs.promises.writeFile(outputFilePath, fullReport, 'utf8');

          console.log(`Report generated: ${outputFilePath}`);
          
          results.push(fullReport); // Keep track of generated reports (for debugging or additional processing)
        }
      }
    } catch (error) {
      console.error('Error gathering test cases:', error);
    }

    return results;
  }

  // CSS styles for the HTML report
  const cssStyles = `
  /* Basic Styling */
  body {
    font-family: Arial, sans-serif;
    padding: 20px;
  }

  .test-case {
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    padding: 15px;
    margin-bottom: 20px;
  }

  .test-steps {
    margin-top: 10px;
    font-size: 14px;
  }

  .test-steps p {
    margin: 5px 0;
    padding: 2px 0;
    border-bottom: 1px solid #eee;
  }
  `;

  // Define directories for test scripts and reports
  const testRootDir = 'cypress/e2e/tests';
  const reportDir = 'cypress/reports';

  // Ensure the report directory exists
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir); // Create the report directory if it doesn't exist
  }


  (async () => {
    try {
      await gatherTestCases(testRootDir, reportDir); // Generate reports from the test spec files
      console.log(`Reports generated in: ${reportDir}`);
    } catch (error) {
      console.error('Error generating reports:', error);
    }
  })();
