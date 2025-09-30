// utils/factories.js
const { v4: uuidv4 } = require('uuid');

function userFactory(overrides = {}) {
  const unique = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return {
    name: overrides.name || `User ${unique}`,
    email: overrides.email || `user-${unique}@example.com`,
    accountType: overrides.accountType || 'premium'
  };
}

function transactionFactory(overrides = {}) {
  return {
    userId: overrides.userId || uuidv4(),
    amount: overrides.amount !== undefined ? overrides.amount : 100.5,
    type: overrides.type || 'transfer',
    recipientId: overrides.recipientId || uuidv4(),
  };
}

module.exports = { userFactory, transactionFactory };