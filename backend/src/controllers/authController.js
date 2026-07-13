const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforchazinfood', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { nombre, correo, contrase\u00f1a, rol } = req.body;

    const userExists = await User.findOne({ correo });

    if (userExists) {
      res.status(400);
      throw new Error('El usuario ya existe');
    }

    const user = await User.create({
      nombre,
      correo,
      contrase\u00f1a,
      rol: rol || 'cliente',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        token: generateToken(user._id),
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
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { correo, contrase\u00f1a } = req.body;

    const user = await User.findOne({ correo });

    if (user && (await user.matchPassword(contrase\u00f1a))) {
      res.json({
        _id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Correo o contraseña incorrectos');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      });
    } else {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
};
