var xlsx = require("xlsx")
var fs = require('fs')
var dataPathExcel = "cypress/fixtures/hris_url.xlsx"   //change workbook path
var wb = xlsx.readFile(dataPathExcel)
for (let i=0;i<wb.SheetNames.length;i++){
    var sheetName = wb.SheetNames[i]
    var sheetValue = wb.Sheets[sheetName];
    var excelData = xlsx.utils.sheet_to_json(sheetValue)
    console.log(excelData)
    var dataPathJson = "cypress/fixtures/"
    fs.writeFile(dataPathJson+"excelToJsonSheet"+i+".json",JSON.stringify(excelData),function(err){
        console.log("Json file is created")
    })
}


//requirements: npm install xlsx in terminal