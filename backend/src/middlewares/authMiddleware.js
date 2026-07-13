const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforchazinfood');

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-contrase\u00f1a');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, sin token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.rol)) {
      next();
    } else {
      res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
    }
  };
};

module.exports = { protect, authorize };
