var xlsx = require("xlsx");
var fs = require("fs");

var dataPathExcel = "cypress/fixtures/weekly_report.xlsx";

var wb = xlsx.readFile(dataPathExcel);

for (let i = 0; i < wb.SheetNames.length; i++) {
  var sheetName = wb.SheetNames[i];
  var sheetValue = wb.Sheets[sheetName];
  var excelData = xlsx.utils.sheet_to_json(sheetValue);

  console.log(excelData);

  var dataPathJson = "cypress/fixtures/";

  fs.writeFile(
    dataPathJson + "excelToJsonSheet" + i + ".json",
    JSON.stringify(excelData),
    function (err) {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("JSON file is created successfully");
      }
    }
  );
}
