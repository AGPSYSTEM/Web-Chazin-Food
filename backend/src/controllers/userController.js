const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (idUsuario) => {
  return jwt.sign({ id: idUsuario }, process.env.JWT_SECRET || 'supersecretjwtkeyforchazinfood', {
    expiresIn: '30d',
  });
};

// @desc    Register a new client user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const {
      idUsuario, // document number as ID
      nombre,
      apellidos,
      apellido,
      email,
      correo,
      contrasena,
      contraseña,
      password,
      tipoDocumento,
      documento,
      telefono,
      direccion
    } = req.body;

    const targetIdUsuario = idUsuario || documento;
    const targetEmail = email || correo;
    const targetPassword = contraseña || contrasena || password;
    const targetApellidos = apellidos || apellido;
    const targetDocumento = tipoDocumento || 'C.C.';

    if (!targetIdUsuario || !nombre || !targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese todos los campos requeridos (documento, nombre, email, contraseña)');
    }

    const userExists = await User.findByEmail(targetEmail);
    if (userExists) {
      res.status(400);
      throw new Error('El usuario ya existe con ese correo');
    }

    const user = await User.create({
      idUsuario: parseInt(targetIdUsuario),
      nombre,
      apellidos: targetApellidos,
      tipoDocumento: targetDocumento,
      email: targetEmail,
      contrasena: targetPassword,
      idRol: 3, // Client role
      telefono,
      direccion,
      estado: 'ACTIVO'
    });

    if (user) {
      res.status(201).json({
        idUsuario: user.idUsuario,
        _id: user.idUsuario, // Backward compatibility
        id: user.idUsuario, // Backward compatibility
        nombre: user.nombre,
        apellidos: user.apellidos,
        apellido: user.apellidos, // Backward compatibility
        tipoDocumento: user.tipoDocumento,
        email: user.email,
        correo: user.email, // Backward compatibility
        idRol: user.idRol,
        rol_id: user.idRol, // Backward compatibility
        rol: user.rol,
        telefono: user.telefono,
        direccion: user.direccion,
        estado: user.estado,
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
    const { email, correo, contrasena, contraseña, password } = req.body;

    const targetEmail = email || correo;
    const targetPassword = contrasena || contraseña || password;

    if (!targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese email y contraseña');
    }

    const user = await User.findByEmail(targetEmail);

    if (!user) {
      res.status(401);
      throw new Error('Correo o contraseña incorrectos');
    }

    // Check if user is active (supports both enum and numeric)
    if (user.estado === 'INACTIVO' || user.estado === 0 || user.estado === '0') {
      res.status(401);
      throw new Error('Esta cuenta ha sido desactivada');
    }

    const isMatch = await user.matchPassword(targetPassword);
    if (isMatch) {
      res.json({
        idUsuario: user.idUsuario,
        _id: user.idUsuario, // Backward compatibility
        id: user.idUsuario, // Backward compatibility
        nombre: user.nombre,
        apellidos: user.apellidos,
        apellido: user.apellidos, // Backward compatibility
        tipoDocumento: user.tipoDocumento,
        email: user.email,
        correo: user.email, // Backward compatibility
        idRol: user.idRol,
        rol_id: user.idRol, // Backward compatibility
        rol: user.rol,
        telefono: user.telefono,
        direccion: user.direccion,
        estado: user.estado,
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
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    if (req.user) {
      res.json({
        idUsuario: req.user.idUsuario,
        _id: req.user.idUsuario, // Backward compatibility
        id: req.user.idUsuario, // Backward compatibility
        nombre: req.user.nombre,
        apellidos: req.user.apellidos,
        apellido: req.user.apellidos, // Backward compatibility
        tipoDocumento: req.user.tipoDocumento,
        email: req.user.email,
        correo: req.user.email, // Backward compatibility
        idRol: req.user.idRol,
        rol_id: req.user.idRol, // Backward compatibility
        rol: req.user.rol,
        telefono: req.user.telefono,
        direccion: req.user.direccion,
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
    const userId = req.user.idUsuario || req.user.id || req.user._id;
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
      telefono,
      direccion
    } = req.body;

    const targetEmail = email || correo;
    const targetPassword = contraseña || contrasena || password;
    const targetApellidos = apellidos || apellido;
    const targetDocumento = tipoDocumento || documento;
    const targetRolId = idRol || rol_id || id_rol;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    // If changing email, make sure it's not taken
    if (targetEmail && targetEmail !== user.email) {
      const userExists = await User.findByEmail(targetEmail);
      if (userExists) {
        res.status(400);
        throw new Error('El correo ya está registrado por otro usuario');
      }
    }

    const updatedUser = await User.update(userId, {
      nombre,
      apellidos: targetApellidos,
      tipoDocumento: targetDocumento,
      email: targetEmail,
      contrasena: targetPassword,
      idRol: targetRolId,
      rol,
      telefono,
      direccion
    });

    res.json({
      idUsuario: updatedUser.idUsuario,
      _id: updatedUser.idUsuario, // Backward compatibility
      id: updatedUser.idUsuario, // Backward compatibility
      nombre: updatedUser.nombre,
      apellidos: updatedUser.apellidos,
      apellido: updatedUser.apellidos, // Backward compatibility
      tipoDocumento: updatedUser.tipoDocumento,
      email: updatedUser.email,
      correo: updatedUser.email, // Backward compatibility
      idRol: updatedUser.idRol,
      rol_id: updatedUser.idRol, // Backward compatibility
      rol: updatedUser.rol,
      telefono: updatedUser.telefono,
      direccion: updatedUser.direccion,
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
    const userId = req.user.idUsuario || req.user.id || req.user._id;
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

// ── CRUD ADMINISTRATIVO DE USUARIOS ──

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Create user from admin panel
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const {
      idUsuario, // Custom ID as document number
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
      telefono,
      direccion,
      estado
    } = req.body;

    const targetIdUsuario = idUsuario || documento;
    const targetEmail = email || correo;
    const targetPassword = contraseña || contrasena || password;
    const targetApellidos = apellidos || apellido;
    const targetDocumento = tipoDocumento || 'C.C.';
    const targetRolId = idRol || rol_id || id_rol;

    if (!targetIdUsuario || !nombre || !targetEmail || !targetPassword) {
      res.status(400);
      throw new Error('Por favor ingrese todos los campos requeridos (documento, nombre, email, contraseña)');
    }

    const userExists = await User.findByEmail(targetEmail);
    if (userExists) {
      res.status(400);
      throw new Error('El usuario ya existe con ese correo');
    }

    const newUser = await User.create({
      idUsuario: parseInt(targetIdUsuario),
      nombre,
      apellidos: targetApellidos,
      tipoDocumento: targetDocumento,
      email: targetEmail,
      contrasena: targetPassword,
      idRol: targetRolId,
      rol,
      telefono,
      direccion,
      estado: estado || 'ACTIVO'
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user from admin panel
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
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
      telefono,
      direccion,
      estado
    } = req.body;

    const targetEmail = email || correo;
    const targetPassword = contraseña || contrasena || password;
    const targetApellidos = apellidos || apellido;
    const targetDocumento = tipoDocumento || documento;
    const targetRolId = idRol || rol_id || id_rol;

    const user = await User.findById(id);
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

    const updatedUser = await User.update(id, {
      nombre,
      apellidos: targetApellidos,
      tipoDocumento: targetDocumento,
      email: targetEmail,
      contrasena: targetPassword,
      idRol: targetRolId,
      rol,
      telefono,
      direccion,
      estado
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Deactivate user from admin panel
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    await User.deactivate(id);
    res.json({ message: 'Usuario desactivado correctamente' });
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
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
