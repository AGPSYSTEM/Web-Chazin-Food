const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
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

// @desc    Request password reset (sends email via Brevo)
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email, correo } = req.body;
    const targetEmail = email || correo;

    if (!targetEmail) {
      res.status(400);
      throw new Error('El correo electrónico es requerido');
    }

    const user = await User.findByEmail(targetEmail);

    if (!user) {
      // Return 200 anyway to not reveal if an email exists (security best practice)
      return res.json({ message: 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.' });
    }

    // Generate a reset token signed with JWT_SECRET + user's current hashed password
    // This makes the token auto-invalidate when the password changes
    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkeyforchazinfood';
    const resetToken = jwt.sign(
      { id: user.idUsuario, email: user.email },
      jwtSecret + user.contrasena,
      { expiresIn: '1h' }
    );

    // Build the reset link pointing to the frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    // Beautiful branded HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#f4f6f9;-webkit-font-smoothing:antialiased;">
  <div style="width:100%;background-color:#f4f6f9;padding:40px 0;">
    <div style="max-width:540px;margin:0 auto;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);border:1px solid #eef2f5;">
      <!-- Header gradient bar -->
      <div style="height:6px;background:linear-gradient(90deg,#F05454 0%,#ff6b8b 100%);"></div>
      
      <!-- Content -->
      <div style="padding:40px;text-align:center;">
        <!-- Logo circle -->
        <div style="display:inline-block;width:80px;height:80px;background:linear-gradient(135deg,#F05454 0%,#ff6b8b 100%);border-radius:50%;margin-bottom:24px;box-shadow:0 8px 25px rgba(240,84,84,0.3);">
          <span style="display:block;color:#ffffff;font-size:36px;line-height:80px;font-weight:bold;">🍳</span>
        </div>
        
        <!-- Brand name -->
        <h2 style="font-size:14px;color:#F05454;text-transform:uppercase;letter-spacing:3px;margin:0 0 8px 0;font-weight:700;">Chazin Food</h2>
        
        <!-- Title -->
        <h1 style="font-size:26px;color:#30475E;margin:0 0 16px 0;font-weight:700;">Restablecer Contraseña</h1>
        
        <!-- Greeting -->
        <p style="color:#6c7a89;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
          Hola, <strong style="color:#30475E;">${user.nombre} ${user.apellidos || ''}</strong>.<br>
          Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong style="color:#F05454;">Chazin Food</strong>.
        </p>
        
        <p style="color:#6c7a89;font-size:15px;line-height:1.7;margin:0 0 32px 0;">
          Para continuar con el proceso, haz clic en el botón de abajo:
        </p>
        
        <!-- CTA Button -->
        <div style="margin-bottom:32px;">
          <a href="${resetLink}" target="_blank" style="display:inline-block;background:linear-gradient(90deg,#F05454 0%,#ff6b8b 100%);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-weight:bold;font-size:15px;box-shadow:0 6px 20px rgba(240,84,84,0.25);letter-spacing:0.5px;">
            Restablecer Contraseña
          </a>
        </div>
        
        <!-- Security note -->
        <div style="background-color:#fff8f8;border:1px solid #ffe0e0;border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="color:#e74c3c;font-size:13px;margin:0;line-height:1.5;">
            ⚠️ Si no realizaste esta solicitud, puedes ignorar este correo de forma segura.<br>
            El enlace expirará en <strong>1 hora</strong>.
          </p>
        </div>
        
        <!-- Fallback link -->
        <p style="font-size:11px;color:#95a5a6;margin:20px 0 0 0;word-break:break-all;line-height:1.6;">
          Si tienes problemas con el botón, copia y pega este enlace en tu navegador:<br>
          <a href="${resetLink}" style="color:#F05454;text-decoration:underline;">${resetLink}</a>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color:#fafbfc;padding:24px;text-align:center;border-top:1px solid #eef2f5;">
        <p style="color:#95a5a6;font-size:12px;margin:0;">&copy; 2026 Chazin Food. Todos los derechos reservados.</p>
        <p style="color:#bdc3c7;font-size:11px;margin:8px 0 0 0;">Este es un correo automático, por favor no respondas a este mensaje.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    // Send email via Nodemailer
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER || 'gomezpavas34@gmail.com';
    const smtpPass = process.env.SMTP_PASS;

    if (smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // True for 465, false for other ports (like 587)
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        await transporter.sendMail({
          from: `"Chazin Food" <${smtpUser}>`,
          to: user.email,
          subject: '🔐 Restablecer Contraseña - Chazin Food',
          html: htmlContent
        });

        console.log(`✅ Correo de recuperación enviado a ${user.email} usando Nodemailer`);
      } catch (emailError) {
        console.error('Error al enviar correo via Nodemailer:', emailError.message);
      }
    } else {
      // Development fallback: log the reset link to console
      console.log('\n╔══════════════════════════════════════════════════════╗');
      console.log('║  🔐 ENLACE DE RECUPERACIÓN DE CONTRASEÑA (DEV)      ║');
      console.log('╠══════════════════════════════════════════════════════╣');
      console.log(`║  Usuario: ${user.email}`);
      console.log(`║  Link: ${resetLink}`);
      console.log('╚══════════════════════════════════════════════════════╝\n');
    }

    res.json({ message: 'Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, email, contrasena, contraseña, password } = req.body;
    const newPassword = contrasena || contraseña || password;

    if (!token || !email || !newPassword) {
      res.status(400);
      throw new Error('Token, email y nueva contraseña son requeridos');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    // Verify the reset token (signed with JWT_SECRET + current hashed password)
    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkeyforchazinfood';
    try {
      jwt.verify(token, jwtSecret + user.contrasena);
    } catch (tokenError) {
      res.status(400);
      throw new Error('El enlace de recuperación ha expirado o no es válido. Por favor solicita uno nuevo.');
    }

    // Update password using User.update (which auto-hashes the password)
    await User.update(user.idUsuario, { contrasena: newPassword });

    console.log(`✅ Contraseña restablecida para ${user.email}`);

    res.json({ message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.' });
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
  deleteUser,
  forgotPassword,
  resetPassword
};
