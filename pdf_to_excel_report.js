let fs = require("fs");
const pdfToExcelGenerator = require("pdf-to-excel");

let dirToCheck = "./cypress/downloads";
let files = fs.readdirSync(dirToCheck);

let latestPath = `${dirToCheck}/${files[0]}`;
let latestTimeStamp = fs.statSync(latestPath).mtime.getTime();

files.forEach((file) => {
  let path = `${dirToCheck}/${file}`;
  let timestamp = fs.statSync(path).mtime.getTime();

  if (timestamp > latestTimeStamp) {
    latestTimeStamp = timestamp;
    latestPath = path;
  }
});

console.log("Latest PDF Report FOund :", latestPath);

try {
  pdfToExcelGenerator.genXlsx(
    latestPath,
    "./cypress/fixtures/weekly_report.xlsx"
  );
} catch (err) {
  console.log("The error is: " + err);
}
