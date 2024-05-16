const esprima = require('esprima');
const fs = require('fs');
const path = require('path');

function extractTestCases(jsCode) {
    const parsed = esprima.parseScript(jsCode, { comment: true }); 
    const testCases = [];

    function traverse(node) {
        if (node.type === 'CallExpression' && node.callee.name === 'it') {
            const testCaseTitle = node.arguments[0].value; 
            const comments = [];

            // Extract comments directly preceding the `it` block
            if (node.leadingComments) {
                node.leadingComments.forEach(comment => {
                    const trimmedComment = comment.value.trim();
                    if (comment.type === 'Line' && /^\d+\.\s/.test(trimmedComment)) {
                        comments.push(trimmedComment);
                    }
                });
            }

            testCases.push({ title: testCaseTitle, comments }); 
        }

        // Recur through child nodes
        for (const key in node) {
            if (typeof node[key] === 'object' && node[key] !== null) {
                traverse(node[key]);
            }
        }
    }

    traverse(parsed); // Traverse the AST
    return testCases;
}

function generateTestCaseHTML(testCases, reportTitle) {
    let htmlContent = '<html><head><style>';
    htmlContent += `
    body { font-family: Arial, sans-serif; padding: 20px; }
    .test-case { border: 1px solid #ccc; background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; }
    .test-steps { margin-left: 20px; }
    .test-steps p { margin: 5px 0; padding: 2px 0; border-bottom: 1px solid #eee; }
    `;
    htmlContent += '</style></head><body>';

    htmlContent += `<h2>Test Case Report: ${reportTitle}</h2>`;

    testCases.forEach((testCase, index) => {
        htmlContent += `<div class="test-case">`;
        htmlContent += `<h3>Test Case ${index + 1}: ${testCase.title}</h3>`;
        htmlContent += `<div class="test-steps">`;

        if (testCase.comments.length > 0) {
            testCase.comments.forEach((comment) => {
                htmlContent += `<p>${comment}</p>`;
            });
        } else {
            htmlContent += '<p>No numbered comments found</p>'; 
        }

        htmlContent += `</div>`;
        htmlContent += `</div>`;
    });

    htmlContent += '</body></html>';

    return htmlContent;
}

// Recursive function to gather test cases from a specified directory
async function gatherTestCases(directory, reportDir) {
    const results = [];

    try {
        const items = await fs.promises.readdir(directory);

        for (const item of items) {
            const itemPath = path.join(directory, item);

            if ((await fs.promises.lstat(itemPath)).isDirectory()) {
                const subResults = await gatherTestCases(itemPath, reportDir); 
                results.push(...subResults);
            } else if (itemPath.endsWith('.spec.cy.js')) {
                console.log('Processing:', itemPath); 
                const fileContent = await fs.promises.readFile(itemPath, 'utf8');
                const testCases = extractTestCases(fileContent);

                if (testCases.length > 0) {
                    const baseName = path.basename(itemPath, '.spec.cy.js');
                    const reportContent = generateTestCaseHTML(testCases, baseName); 
                    const reportFileName = `${baseName}-report.html`;

                    const reportFilePath = path.join(reportDir, reportFileName); 
                    await fs.promises.writeFile(reportFilePath, reportContent, 'utf8');

                    console.log(`Report generated: ${reportFilePath}`); 
                } else {
                    console.log(`No test cases found in: ${itemPath}`); 
                }
            }
        }
    } catch (error) {
        console.error('Error gathering test cases:', error);
    }

    return results;
}

// Ensure the report directory exists
const reportDir = 'cypress/reports';
if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir); 
}

// Generate test case reports from a specified directory
const testRootDir = 'cypress/e2e/tests';

(async () => {
    try {
        await gatherTestCases(testRootDir, reportDir); 
        console.log(`Reports generated in: ${reportDir}`);
    } catch (error) {
        console.error('Error generating reports:', error);
    }
})();
