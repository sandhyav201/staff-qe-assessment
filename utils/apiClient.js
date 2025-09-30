// utils/apiClient.js
const { request } = require('@playwright/test');

async function createRequestContext(baseURL, token = 'token123') {
  return await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

module.exports = { createRequestContext };