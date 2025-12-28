const jwt = require('jsonwebtoken');
const db = require('../../models');

// Middleware to verify JWT
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"
  
  if (token == null) {
    return res.status(401).json({ message: 'Unauthorized. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a-very-secret-key');
    
    console.log('JWT decoded:', {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });
    
    // Attach user to the request object
    const user = await db.User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'role', 'isActive', 'name']
    });
    
    if (!user) {
      console.error('User not found for ID:', decoded.id);
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }
    
    if (!user.isActive) {
      console.error('User is inactive:', decoded.id);
      return res.status(401).json({ message: 'Unauthorized. User account is inactive.' });
    }
    
    console.log('User authenticated:', {
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verification error:', {
      name: err.name,
      message: err.message
    });
    
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Forbidden. Token has expired.' });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Forbidden. Invalid token.' });
    }
    
    return res.status(403).json({ message: 'Forbidden. Token verification failed.' });
  }
};

// Middleware to check for specific roles
exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. No user in request.' });
    }
    
    if (!roles.includes(req.user.role)) {
      console.log('Authorization failed:', {
        userRole: req.user.role,
        requiredRoles: roles
      });
      return res.status(403).json({ 
        message: `Forbidden. User role '${req.user.role}' is not authorized for this action.` 
      });
    }
    
    next();
  };
};