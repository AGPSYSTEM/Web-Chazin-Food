const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforchazinfood', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const {
      nombre,
      apellido,
      correo,
      email,
      contraseña,
      contrasena,
      password,
      rol_id,
      idRol,
      rol,
      telefono,
      imagen
    } = req.body;
    
    const targetEmail = email || correo;
    const targetPassword = contraseña || contrasena || password;

    if (!nombre || !targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese todos los campos requeridos (nombre, email, contrasena)');
    }

    const userExists = await User.findByEmail(targetEmail);
    if (userExists) {
      res.status(400);
      throw new Error('El usuario ya existe');
    }

    const user = await User.create({
      nombre,
      apellido,
      email: targetEmail,
      contrasena: targetPassword,
      rol_id,
      idRol,
      rol,
      telefono,
      imagen
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        idUsuario: user.id, // Backward compatibility
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        correo: user.email, // Backward compatibility
        rol_id: user.rol_id,
        rol: user.rol,
        telefono: user.telefono,
        imagen: user.imagen,
        estado: user.estado,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error('Información de usuario inválida');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { correo, email, contraseña, contrasena, password } = req.body;

    const targetEmail = email || correo;
    const targetPassword = contraseña || contrasena || password;

    if (!targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese email y contrase\u00f1a');
    }

    const user = await User.findByEmail(targetEmail);

    if (!user) {
      res.status(401);
      throw new Error('Correo o contrase\u00f1a incorrectos');
    }

    if (user.estado === 0) {
      res.status(401);
      throw new Error('Esta cuenta ha sido desactivada');
    }

    const isMatch = await user.matchPassword(targetPassword);
    if (isMatch) {
      res.json({
        _id: user.id,
        idUsuario: user.id, // Backward compatibility
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        correo: user.email, // Backward compatibility
        rol_id: user.rol_id,
        rol: user.rol,
        telefono: user.telefono,
        imagen: user.imagen,
        estado: user.estado,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error('Correo o contrase\u00f1a incorrectos');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    if (req.user) {
      res.json({
        _id: req.user.id,
        idUsuario: req.user.id, // Backward compatibility
        id: req.user.id,
        nombre: req.user.nombre,
        apellido: req.user.apellido,
        email: req.user.email,
        correo: req.user.email, // Backward compatibility
        rol_id: req.user.rol_id,
        rol: req.user.rol,
        telefono: req.user.telefono,
        imagen: req.user.imagen,
        estado: req.user.estado,
      });
    } else {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.idUsuario || req.user._id;
    const {
      nombre,
      apellido,
      correo,
      email,
      contraseña,
      contrasena,
      password,
      rol_id,
      idRol,
      rol,
      telefono,
      imagen
    } = req.body;

    const targetEmail = email || correo;
    const targetPassword = contraseña || contrasena || password;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    if (targetEmail && targetEmail !== user.email) {
      const userExists = await User.findByEmail(targetEmail);
      if (userExists) {
        res.status(400);
        throw new Error('El correo ya está registrado por otro usuario');
      }
    }

    const updatedUser = await User.update(userId, {
      nombre,
      apellido,
      email: targetEmail,
      contrasena: targetPassword,
      rol_id,
      idRol,
      rol,
      telefono,
      imagen
    });

    res.json({
      _id: updatedUser.id,
      idUsuario: updatedUser.id, // Backward compatibility
      id: updatedUser.id,
      nombre: updatedUser.nombre,
      apellido: updatedUser.apellido,
      email: updatedUser.email,
      correo: updatedUser.email, // Backward compatibility
      rol_id: updatedUser.rol_id,
      rol: updatedUser.rol,
      telefono: updatedUser.telefono,
      imagen: updatedUser.imagen,
      estado: updatedUser.estado,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate user account
// @route   DELETE /api/users/profile
// @access  Private
const deactivateUser = async (req, res, next) => {
  try {
    const userId = req.user.idUsuario || req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    await User.deactivate(userId);
    res.json({ message: 'Cuenta desactivada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deactivateUser,
};
