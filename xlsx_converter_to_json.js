var xlsx = require("xlsx");
var fs = require('fs');
var path = require('path');

// Get the sheet name from the command-line arguments
var sheetName = process.argv[2]; // the first argument passed to the script

if (!sheetName) {
    console.error("Please provide a sheet name as an argument.");
    process.exit(1); // exit with error code 1
}

var dataPathExcel = "cypress/fixtures/excel_data.xlsx"; // path to the Excel file
var wb = xlsx.readFile(dataPathExcel); // reading the Excel file into a workbook object (`wb`).

if (!wb.SheetNames.includes(sheetName)) {
    console.error(`Sheet "${sheetName}" not found in the workbook.`);
    process.exit(1);
}

var sheetValue = wb.Sheets[sheetName]; // getting the data for the specified sheet
var excelData = xlsx.utils.sheet_to_json(sheetValue); // converting the sheet to JSON

var dataPathJson = "cypress/fixtures/"; // path where JSON file will be saved

// Save the JSON file with the specified sheet name
fs.writeFile(
    path.join(dataPathJson, `${sheetName}.json`),
    JSON.stringify(excelData),
    function (err) {
        if (err) {
            console.error("Error writing JSON for sheet: ", sheetName, err);
        } else {
            console.log(`${sheetName}.json file is created.`);
        }
    }
);




















//OLD SCRIPT

// var xlsx = require("xlsx");
// var fs = require('fs');
// var dataPathExcel = "cypress/fixtures/excel_data.xlsx"; //path to Excel file
// var wb = xlsx.readFile(dataPathExcel);   //reading the Excel file into a workbook object (`wb`).

// wb.SheetNames.forEach(function(sheetName) {  //loopimg through each sheet in excel file
//     var sheetValue = wb.Sheets[sheetName];  //getting data of current sheet
//     var excelData = xlsx.utils.sheet_to_json(sheetValue);    //converting the sheet to JSON file format
//     var dataPathJson = "cypress/fixtures/";  //path where JSON file will be saved

//     // Using the sheet name for the JSON file name
//     fs.writeFile(`${dataPathJson}${sheetName}.json`, JSON.stringify(excelData), function(err) {
//         if (err) {
//             console.error("Error writing JSON for sheet: ", sheetName, err);
//         } else {
//             console.log(`${sheetName}.json file is created`);
//         }
//     });
// });

// // `${dataPathJson}${sheetName}.json` 
// // Path of the JSON file to be created, where `${sheetName}` is the name of the current sheet.



// //requirements: npm install xlsx in terminal