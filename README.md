
## Project Overview

This project demonstrates end-to-end test automation using Playwright for a mock web application API and UI for a Fintech company . It includes:

 API tests (CRUD operations)

 UI tests (happy paths and edge cases)

 Authentication handling

 Multiple reporters 

 Below is the folder structure for the project

 STAFF-QE-ASSESSMENT/
│── mock-server/                 # Mock API server
│   └── server.js
│
│── pages/                       # Page Object classes for UI tests
│   ├── TransactionPage.js
│   └── UserPage.js
│
│── public/                      # html file for a simple UI
│   └── index.html
│
│── tests/                       # Test suites
│   ├── apiTests/                # API test cases
│   └── uiTests/                 # UI test cases
│
│── utils/                       # Utilities & configuration
│   ├── dataFactory.js           # Factories for generating test data (users, transactions, etc.)
│   ├── environment.js           # Loads environment variables from .env files
│   ├── .env.local               # Local environment variables
│   ├── .env.dev                 # Development environment variables
│   ├── .env.staging             # Staging environment variables
│   ├── .env.ci                  # CI environment variables
│   
│
│── package.json                 # Project dependencies & scripts
│── playwright.config.js         # Playwright configuration
└── README.md                    # Project documentation



## Tech Stack
Language: JavaScript / Node.js
Test Framework: Playwright Test
Reporting: Allure, List, HTML, JSON, Blob, JUnit
Mock Server: Express.js

## Prerequisites

2. [NodeJs](https://nodejs.org/en/download)
5. [VSCode](https://code.visualstudio.com/download)

## SetUp
From zip file :
Download the staff-qe-assessment.zip file. Extract it to a folder, e.g., C:\staff-qe-assessment or /Users/yourname/staff-qe-assessment
    OR
From Git Repository
Clone the repo : https://github.com/sandhyav201/staff-qe-assessment

1. cd into this staff-qe-assessment directory.
2. Run 'npm install' - This installs all Node.js dependencies listed in package.json, including Playwright and any reporters like Allure.
3. Install Playwright browsers: : npx playwright install
This ensures Chromium, Firefox, and WebKit are installed for testing.
4. Set up VSCode

## Running Tests

Use the following commands to run tests 

1. Run all tests:    npx playwright test

2. Run a specific test file:     npx playwright test tests/uiTests/createUserTest.spec.js

3. Run in headed mode (UI visible):    npx playwright test --headed   (headless mode is set to false in playwright.config.js. 
So by default tests will run in headed mode)

4. Run in interactive UI mode:  npx playwright test --ui

## Running Tests in different test environments 

  This test suite can be executed on different test environments, ci,dev,local, staging and prod. 
  .env files are created under /utils folder to manage configuration for different environments.
  eg: .env.local 

      ENV=local
      BASE_URL=http://localhost:4000
      MOCK_PORT=4000
      AUTH_TOKEN=token123

ENV → The environment name (in this case, ci). This determines which .env file is loaded.
BASE_URL → The base URL of the application under test.
MOCK_PORT → Port where the local mock server runs.
AUTH_TOKEN → Token required for authenticating API request

Check the `scripts` section in `package.json` file to see how to run tests.
"scripts": {
    "test:local": "npx playwright test",
    "test:dev": "ENV=dev npx playwright test",
    "test:relQA": "ENV=relQA npx playwright test",
    "test:ui:createUser": "ENV=relQA npx playwright test tests/uiTests/CreateUserTest.spec.js"
  }

## Usage 

By default, tests run with .env.local.
To run against CI environment, set ENV=ci before executing Playwright tests:
eg:
ENV=ci npx playwright test
This ensures the framework loads configuration from .env.ci and applies the correct base URL, mock server port, and authentication token.

Important Note : .env.local only will work now for executing the tests . All the other .env files are loaded with mock test data. 

## Report Generation
Reporter	  Output Location	                        How to View

List	      Terminal	                                Automatic during test run

Allure        allure-results/                           npx allure generate ./allure-results --clean -o ./allure-report
                                                        npx allure open ./allure-report

HTML	      playwright-results/html-report	        npx playwright show-report playwright-results/html-report

JSON	      playwright-results/results.json	        Open in editor or parse programmatically

JUnit	      playwright-results/results.xml	        CI dashboards (Jenkins, GitLab, etc.)

Blob	      playwright-results/blob-report	        npx playwright show-report playwright-results/blob-report


Allure reporting is installed for this test framework to generate a visual, interactive and detailed reports for automated tests.
Steps to see the allure report at the end of the tests:
1. Run Playwright tests - npx playwright test.
2. Once tests completed , Allure results will be stored in the default folder : allure-results
3. Generate and open the reports by executing the following command sequentially:

npx allure generate ./allure-results --clean -o ./allure-report
npx allure open ./allure-report

Short cuts are added to the Package.json for easier running :

"allure:generate": "npx allure generate ./allure-results --clean -o ./allure-report",
"allure:open": "npx allure open ./allure-report",
"test:allure": "npx playwright test && npx allure generate ./allure-results --clean -o ./allure-report && npx allure open ./allure-report"

 npm run test:allure - This will execute script, generate the allure report and open it in browser in one single step.