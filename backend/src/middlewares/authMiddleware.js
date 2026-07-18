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

      // Get user from database (decoded.id is stored in jwt)
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      // Check if user is active (supports both enum strings and legacy numeric statuses)
      if (user.estado === 'INACTIVO' || user.estado === 0 || user.estado === '0') {
        return res.status(401).json({ message: 'No autorizado, esta cuenta ha sido desactivada' });
      }

      // Get user from the token (exclude password)
      const { contrasena, contraseña, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;

      next();
    } catch (error) {
      console.error('Error en autenticación de token:', error.message);
      res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, sin token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user && req.user.rol) {
      const userRol = req.user.rol.toLowerCase();
      const allowedRoles = roles.map(role => role.toLowerCase());
      
      if (allowedRoles.includes(userRol)) {
        next();
      } else {
        res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
      }
    } else {
      res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
    }
  };
};

module.exports = { protect, authorize };
