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
        console.log("Created user ID:", userId);
        console.log("User response object:", body);
    });

    test.afterAll(async () => {
        await requestContext.dispose();
    });

    test('GET /api/users/:id - Happy Path-Testing with correct userid', async () => {
        const r = await requestContext.get(`/api/users/${userId}`);
        expect(r.status()).toBe(200);
        const fetchedUser = await r.json();
        //Assertions
        console.log("Fetched user:", fetchedUser); 
        assertUserShape(fetchedUser); // Verified the response body has all the expected values
        expect(fetchedUser.id).toBe(userId);
        expect(fetchedUser.email).toBe(payload.email);
        expect(fetchedUser.name).toBe(payload.name);
        expect(fetchedUser.accountType).toBe(payload.accountType);
    });

    test('GET /api/users/:id - User not found. Testing with an invalid userId', async () => {
        const res = await requestContext.get(`/api/users/${invalidUserId}`);
        expect(res.status()).toBe(404);
        const errorBody = await res.json();
        console.log("Error response:", errorBody);
        expect(errorBody).toHaveProperty('error')
        expect(errorBody.error).toBe("User not found");
    });
});