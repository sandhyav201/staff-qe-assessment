
const { test, expect } = require('@playwright/test');
const { createRequestContext } = require('../../utils/apiClient');
const { userFactory } = require('../../utils/dataFactory');
const { assertUserShape } = require('../../utils/customAssertions');
const env = require('../../utils/environment');

test.describe('User API', () => {
  let requestContext;
  const baseURL = env.get('BASE_URL', 'http://localhost:4000');
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  test.beforeAll(async () => {
    requestContext = await createRequestContext(baseURL, env.get('AUTH_TOKEN'));
  });

  test.afterAll(async () => {
    await requestContext.dispose();
  });

  test('POST /api/users - success', async () => {
    const payload = userFactory();
    const res = await requestContext.post('/api/users', { data: { name: payload.name, email: payload.email, accountType: payload.accountType } });
    expect(res.status()).toBe(201);
    const body = await res.json();
    console.log("User response object:", body);
    assertUserShape(body);
    expect(body.id).toMatch(uuidV4Regex); // checking if the created id is valid UUID
    expect(body.name).toBe(payload.name);
    expect(body.email).toBe(payload.email);
    expect(body.accountType).toBe(payload.accountType);
  });

  test('POST /api/users - validation error (missing name)', async () => {
    const res = await requestContext.post('/api/users', { data: { email: 'abcd@example.com' } });
    expect([400]).toContain(res.status());
    const body = await res.json();
    expect(body.error).toBeTruthy();
    expect(body.error).toBe('name and email required');
  });


  test('POST /api/users - validation error (missing email)', async () => {
    const res = await requestContext.post('/api/users', { data: { name: 'Test User1' } });
    expect([400]).toContain(res.status());
    const body = await res.json();
    expect(body.error).toBeTruthy();
    expect(body.error).toBe('name and email required');
  });

  test('POST /api/users - validation error (missing name and email)', async () => {
    const res = await requestContext.post('/api/users', { data: { accountType: 'Premium' } });
    expect([400]).toContain(res.status());
    const body = await res.json();
    expect(body.error).toBeTruthy();
    expect(body.error).toBe('name and email required');
  });

  test('POST /api/users - duplicate email -> 409', async () => {
    const p = userFactory();
    const res1 = await requestContext.post('/api/users', { data: { name: p.name, email: p.email } });
    expect(res1.status()).toBe(201);
    // Attempting to create user again with the same email
    const res2 = await requestContext.post('/api/users', { data: { name: 'Test User2', email: p.email } });
    expect(res2.status()).toBe(409);
    const body = await res2.json();
    expect(body.error).toBe('email exists');
  });
});