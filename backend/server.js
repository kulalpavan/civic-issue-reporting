require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// Import routes
const userRoutes = require('./routes/users');
const issueRoutes = require('./routes/issues');

const app = express();
// Get port from environment (Railway sets this automatically)
const PORT = process.env.PORT || 5000;

console.log('Starting server...');
console.log('PORT from env:', process.env.PORT);
console.log('Final PORT:', PORT);

// Enhanced CORS configuration
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Add detailed logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`, {
    headers: { authorization: req.headers.authorization ? 'Bearer ***' : undefined },
    body: req.method !== 'GET' && req.body ? JSON.stringify(req.body).substring(0, 100) : undefined,
    query: Object.keys(req.query).length > 0 ? req.query : undefined
  });
  next();
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = 'uploads/';
    // Create uploads directory if it doesn't exist
    require('fs').mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Helper functions for JSON file operations
async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeJsonFile(filename, data) {
  await fs.writeFile(filename, JSON.stringify(data, null, 2));
}

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Civic Issue Reporting System API' });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    hasJWT: !!process.env.JWT_SECRET
  });
});

// API test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API routes working',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
  console.log(`\n📱 Access from other devices on your network:`);
  console.log(`   http://10.219.88.162:${PORT}`);
  console.log(`\n💻 Local access:`);
  console.log(`   http://localhost:${PORT}`);
});

module.exports = app;