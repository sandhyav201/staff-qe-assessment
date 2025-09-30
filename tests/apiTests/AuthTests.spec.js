const { test, expect } = require('@playwright/test');
const { createRequestContext } = require('../../utils/apiClient');
const { userFactory } = require('../../utils/dataFactory');
const env = require('../../utils/environment');

test.describe('User API', () => {
    let requestContext;
    const payload = userFactory();
    let body;
    let userId;
    const baseURL = env.get('BASE_URL', 'http://localhost:4000');
    const uuidV4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    test.beforeAll(async () => {
        requestContext = await createRequestContext(baseURL, env.get('AUTH_TOKEN'));
        const res = await requestContext.post('/api/users', { data: payload });
        body = await res.json();
        userId = body.id
        console.log('Created user ID:', userId);
    });

    test.afterAll(async () => {
        await requestContext.dispose();
    });


     // Test to verify Authentication fails with wrong token
     test('Authentication - Happy Path. GET users API passess with correct token ', async () => {
        const r = await requestContext.get(`/api/users/${userId}`);
        expect(r.status()).toBe(200);
        const body = await r.json();
        expect(body.id).toBe(userId);
    });

    // Test to verify Authentication fails with wrong token
    test('Authentication with wrong token should return 401', async () => {
        // Create a new context with wrong token
        const badReqContext = await createRequestContext(baseURL, 'badtoken');
        const r = await badReqContext.get(`/api/users/${userId}`);
        expect(r.status()).toBe(401);
        const body = await r.json();
        expect(body.error).toBe('Unauthorized');
        await badReqContext.dispose();
    });
        // Test to verify Authentication fails with empty token
        test('Authentication with empty token should return 401', async () => {
            // Create a new context with empty token
            const badReqContext = await createRequestContext(baseURL, ' ');
            const r = await badReqContext.get(`/api/users/${userId}`);
            expect(r.status()).toBe(401);
            const body = await r.json();
            expect(body.error).toBe('Unauthorized');
            await badReqContext.dispose();
        });
});