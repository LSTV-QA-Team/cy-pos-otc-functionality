const fs = require('fs');
const path = require('path');

// Function to generate HTML content for a test case
function generateTestCaseHTML(code, testScriptName) {
  const testCaseRegex = /it\('(.*?)',\s*\(.*?\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g; // Capture `it()` block content
  let testCaseContent = '';
  let testIndex = 1;

  let match;
  while ((match = testCaseRegex.exec(code)) !== null) {
    const testCaseTitle = match[1];
    const testCaseBlock = match[2];

    // Extract comments from the entire block
    const singleLineComments = testCaseBlock.match(/\/\/\s*\d+\..*$/gm) || []; // Single-line numbered comments
    const multiLineComments = testCaseBlock.match(/\/\*[\s\S]*?\*\//gm) || []; // Multi-line comments

    testCaseContent += `<div class="test-case">
                          <h3>Test Case ${testIndex}: ${testCaseTitle}</h3>\n`;

    const allComments = [...singleLineComments, ...multiLineComments]; // Combine all comments

    if (allComments.length > 0) {
      testCaseContent += `<div class="test-steps">`;

      for (const comment of allComments) {
        const cleanedComment = comment.replace(/^\/\/\s*/, '').replace(/\/\*|\*\//g, '').trim();
        testCaseContent += `<p>${cleanedComment}</p>\n`;
      }

      testCaseContent += `</div>`;
    } else {
      testCaseContent += 'No numbered comments extracted\n';
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
      } else if (itemPath.endsWith('.spec.cy.js')) { // Only process test spec files
        const fileContent = await fs.promises.readFile(itemPath, 'utf8');
        const baseName = path.basename(itemPath, '.spec.cy.js'); // Get the base name of the file
        const uniqueFileName = `${baseName}-act-report.html`; // Create unique filename with suffix
        
        // Generate the test case content
        const testCasesContent = generateTestCaseHTML(fileContent, baseName);
        
        // Generate the full HTML report
        const fullReport = `<!DOCTYPE html>
        <html>
        <head>
          <title>Test Cases Report: ${baseName}</title>
          <style> ${cssStyles} </style>
        </head>
        <body>
          <h2>List of Activities to Test: ${baseName}</h2>\n  
          ${testCasesContent}
        </body>
        </html>`;

        const outputFilePath = path.join(reportDir, uniqueFileName); // Path for the unique report file
        
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

// CSS styles for the report
const cssStyles = `
/* Basic Styling */
body {
  font-family: Arial, sans-serif;
}

.test-case {
  border: 1px solid #ccc;
  margin-bottom: 20px;
  padding: 15px;
}

.test-steps {
  margin-top: 10px;
}

.file-test-cases {
  margin-bottom: 25px;
  border-bottom: 1px dashed #ddd;
}
`;

const testRootDir = 'cypress/e2e/tests';
const reportDir = 'cypress/reports';

// Ensure the report directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir);
}

(async () => {
  try {
    await gatherTestCases(testRootDir, reportDir); // Pass `reportDir` to ensure unique file paths
    console.log(`Reports generated in: ${reportDir}`);
  } catch (error) {
    console.error('Error generating reports:', error);
  }
})();
