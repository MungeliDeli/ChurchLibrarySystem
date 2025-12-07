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
    
    // Attach user to the request object
    req.user = await db.User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'role', 'isActive']
    });

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }
    
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden. Invalid token.' });
  }
};

// Middleware to check for specific roles
exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden. User role '${req.user.role}' is not authorized for this action.` });
    }
    next();
  };
};
