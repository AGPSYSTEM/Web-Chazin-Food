const jwt = require('jsonwebtoken');
const User = require('../models/User');

<<<<<<< HEAD
const generateToken = (idUsuario) => {
  return jwt.sign({ id: idUsuario }, process.env.JWT_SECRET || 'supersecretjwtkeyforchazinfood', {
=======
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforchazinfood', {
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
<<<<<<< HEAD
    const {
      nombre,
      apellidos,
      apellido,
      email,
      correo,
      contrasena,
      contraseña,
      password,
      idRol,
      rol_id,
      id_rol,
      rol,
      tipoDocumento,
      documento,
      telefono
    } = req.body;
    
    const targetEmail = email || correo;
    const targetPassword = contraseña || contrasena || password;
    const targetApellidos = apellidos || apellido;
    const targetDocumento = tipoDocumento || documento;
    const targetRolId = idRol || rol_id || id_rol;

    if (!nombre || !targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese todos los campos requeridos (nombre, email, contrasena)');
=======
    const { nombre, correo, email, contrase\u00f1a, contrasena, password, rol } = req.body;
    
    const targetEmail = correo || email;
    const targetPassword = contrase\u00f1a || contrasena || password;

    if (!nombre || !targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese todos los campos requeridos (nombre, correo, contrase\u00f1a)');
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
    }

    const userExists = await User.findByEmail(targetEmail);
    if (userExists) {
      res.status(400);
      throw new Error('El usuario ya existe');
    }

    const user = await User.create({
      nombre,
<<<<<<< HEAD
      apellidos: targetApellidos,
      tipoDocumento: targetDocumento,
      email: targetEmail,
      contrasena: targetPassword,
      idRol: targetRolId,
      rol,
      telefono,
      estado: 'ACTIVO'
=======
      correo: targetEmail,
      contrasena: targetPassword,
      rol: rol || 'Cliente'
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
    });

    if (user) {
      res.status(201).json({
<<<<<<< HEAD
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
        tipoDocumento: user.tipoDocumento,
        email: user.email,
        idRol: user.idRol,
        rol: user.rol,
        telefono: user.telefono,
        estado: user.estado,
=======
        _id: user.idUsuario,
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
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
<<<<<<< HEAD
    const { email, correo, contrasena, contraseña, password } = req.body;

    const targetEmail = email || correo;
    const targetPassword = contrasena || contraseña || password;

    if (!targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese email y contraseña');
=======
    const { correo, email, contrase\u00f1a, contrasena, password } = req.body;

    const targetEmail = correo || email;
    const targetPassword = contrase\u00f1a || contrasena || password;

    if (!targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese correo y contrase\u00f1a');
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
    }

    const user = await User.findByEmail(targetEmail);

    if (!user) {
      res.status(401);
<<<<<<< HEAD
      throw new Error('Correo o contraseña incorrectos');
    }

    if (user.estado === 'INACTIVO') {
=======
      throw new Error('Correo o contrase\u00f1a incorrectos');
    }

    if (user.estado === 0) {
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
      res.status(401);
      throw new Error('Esta cuenta ha sido desactivada');
    }

    const isMatch = await user.matchPassword(targetPassword);
    if (isMatch) {
      res.json({
<<<<<<< HEAD
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
        tipoDocumento: user.tipoDocumento,
        email: user.email,
        idRol: user.idRol,
        rol: user.rol,
        telefono: user.telefono,
        estado: user.estado,
=======
        _id: user.idUsuario,
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
        token: generateToken(user.idUsuario),
      });
    } else {
      res.status(401);
<<<<<<< HEAD
      throw new Error('Correo o contraseña incorrectos');
=======
      throw new Error('Correo o contrase\u00f1a incorrectos');
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
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
<<<<<<< HEAD
    if (req.user) {
      res.json({
        idUsuario: req.user.idUsuario,
        nombre: req.user.nombre,
        apellidos: req.user.apellidos,
        tipoDocumento: req.user.tipoDocumento,
        email: req.user.email,
        idRol: req.user.idRol,
        rol: req.user.rol,
        telefono: req.user.telefono,
        estado: req.user.estado,
      });
=======
    // req.user is populated by protect middleware
    if (req.user) {
      res.json(req.user);
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
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
<<<<<<< HEAD
    const userId = req.user.idUsuario;
    const {
      nombre,
      apellidos,
      apellido,
      email,
      correo,
      contrasena,
      contraseña,
      password,
      idRol,
      rol_id,
      id_rol,
      rol,
      tipoDocumento,
      documento,
      telefono
    } = req.body;

    const targetEmail = email || correo;
    const targetPassword = contraseña || contrasena || password;
    const targetApellidos = apellidos || apellido;
    const targetDocumento = tipoDocumento || documento;
    const targetRolId = idRol || rol_id || id_rol;
=======
    const userId = req.user.idUsuario || req.user._id;
    const { nombre, correo, email, contrase\u00f1a, contrasena, password } = req.body;

    const targetEmail = correo || email;
    const targetPassword = contrase\u00f1a || contrasena || password;
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

<<<<<<< HEAD
    if (targetEmail && targetEmail !== user.email) {
=======
    // If changing email, make sure it's not taken
    if (targetEmail && targetEmail !== user.correo) {
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
      const userExists = await User.findByEmail(targetEmail);
      if (userExists) {
        res.status(400);
        throw new Error('El correo ya está registrado por otro usuario');
      }
    }

    const updatedUser = await User.update(userId, {
      nombre,
<<<<<<< HEAD
      apellidos: targetApellidos,
      tipoDocumento: targetDocumento,
      email: targetEmail,
      contrasena: targetPassword,
      idRol: targetRolId,
      rol,
      telefono
    });

    res.json({
      idUsuario: updatedUser.idUsuario,
      nombre: updatedUser.nombre,
      apellidos: updatedUser.apellidos,
      tipoDocumento: updatedUser.tipoDocumento,
      email: updatedUser.email,
      idRol: updatedUser.idRol,
      rol: updatedUser.rol,
      telefono: updatedUser.telefono,
      estado: updatedUser.estado,
=======
      correo: targetEmail,
      contrasena: targetPassword
    });

    res.json({
      _id: updatedUser.idUsuario,
      idUsuario: updatedUser.idUsuario,
      nombre: updatedUser.nombre,
      correo: updatedUser.correo,
      rol: updatedUser.rol,
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
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
<<<<<<< HEAD
    const userId = req.user.idUsuario;
=======
    const userId = req.user.idUsuario || req.user._id;
>>>>>>> 8390e28ec3d864bb0178f6d84530f1821941dd58
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
