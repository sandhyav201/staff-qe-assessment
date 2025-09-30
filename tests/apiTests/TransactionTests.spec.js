// tests/api/transactions.spec.js
const { test, expect } = require('@playwright/test');
const { createRequestContext } = require('../../utils/apiClient');
const { userFactory, transactionFactory } = require('../../utils/dataFactory');
const { assertTransactionShape, assertUserShape } = require('../../utils/customAssertions');
const env = require('../../utils/environment');

test.describe('Transaction API', () => {
  let requestContext;
  const baseURL = env.get('BASE_URL', 'http://localhost:4000');
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    test.beforeAll(async () => {
      requestContext = await createRequestContext('http://localhost:4000', env.get('AUTH_TOKEN'));
    });
  
    test.afterAll(async () => {
      await requestContext.dispose();
    });

  test('Create transaction - success', async () => {
    // create a sender
    const userPayload = userFactory();
    const rUser = await requestContext.post('/api/users', { data: { name: userPayload.name, email: userPayload.email } });
    expect(rUser.status()).toBe(201);
    const sender = await rUser.json();
    const senderId = sender.id;
    console.log("Sender Id is : ",senderId);

    // create a recipient
    const userPayload1 = userFactory();
    const rUser1 = await requestContext.post('/api/users', { data: { name: userPayload1.name, email: userPayload1.email } });
    expect(rUser1.status()).toBe(201);
    const recipient = await rUser.json();
    const recId=recipient.id;
    console.log("Recipient Id is : ",recId);
    //Create transaction and do validations
    const resPayload = await requestContext.post('/api/transactions', { data: { userId: senderId, amount: 123.45,type: 'transfer', recipientId: recId  } });
    expect(resPayload.status()).toBe(201);
    const transactionBody = await resPayload.json();
    assertTransactionShape(transactionBody);
    console.log("The Transaction data is : ", transactionBody);
    expect(transactionBody.userId).toBe(sender.id);
    expect(transactionBody.amount).toBe(123.45);
    expect(transactionBody.type).toBe('transfer');
    expect(transactionBody.recipientId).toBe(recipient.id);
  });
  // attempting to create a transaction with invalid data
  test('Create transaction - validation error (missing fields)', async () => {
    const r = await requestContext.post('/api/transactions', { data: { amount: 'not-a-number' } });
    expect(r.status()).toBe(400);
    const body = await r.json();
    expect(body.error).toBeTruthy();
    expect(body.error).toBe('invalid payload')
  });
  //Get the transactions of a specific user
  test('Get user transactions - empty list or created items', async () => {
    const userPayload = userFactory();
    const ru = await requestContext.post('/api/users', { data: { name: userPayload.name, email: userPayload.email } });
    const user = await ru.json();

    // no transactions yet. Verify the test returns the number of transactions as 0
    const r = await requestContext.get(`/api/transactions/${user.id}`);
    expect(r.status()).toBe(200);
    const arr = await r.json();
    console.log('List of transactions for'+ user.name+'  is' , arr);
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBe(0);

    // create transaction. Verify the transactions for the given user is returned correctly
    await requestContext.post('/api/transactions', { data: transactionFactory({ userId: user.id, amount: 145.0 }) });
    const r2 = await requestContext.get(`/api/transactions/${user.id}`);
    const arr2 = await r2.json();
    console.log('List of transactions for'+ user.name+'  is' , arr);
    expect(arr2.length).toBeGreaterThanOrEqual(1);
  });
});