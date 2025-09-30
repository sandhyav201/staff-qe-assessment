// tests/api/users.spec.js
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
    let updatedName = 'Mary Bill';

    test.beforeAll(async () => {
        requestContext = await createRequestContext('http://localhost:4000', env.get('AUTH_TOKEN'));
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
        console.log("User Before Update :", body);
    });

    test.afterAll(async () => {
        await requestContext.dispose();
    });

    // User is updated with a new Name and Account Type
    test('PUT /api/users/:id - Happy Path-Testing with correct userid', async () => {
        const updateRes = await requestContext.put(`/api/users/${userId}`, {
            data: {
                name: updatedName,
                email: payload.email,
                accountType: 'standard',
            }
        });
        expect(updateRes.status()).toBe(200);
        expect(updateRes.ok()).toBeTruthy();
        const updatedUser = await updateRes.json();
        //Assertions
        console.log("Updated user:", updatedUser); // user data after update
        assertUserShape(updatedUser); //validation of the response data 
        expect(updatedUser.id).toBe(userId);
        expect(updatedUser.email).toBe(payload.email);
        expect(updatedUser.name).toBe(updatedName);
        expect(updatedUser.accountType).toBe("standard");
    });

});