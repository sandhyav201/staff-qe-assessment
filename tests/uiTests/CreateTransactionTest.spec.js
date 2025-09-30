const { test, expect } = require('@playwright/test');
const { startServer } = require('../../mock-server/server');
const { userFactory, transactionFactory } = require('../../utils/dataFactory');
const { createRequestContext } = require('../../utils/apiClient');
const env = require('../../utils/environment');
const { TransactionPage } = require('../../pages/TransactionPage');

let server;
const baseURL = env.get('BASE_URL', 'http://localhost:4000');
let senderId;
let recipientId;
let requestContext;

test.beforeAll(async () => {
    //server = await startServer();
    requestContext = await createRequestContext(baseURL, env.get('AUTH_TOKEN'));
    const userPayload = userFactory();
    const senderUser = await requestContext.post('/api/users', { data: { name: userPayload.name, email: userPayload.email } });
    expect(senderUser.status()).toBe(201);
    const senderData = await senderUser.json();
    senderId = senderData.id;
    // create a recipient
    const userPayload1 = userFactory();
    const recipientUser = await requestContext.post('/api/users', { data: { name: userPayload1.name, email: userPayload1.email } });
    expect(recipientUser.status()).toBe(201);
    recipientId = await recipientUser.json().id;
    const recipientData = await senderUser.json();
    recipientId = recipientData.id;
});

test.afterAll(async () => {
   // server.close();
});

test.describe('Create Transaction Tests ', () => {

    test('Transaction creation flow - Happy Path', async ({ page}) => {
        await page.goto(baseURL);
        const transaction = transactionFactory();
        console.log(transaction);
        await page.fill('#userId', senderId);
        await page.fill('#amount', (transaction.amount).toString());
        await page.selectOption('#type', transaction.type);
        await page.fill('#recipientId', recipientId);
        await page.click('#send');
        await page.waitForSelector('#msg');
        const msg = await page.textContent('#msg');
        expect(msg).toMatch(/Ok/i);
    });

    test('Transaction creation flow - shows error on invalid payload(User not existing)', async ({ page, baseURL }) => {
        await page.goto(baseURL);
        const transaction = transactionFactory(); 
        // sender and recipient data is created, but actual user is not created.So userIds do not exists
        await page.fill('#userId', transaction.userId);
        await page.fill('#amount', (transaction.amount).toString());
        await page.selectOption('#type', transaction.type);
        await page.fill('#recipientId', transaction.recipientId);
        await page.click('#send');
        await page.waitForSelector('#msg');
        const msg = await page.textContent('#msg');
        expect(msg).toMatch(/ERR:/);
    });
    test('Transaction with invalid user IDs shows error', async ({ page }) => {
        const transaction = transactionFactory(); 
        // sender and recipient data is created, but actual user is not created.So userIds do not exists   
        const transactionPage = new TransactionPage(page, baseURL);
        const msg = await transactionPage.createTransaction(transaction);
        expect(msg).toMatch(/ERR: user not found/);
      });
});