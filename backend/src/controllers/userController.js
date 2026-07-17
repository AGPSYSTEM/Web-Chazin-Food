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
    const { nombre, correo, email, contrase\u00f1a, contrasena, password, rol } = req.body;
    
    const targetEmail = correo || email;
    const targetPassword = contrase\u00f1a || contrasena || password;

    if (!nombre || !targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese todos los campos requeridos (nombre, correo, contrase\u00f1a)');
    }

    const userExists = await User.findByEmail(targetEmail);
    if (userExists) {
      res.status(400);
      throw new Error('El usuario ya existe');
    }

    const user = await User.create({
      nombre,
      correo: targetEmail,
      contrasena: targetPassword,
      rol: rol || 'Cliente'
    });

    if (user) {
      res.status(201).json({
        _id: user.idUsuario,
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        token: generateToken(user.idUsuario),
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
    const { correo, email, contrase\u00f1a, contrasena, password } = req.body;

    const targetEmail = correo || email;
    const targetPassword = contrase\u00f1a || contrasena || password;

    if (!targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese correo y contrase\u00f1a');
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
        _id: user.idUsuario,
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        token: generateToken(user.idUsuario),
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
    // req.user is populated by protect middleware
    if (req.user) {
      res.json(req.user);
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
    const userId = req.user.idUsuario || req.user._id;
    const { nombre, correo, email, contrase\u00f1a, contrasena, password } = req.body;

    const targetEmail = correo || email;
    const targetPassword = contrase\u00f1a || contrasena || password;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    // If changing email, make sure it's not taken
    if (targetEmail && targetEmail !== user.correo) {
      const userExists = await User.findByEmail(targetEmail);
      if (userExists) {
        res.status(400);
        throw new Error('El correo ya está registrado por otro usuario');
      }
    }

    const updatedUser = await User.update(userId, {
      nombre,
      correo: targetEmail,
      contrasena: targetPassword
    });

    res.json({
      _id: updatedUser.idUsuario,
      idUsuario: updatedUser.idUsuario,
      nombre: updatedUser.nombre,
      correo: updatedUser.correo,
      rol: updatedUser.rol,
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
