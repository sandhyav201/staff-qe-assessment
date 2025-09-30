const { defineConfig } = require('@playwright/test');
const env = require('./utils/environment'); // works with module.exports
//import dotenv from 'dotenv';
//dotenv.config();


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  timeout: 150 * 1000,
  expect: {
    timeout: 20 * 1000,
  },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list', { printSteps: true }],
    ['allure-playwright'] ,// allure reporting
    ['html', { outputFolder: 'playwright-results/html-report', open: 'never' }],
    ['junit', { outputFile: 'playwright-results/results.xml' }],
    ['json', { outputFile: 'playwright-results/results.json' }],
    ['blob', { outputDir: 'playwright-results/blob-report' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: env.get('BASE_URL', 'http://localhost:4000'),
   // extraHTTPHeaders: {
   //   Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
   // },

    headless: false, // run headed by default (optional)

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    screenshot: 'only-on-failure',//capture screenshots on failure
    video: 'retain-on-failure', //capture video on failure
    timeout: 30000, // global timeout
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    //command: 'node mock-server/server.js',   //start your Express server
    
    command: `ENV=${process.env.ENV || 'local'} node mock-server/server.js`,
    //port: 4000,
    port: Number(env.get('MOCK_PORT')),
    reuseExistingServer: !process.env.CI, // don’t start if already running
    timeout: 30_000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});

