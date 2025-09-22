const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('❌ Auth failed: No Authorization header');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      console.log('❌ Auth failed: Invalid token format');
      return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    console.log('✅ Auth successful for user:', decoded.username);
    next();
  } catch (error) {
    console.log('❌ Auth failed:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please log in again.' });
    }
    res.status(401).json({ error: 'Access denied. Please authenticate.' });
  }
};

const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('❌ Role check failed: No user in request');
      return res.status(401).json({ error: 'Authentication required.' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      console.log('❌ Role check failed:', { userRole: req.user.role, allowedRoles });
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    
    console.log('✅ Role check passed:', { userRole: req.user.role, allowedRoles });
    next();
  };
};

module.exports = { authMiddleware, roleCheck };