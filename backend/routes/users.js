const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const { authMiddleware, roleCheck } = require('../middleware/auth');

const USERS_FILE = path.join(__dirname, '../users.json');

// Helper function to read users
async function getUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write users
async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    console.log('🔐 Login attempt:', { username, role, hasPassword: !!password });
    
    // Validation
    if (!username || !password || !role) {
      console.log('❌ Login failed: Missing required fields');
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }
    
    const users = await getUsers();
    console.log('👥 Available users:', users.map(u => ({ username: u.username, role: u.role })));
    
    // Find user by username and role
    const user = users.find(u => u.username === username && u.role === role);
    if (!user) {
      console.log('❌ Login failed: User not found', { username, role });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ User found:', { id: user.id, username: user.username, role: user.role });
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ Password validated for user:', username);
    
    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('🎫 Token generated for user:', username);
    
    const responseData = { 
      token, 
      user: { id: user.id, username: user.username, role: user.role } 
    };
    
    console.log('✅ Login successful:', { username, role });
    res.json(responseData);
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const users = await getUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;