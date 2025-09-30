const { test, expect } = require('@playwright/test');
const { createRequestContext } = require('../../utils/apiClient');
const { userFactory } = require('../../utils/dataFactory');
const { assertUserShape } = require('../../utils/customAssertions');
const env = require('../../utils/environment');

test.describe('User API', () => {
    let requestContext;
    const baseURL = env.get('BASE_URL', 'http://localhost:4000');
    let userId;
    let payload;
    let invalidUserId = '125678-aaaa-bbcvbb-cccc-9998889999999';

    test.beforeAll(async () => {
        requestContext = await createRequestContext(baseURL, env.get('AUTH_TOKEN'));
        payload = userFactory();
        const res = await requestContext.post('/api/users', {
            data: {
                name: payload.name,
                email: payload.email,
                accountType: payload.accountType,
            },
        });
        expect(res.status()).toBe(201);
        const body = await res.json();
        userId = body.id;
    });

    test.afterAll(async () => {
        await requestContext.dispose();
    });

    test('DELETE /api/users/:id - Happy Path-Testing with correct userid', async () => {
        const get_before = await requestContext.get(`/api/users/${userId}`);
        expect(get_before.status()).toBe(200);
        const del = await requestContext.delete(`/api/users/${userId}`);
        expect(del.status()).toBe(200);
        const get_after = await requestContext.get(`/api/users/${userId}`);
        expect(get_after.status()).toBe(404);
    });

    test('DELETE /api/users/:id - not found. Testing with an invalid userId', async () => {
        const res = await requestContext.delete(`/api/users/${invalidUserId}`);
        expect(res.status()).toBe(404);
        const errorBody = await res.json();
        console.log("Error response:", errorBody);
        expect(errorBody).toHaveProperty('error')
        expect(errorBody.error).toBe("User not found");
    });
});