// index.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// Mock user data for demonstration
const mockUser = {
    username: 'testuser',
    password: 'password123' // In a real application, use hashed passwords
  };
  
  // POST /api/auth/login
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === mockUser.username && password === mockUser.password) {
      res.status(200).json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
  

  const bcrypt = require('bcrypt');

// Hashing passwords before saving
const hashedPassword = bcrypt.hashSync('password123', 10);

// Verifying passwords
bcrypt.compareSync('password123', hashedPassword); // true


// Mock expense data
let expenses = [];

// GET /api/expenses
app.get('/api/expenses', (req, res) => {
  res.status(200).json(expenses);
});

// POST /api/expenses
app.post('/api/expenses', (req, res) => {
  const { description, amount } = req.body;
  const newExpense = { id: expenses.length + 1, description, amount };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// PUT /api/expenses/:id
app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { description, amount } = req.body;
  let expense = expenses.find(exp => exp.id === parseInt(id));
  
  if (expense) {
    expense.description = description;
    expense.amount = amount;
    res.status(200).json(expense);
  } else {
    res.status(404).json({ message: 'Expense not found' });
  }
});

// DELETE /api/expenses/:id
app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  expenses = expenses.filter(exp => exp.id !== parseInt(id));
  res.status(204).send();
});


// GET /api/expense
app.get('/api/expense', (req, res) => {
    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.status(200).json({ totalExpense });
  });
  
  const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret';

// Issue JWT Token
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === mockUser.username && password === mockUser.password) {
    const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Apply middleware to protected routes
app.use('/api/expenses', authenticateToken);
