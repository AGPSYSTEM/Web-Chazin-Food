const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (idUsuario) => {
  return jwt.sign({ id: idUsuario }, process.env.JWT_SECRET || 'supersecretjwtkeyforchazinfood', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const {
      nombre,
      apellidos,
      apellido,
      tipoDocumento,
      documento,
      telefono,
      email,
      correo,
      contrasena,
      contraseña,
      password,
      idRol,
      rol_id,
      id_rol,
      rol
    } = req.body;

    const targetEmail = email || correo;
    const targetPassword = contrasena || contraseña || password;
    const targetApellidos = apellidos || apellido;
    const targetDocumento = tipoDocumento || documento;
    const targetRolId = idRol || rol_id || id_rol;

    if (!nombre || !targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese todos los campos requeridos (nombre, email, contrasena)');
    }

    const userExists = await User.findOne({ email: targetEmail });

    if (userExists) {
      res.status(400);
      throw new Error('El usuario ya existe');
    }

    const user = await User.create({
      nombre,
      apellidos: targetApellidos,
      tipoDocumento: targetDocumento,
      telefono,
      email: targetEmail,
      contrasena: targetPassword,
      idRol: targetRolId,
      rol,
      estado: 'ACTIVO'
    });

    if (user) {
      res.status(201).json({
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
        tipoDocumento: user.tipoDocumento,
        telefono: user.telefono,
        email: user.email,
        estado: user.estado,
        idRol: user.idRol,
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
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { email, correo, contrasena, contraseña, password } = req.body;

    const targetEmail = email || correo;
    const targetPassword = contrasena || contraseña || password;

    if (!targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese email y contraseña');
    }

    const user = await User.findOne({ email: targetEmail });

    if (!user) {
      res.status(401);
      throw new Error('Correo o contraseña incorrectos');
    }

    if (user.estado === 'INACTIVO') {
      res.status(401);
      throw new Error('Esta cuenta ha sido desactivada');
    }

    const isMatch = await user.matchPassword(targetPassword);
    if (isMatch) {
      res.json({
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
        tipoDocumento: user.tipoDocumento,
        telefono: user.telefono,
        email: user.email,
        estado: user.estado,
        idRol: user.idRol,
        rol: user.rol,
        token: generateToken(user.idUsuario),
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
    const user = await User.findById(req.user.idUsuario);

    if (user) {
      res.json({
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
        tipoDocumento: user.tipoDocumento,
        telefono: user.telefono,
        email: user.email,
        estado: user.estado,
        idRol: user.idRol,
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
