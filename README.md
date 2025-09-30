# Staff QE Assessment

End-to-end test automation framework built with **Playwright** for a mock FinTech web application (API + UI).

---

## 📌 Project Overview
This project demonstrates:
- ✅ API tests (CRUD operations)  
- ✅ UI tests (happy paths & edge cases)  
- ✅ Authentication handling  
- ✅ Multiple reporters (Allure, HTML, JSON, etc.)  

---

## 📂 Folder Structure


STAFF-QE-ASSESSMENT/
│── mock-server/ # Mock API server
│ └── server.js
│
│── pages/ # Page Object classes for UI tests
│ ├── TransactionPage.js
│ └── UserPage.js
│
│── public/ # Simple UI (HTML file)
│ └── index.html
│
│── tests/ # Test suites
│ ├── apiTests/ # API test cases
│ └── uiTests/ # UI test cases
│
│── utils/ # Utilities & configuration
│ ├── dataFactory.js # Test data factories (users, transactions, etc.)
│ ├── environment.js # Loads environment variables from .env files
│ ├── .env.local # Local environment variables
│ ├── .env.dev # Development environment variables
│ ├── .env.staging # Staging environment variables
│ ├── .env.ci # CI environment variables
│
│── package.json # Project dependencies & scripts
│── playwright.config.js # Playwright configuration
└── README.md # Project documentation


---

## ⚙️ Tech Stack
- **Language**: JavaScript / Node.js  
- **Test Framework**: Playwright Test  
- **Reporting**: Allure, List, HTML, JSON, Blob, JUnit  
- **Mock Server**: Express.js  

---

## 🔧 Prerequisites
- [Node.js](https://nodejs.org/en/download)  
- [VS Code](https://code.visualstudio.com/download)  

---

## 🚀 Setup

### Option 1: From ZIP
1. Download `staff-qe-assessment.zip`  
2. Extract to a folder (e.g., `C:\staff-qe-assessment` or `/Users/yourname/staff-qe-assessment`)  

### Option 2: From GitHub
```bash
git clone https://github.com/sandhyav201/staff-qe-assessment
cd staff-qe-assessment


## Running Tests

Use the following commands to run tests 

1. Run all tests:    npx playwright test
2. Run a specific test file:     npx playwright test tests/uiTests/createUserTest.spec.js
3. Run in headed mode (UI visible):    npx playwright test --headed   (headless mode is set to false in playwright.config.js. 
So by default tests will run in headed mode)
4. Run in interactive UI mode:  npx playwright test --ui

Install Dependencies
npm install
npx playwright install

🧪 Running Tests
npx playwright test
Run a specific test:
npx playwright test tests/uiTests/CreateUserTest.spec.js

Run in headed mode (UI visible):
npx playwright test --headed

Run in interactive UI mode:
npx playwright test --ui

🌎 Running in Different Environments

Configurations are managed via .env files in /utils. Example .env.local:

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

Scripts in package.json:
"scripts": {
  "test:local": "npx playwright test",
  "test:dev": "ENV=dev npx playwright test",
  "test:relQA": "ENV=relQA npx playwright test",
  "test:ui:createUser": "ENV=relQA npx playwright test tests/uiTests/CreateUserTest.spec.js"
}

Usage 

To run against CI environment, set ENV=ci before executing Playwright tests:
eg:   ENV=ci npx playwright test
This ensures the framework loads configuration from .env.ci and applies the correct base URL, mock server port, and authentication token.

👉 By default, .env.local is used. Other .env files contain mock test data. So cannot be executed at this point.

📊 Reporting

| Reporter | Output Location                      | View Command                                                |
| -------- | ------------------------------------ | ----------------------------------------------------------- |
| List     | Terminal                             | Automatic                                                   |
| Allure   | `allure-results/` → `allure-report/` | `npx allure open ./allure-report`                           |
| HTML     | `playwright-results/html-report`     | `npx playwright show-report playwright-results/html-report` |
| JSON     | `playwright-results/results.json`    | Open in editor                                              |
| JUnit    | `playwright-results/results.xml`     | CI dashboards (Jenkins, GitLab, etc.)                       |
| Blob     | `playwright-results/blob-report`     | `npx playwright show-report playwright-results/blob-report` |



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
