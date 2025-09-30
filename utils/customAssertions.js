// utils/customAssertions.js
function assertUserShape(user) {
    if (!user || !user.id || !user.email || !user.name) {
      throw new Error(`User shape invalid: ${JSON.stringify(user)}`);
    }
  }
  
  function assertTransactionShape(transaction) {
    if (!transaction || !transaction.userId || typeof transaction.amount !== 'number') {
      throw new Error(`Transaction shape invalid: ${JSON.stringify(transaction)}`);
    }
  }
  
  module.exports = { assertUserShape, assertTransactionShape };