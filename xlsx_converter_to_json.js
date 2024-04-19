var xlsx = require("xlsx");
var fs = require('fs');
var dataPathExcel = "cypress/fixtures/excel_data.xlsx"; //path to Excel file
var wb = xlsx.readFile(dataPathExcel);   //reading the Excel file into a workbook object (`wb`).

wb.SheetNames.forEach(function(sheetName) {  //loopimg through each sheet in excel file
    var sheetValue = wb.Sheets[sheetName];  //getting data of current sheet
    var excelData = xlsx.utils.sheet_to_json(sheetValue);    //converting the sheet to JSON file format
    var dataPathJson = "cypress/fixtures/";  //path where JSON file will be saved

    // Using the sheet name for the JSON file name
    fs.writeFile(`${dataPathJson}${sheetName}.json`, JSON.stringify(excelData), function(err) {
        if (err) {
            console.error("Error writing JSON for sheet: ", sheetName, err);
        } else {
            console.log(`${sheetName}.json file is created`);
        }
    });
});

// `${dataPathJson}${sheetName}.json` 
// Path of the JSON file to be created, where `${sheetName}` is the name of the current sheet.



//requirements: npm install xlsx in terminal