const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const { pool } = connectDB;

class User {
  constructor(data) {
    this.idUsuario = data.idUsuario;
    this.nombre = data.nombre;
    this.apellidos = data.apellidos;
    this.tipoDocumento = data.tipoDocumento;
    this.telefono = data.telefono;
    this.email = data.email || data.correo;
    this.correo = data.email || data.correo; // Compatibility alias
    this.contrasena = data.contrasena || data.contraseña;
    this.contraseña = data.contrasena || data.contraseña; // Compatibility alias
    this.idRol = data.idRol || data.rol_id || data.id_rol;
    this.rol = data.rol;
    this.estado = data.estado || 'ACTIVO';
    this.fechaRegistro = data.fechaRegistro;
  }

  // Compare passwords
  async matchPassword(enteredPassword) {
    const passwordToCompare = this.contrasena;
    if (!passwordToCompare) return false;
    return await bcrypt.compare(enteredPassword, passwordToCompare);
  }

  // Find user by email
  static findByEmail(email) {
    const promise = (async () => {
      const query = `
        SELECT u.idUsuario, u.nombre, u.apellidos, u.tipoDocumento, u.telefono, u.email, u.contrasena, u.estado, u.fechaRegistro, u.idRol, r.nombre AS rol
        FROM usuario u
        LEFT JOIN rol r ON u.idRol = r.idRol
        WHERE u.email = ?
      `;
      const [rows] = await pool.query(query, [email]);
      if (rows.length === 0) return null;
      return new User(rows[0]);
    })();

    // Make it thenable and add select method for mongoose compatibility
    promise.select = function(fields) {
      return promise.then(user => {
        if (!user) return null;
        if (fields && fields.startsWith('-')) {
          const fieldToRemove = fields.substring(1);
          if (fieldToRemove === 'contrase\u00f1a' || fieldToRemove === 'contrasena') {
            delete user.contrasena;
            delete user.contrase\u00f1a;
          } else {
            delete user[fieldToRemove];
          }
        }
        return user;
      });
    };

    return promise;
  }

  // Find user by ID
  static findById(idUsuario) {
    const promise = (async () => {
      const query = `
        SELECT u.idUsuario, u.nombre, u.apellidos, u.tipoDocumento, u.telefono, u.email, u.contrasena, u.estado, u.fechaRegistro, u.idRol, r.nombre AS rol
        FROM usuario u
        LEFT JOIN rol r ON u.idRol = r.idRol
        WHERE u.idUsuario = ?
      `;
      const [rows] = await pool.query(query, [idUsuario]);
      if (rows.length === 0) return null;
      return new User(rows[0]);
    })();

    // Make it thenable and add select method for mongoose compatibility
    promise.select = function(fields) {
      return promise.then(user => {
        if (!user) return null;
        if (fields && fields.startsWith('-')) {
          const fieldToRemove = fields.substring(1);
          if (fieldToRemove === 'contrase\u00f1a' || fieldToRemove === 'contrasena') {
            delete user.contrasena;
            delete user.contrase\u00f1a;
          } else {
            delete user[fieldToRemove];
          }
        }
        return user;
      });
    };

    return promise;
  }

  // Compatibility findOne for authController
  static findOne(conditions) {
    const promise = (async () => {
      if (conditions.email || conditions.correo) {
        return await User.findByEmail(conditions.email || conditions.correo);
      }
      if (conditions.idUsuario || conditions.id || conditions._id) {
        return await User.findById(conditions.idUsuario || conditions.id || conditions._id);
      }
      return null;
    })();

    // Make it thenable and add select method for mongoose compatibility
    promise.select = function(fields) {
      return promise.then(user => {
        if (!user) return null;
        if (fields && fields.startsWith('-')) {
          const fieldToRemove = fields.substring(1);
          if (fieldToRemove === 'contrase\u00f1a' || fieldToRemove === 'contrasena') {
            delete user.contrasena;
            delete user.contrase\u00f1a;
          } else {
            delete user[fieldToRemove];
          }
        }
        return user;
      });
    };

    return promise;
  }

  // Create new user
  static async create({
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
    rol,
    estado = 'ACTIVO'
  }) {
    const targetEmail = email || correo;
    const pass = contrasena || contraseña || password;
    const targetApellidos = apellidos || apellido || '';
    const targetDocumento = tipoDocumento || documento || '';
    if (!pass) {
      throw new Error('La contraseña es requerida');
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    // Resolve idRol
    let targetRolId = idRol || rol_id || id_rol;
    if (!targetRolId) {
      const targetRolName = rol || 'Cliente';
      const [rolRows] = await pool.query('SELECT idRol FROM rol WHERE LOWER(nombre) = LOWER(?) LIMIT 1', [targetRolName]);
      if (rolRows.length > 0) {
        targetRolId = rolRows[0].idRol;
      } else {
        const [anyRol] = await pool.query('SELECT idRol FROM rol WHERE LOWER(nombre) = "cliente" LIMIT 1');
        targetRolId = anyRol.length > 0 ? anyRol[0].idRol : 3;
      }
    }

    const insertQuery = `
      INSERT INTO usuario (nombre, apellidos, tipoDocumento, telefono, email, contrasena, estado, idRol)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const finalEstado = (estado === 'INACTIVO' || estado === 0 || estado === false) ? 'INACTIVO' : 'ACTIVO';

    const [result] = await pool.query(insertQuery, [
      nombre,
      targetApellidos,
      targetDocumento,
      telefono || null,
      targetEmail,
      hashedPassword,
      finalEstado,
      targetRolId
    ]);
    
    return await User.findById(result.insertId);
  }

  // Update user fields dynamically
  static async update(idUsuario, data) {
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(data.nombre);
    }
    if (data.apellidos !== undefined || data.apellido !== undefined) {
      fields.push('apellidos = ?');
      values.push(data.apellidos || data.apellido);
    }
    if (data.tipoDocumento !== undefined || data.documento !== undefined) {
      fields.push('tipoDocumento = ?');
      values.push(data.tipoDocumento || data.documento);
    }
    if (data.telefono !== undefined) {
      fields.push('telefono = ?');
      values.push(data.telefono);
    }
    if (data.email !== undefined || data.correo !== undefined) {
      fields.push('email = ?');
      values.push(data.email || data.correo);
    }
    if (data.contrasena !== undefined || data.contraseña !== undefined || data.password !== undefined) {
      const pass = data.contrasena || data.contraseña || data.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(pass, salt);
      fields.push('contrasena = ?');
      values.push(hashedPassword);
    }
    if (data.idRol !== undefined || data.rol_id !== undefined || data.id_rol !== undefined) {
      fields.push('idRol = ?');
      values.push(data.idRol || data.rol_id || data.id_rol);
    } else if (data.rol !== undefined) {
      const [rolRows] = await pool.query('SELECT idRol FROM rol WHERE LOWER(nombre) = LOWER(?) LIMIT 1', [data.rol]);
      if (rolRows.length > 0) {
        fields.push('idRol = ?');
        values.push(rolRows[0].idRol);
      }
    }
    if (data.estado !== undefined) {
      const finalEstado = (data.estado === 'INACTIVO' || data.estado === 0 || data.estado === false) ? 'INACTIVO' : 'ACTIVO';
      fields.push('estado = ?');
      values.push(finalEstado);
    }

    if (fields.length === 0) {
      return await User.findById(idUsuario);
    }

    values.push(idUsuario);
    const updateQuery = `UPDATE usuario SET ${fields.join(', ')} WHERE idUsuario = ?`;
    await pool.query(updateQuery, values);

    return await User.findById(idUsuario);
  }

  // Deactivate user
  static async deactivate(idUsuario) {
    const query = `UPDATE usuario SET estado = 'INACTIVO' WHERE idUsuario = ?`;
    await pool.query(query, [idUsuario]);
    return true;
  }
}

module.exports = User;
