const esprima = require('esprima');
const fs = require('fs');
const path = require('path');

// Function to extract 'it()' blocks and 'cy.addTestContext()' content
function extractTestContexts(jsCode) {
    const parsed = esprima.parseScript(jsCode);
    const testCases = [];

    function traverse(node) {
        if (
            node.type === 'CallExpression' &&
            node.callee.name === 'it' &&
            node.arguments.length > 1 &&
            node.arguments[0].type === 'Literal'
        ) {
            const testCaseTitle = node.arguments[0].value; 

            const block = node.arguments[1];
            if (block.type === 'BlockStatement') {
                block.body.forEach((statement) => {
                    if (
                        statement.type === 'ExpressionStatement' &&
                        statement.expression.type === 'CallExpression' &&
                        statement.expression.callee.object &&
                        statement.expression.callee.object.name === 'cy' &&
                        statement.expression.callee.property.name === 'addTestContext'
                    ) {
                        const contextArg = statement.expression.arguments[0];
                        if (contextArg && contextArg.type === 'Literal') {
                            const contextText = contextArg.value.trim(); 
                            testCases.push({ title: testCaseTitle, testContexts: [contextText] }); 
                        }
                    }
                });
            }
        }

        // Recur through child nodes
        for (const key in node) {
            if (typeof node[key] === 'object' && node[key] !== null) {
                traverse(node[key]);
            }
        }
    }

    traverse(parsed); 
    return testCases; 
}

// Function to generate HTML report from test contexts
function generateTestContextHTML(testCases, reportTitle) {
    let htmlContent = '<html><head><style>';
    htmlContent += `
    body { font-family: Arial, sans-serif; padding: 20px; }
    .test-case { border: 1px solid #ccc; background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; }
    .test-contexts { margin-left: 20px; }
    .test-contexts p { margin: 5px 0; padding: 2px 0; border-bottom: 1px solid #eee; }
    `;
    htmlContent += '</style></head><body>';

    htmlContent += `<h2>${reportTitle}</h2>`;
  
    testCases.forEach((testCase, index) => {
        htmlContent += `<div class="test-case">`;
        htmlContent += `<h3>Test Case ${index + 1}: ${testCase.title}</h3>`;
        htmlContent += `<div class="test-contexts">`;

        testCase.testContexts.forEach((context) => {
            const steps = context.split('\n');
            steps.forEach((step, stepIndex) => {
                htmlContent += `<p>Step ${stepIndex + 1}: ${step}</p>`;
            });
        });

        htmlContent += `</div>`;
        htmlContent += `</div>`;
    });

    htmlContent += '</body></html>';

    return htmlContent;
}

// Get all .spec.cy.js files from the specified directory
const cypressTestDir = path.join(__dirname, 'cypress', 'e2e', 'tests'); // Your Cypress test script directory
const testFiles = fs.readdirSync(cypressTestDir).filter((file) => file.endsWith('.spec.cy.js')); // Get all test files

const allTestCases = []; // Collection for all test cases across files

// Iterate through each test file and extract test contexts
testFiles.forEach((file) => {
    const testScriptPath = path.join(cypressTestDir, file);
    const jsCode = fs.readFileSync(testScriptPath, 'utf-8'); // Read the file content

    const testCases = extractTestContexts(jsCode);
    allTestCases.push(...testCases); // Combine all test cases
});

// Generate HTML report from all test contexts
const reportTitle = 'Test Context Report (All Test Cases)';
const htmlReport = generateTestContextHTML(allTestCases, reportTitle);

// Save the report to a file
const outputReportPath = path.join(__dirname, 'test_context_report.html');
fs.writeFileSync(outputReportPath, htmlReport);

console.log(`HTML report generated: ${outputReportPath}`);
