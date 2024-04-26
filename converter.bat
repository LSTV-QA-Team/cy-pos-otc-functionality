@echo off
setlocal

REM Prompt for the sheet name
set /p "sheetName=Enter the sheet name to convert to JSON: "

REM Check if a sheet name was provided
if "%sheetName%" == "" (
    echo No sheet name provided. Exiting...
    exit /b 1
)

REM Run the Node.js script with the specified sheet name
node xlsx_converter_to_json.js "%sheetName%"
