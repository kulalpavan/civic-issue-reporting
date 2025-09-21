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
// Railway provides PORT as a string, convert to integer with validation
const PORT = (() => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  if (isNaN(port) || port < 0 || port > 65535) {
    console.log('Invalid PORT, using default 5000');
    return 5000;
  }
  return port;
})();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://10.219.88.162:5173',
    'https://vercel.app',
    'https://*.vercel.app',
    /https:\/\/.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body ? JSON.stringify(req.body).substring(0, 100) : '');
  next();
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} (type: ${typeof PORT})`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`JWT_SECRET configured: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log('🚀 Production server running!');
    console.log('📡 API accessible globally via cloud deployment');
  } else {
    console.log(`Local access: http://localhost:${PORT}`);
    console.log(`Network access: http://[YOUR_IP_ADDRESS]:${PORT}`);
    console.log('To find your IP address, run: ipconfig (Windows) or ifconfig (Mac/Linux)');
  }
}).on('error', (err) => {
  console.error('Server startup error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});