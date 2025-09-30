const { test, expect } = require('@playwright/test');
const { userFactory } = require('../../utils/dataFactory');
const env = require('../../utils/environment');
const { UserPage } = require('../../pages/UserPage');

const baseURL = env.get('BASE_URL', 'http://localhost:4000');
const error_message = "ERROR: name and email required";

test.describe('UI Tests - User Regestration', () => {

  test('User registration flow - Happy Path', async ({ page }) => {
    const user = userFactory();
    const userPage = new UserPage(page, baseURL);
    await userPage.createUser(user);
    // Wait for result text
    await expect(page.locator('#result')).toHaveText(/success/i);
    const resultText = await page.textContent('#result');
    expect(resultText).toMatch(/SUCCESS: [a-f0-9-]{36}/i);
  });

  test('User registration flow - Name missing', async ({ page }) => {
    await page.goto(baseURL);
    const user = userFactory();
    await page.fill('#name', "");
    await page.fill('#email', user.email);
    await page.selectOption('#accountType', user.accountType);
    await page.click('#register');
    await expect(page.locator('#result')).toHaveText(error_message);
  });

  test('User registration flow - Email missing', async ({ page }) => {
    await page.goto(baseURL);
    const user = userFactory();
    await page.fill('#name', user.name);
    await page.fill('#email', "");
    await page.selectOption('#accountType', user.accountType);
    await page.click('#register');
     // Wait for result text and verify the error message
    await expect(page.locator('#result')).toHaveText(error_message);
  });
  test('User registration flow - Name and Email missing', async ({ page }) => {
    await page.goto(baseURL);
    const user = userFactory();
    await page.fill('#name', "");
    await page.fill('#email', "");
    await page.selectOption('#accountType', user.accountType);
    await page.click('#register');
    await expect(page.locator('#result')).toHaveText(error_message);
  });
});