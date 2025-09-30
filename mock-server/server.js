// mock-server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
//const path = require('path');
const env = require('../utils/environment');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//const PORT = process.env.MOCK_PORT || 4000;
const PORT=env.get('MOCK_PORT',4000);
//,4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const USERS = new Map();         // id -> user
const TRANSACTIONS = [];         // array

// Authentication middleware: expects Authorization: Bearer token123
// auth middleware only for /api routes
app.use('/api', (req, res, next) => {
  const auth = req.header('authorization') || '';
  if (!auth.startsWith('Bearer ' + (process.env.AUTH_TOKEN || 'token123'))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.get('/health', (req, res) => res.json({ ok: true }));

// Create user
app.post('/api/users', (req, res) => {
  const { name, email, accountType } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email required' });
  }
  // duplicate email check
  for (const u of USERS.values()) if (u.email === email) return res.status(409).json({ error: 'email exists' });

  const id = uuidv4();
  const user = { id, name, email, accountType: accountType || 'standard', createdAt: new Date().toISOString() };
  USERS.set(id, user);
  return res.status(201).json(user);
});
// serve static files from public/
app.use(express.static('public'));
// Get user
app.get('/api/users/:id', (req, res) => {
  const user = USERS.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// DELETE /api/users/:id - Delete a user by ID
app.delete('/api/users/:id', (req, res) => {
  const user = USERS.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  console.log(`Deleting user: ${user.name} (id: ${user.id})`);

  const deletedUser = USERS.get(user.id);
  USERS.delete(user.id);
  res.json({ message: 'User deleted', user: deletedUser });
});

//PUT /api/users/:id -  Update a user by ID
app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const user = USERS.get(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email, accountType } = req.body;

  // Update only the fields provided
  const updatedUser = {
    ...user,
    ...(name && { name }),
    ...(email && { email }),
    ...(accountType && { accountType }),
  };

  USERS.set(id, updatedUser);

  //res.json({ message: 'User updated', user: updatedUser });
  res.json(updatedUser);
});




// Create transaction
app.post('/api/transactions', (req, res) => {
  console.log("Server yyyyyy:");
  const { userId, amount, type, recipientId } = req.body || {};
  if (!userId || typeof amount !== 'number' || !type) {
    return res.status(400).json({ error: 'invalid payload' });
  }
  if (!USERS.has(userId)) return res.status(422).json({ error: 'user not found' });

  const tx = {
    //id: uuidv4(),
    userId,
    amount,
    type,
    recipientId: recipientId || null,
    createdAt: new Date().toISOString()
  };
  TRANSACTIONS.push(tx);
  console.log("Server returning tx:", tx);
  return res.status(201).json(tx);
});

// Get user transactions
app.get('/api/transactions/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!USERS.has(userId)) return res.status(404).json({ error: 'user not found' });
  const items = TRANSACTIONS.filter(t => t.userId === userId);
  res.json(items);
});
// Exportable start function

function startServer() {
  return new Promise(resolve => {
    const server = app.listen(PORT, () => {
      resolve(server);
    });
  });
} 
// If run directly → start server

if (require.main === module) {
  startServer();
} 

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Use Authorization: Bearer token123 for requests');
});
module.exports = { startServer };


