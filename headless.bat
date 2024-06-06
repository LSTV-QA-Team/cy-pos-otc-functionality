@echo off
setlocal

REM Base path for Cypress test files
set basePath="cypress/e2e/tests/"

REM Prompt for the spec file to run
set /p "specFile=Enter the spec file name (or type 'ALL' to run all tests): "

REM Check if the user wants to run all tests
if /i "%specFile%" == "ALL" (
    echo Running all Cypress test files...
    REM Run Cypress in headless mode without specifying a spec
    npx cypress run --headless
    exit /b 0
)

REM If no spec file is provided, print an error and exit
if "%specFile%" == "" (
    echo No spec file provided. Exiting...
    exit /b 1
)

REM Construct the full path
set fullSpecPath=%basePath%%specFile%

REM Run Cypress in headless mode with the constructed path
npx cypress run --browser chrome --spec %fullSpecPath%

