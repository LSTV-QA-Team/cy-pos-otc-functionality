var xlsx = require("xlsx");
var fs = require('fs');
var dataPathExcel = "cypress/fixtures/excel_data.xlsx";
var wb = xlsx.readFile(dataPathExcel);

wb.SheetNames.forEach(function(sheetName) {
    var sheetValue = wb.Sheets[sheetName];
    var excelData = xlsx.utils.sheet_to_json(sheetValue);
    var dataPathJson = "cypress/fixtures/";

    // Using the sheet name for the JSON file name
    fs.writeFile(`${dataPathJson}${sheetName}.json`, JSON.stringify(excelData), function(err) {
        if (err) {
            console.error("Error writing JSON for sheet: ", sheetName, err);
        } else {
            console.log(`${sheetName}.json file is created`);
        }
    });
});

//requirements: npm install xlsx in terminal