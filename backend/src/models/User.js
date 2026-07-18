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
// Initialize database tables if they do not exist
const initUserDB = async () => {
  try {
    // 1. Create table rol
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rol (
        idRol INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) UNIQUE NOT NULL,
        descripcion VARCHAR(255),
        estado TINYINT DEFAULT 1
      )
    `);

    // 2. Create table usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        rol_id INT NOT NULL,
        telefono VARCHAR(50),
        imagen VARCHAR(255),
        estado TINYINT DEFAULT 1,
        FOREIGN KEY (rol_id) REFERENCES rol(idRol)
      )
    `);

    // 3. Seed roles if table is empty
    const [roles] = await pool.query('SELECT COUNT(*) as count FROM rol');
    if (roles[0].count === 0) {
      await pool.query(`
        INSERT INTO rol (nombre, descripcion, estado) VALUES
        ('Administrador', 'Rol de administrador del sistema', 1),
        ('Cocinero', 'Rol de cocinero para gestionar órdenes', 1),
        ('Cliente', 'Rol de cliente para realizar compras', 1)
      `);
      console.log('Roles por defecto insertados con éxito.');
    }
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
  }
};

// Run initialization immediately on file import (async, non-blocking)
initUserDB();

class User {
  constructor(data) {
    this._id = data.id || data.idUsuario || data._id;
    this.id = data.id || data.idUsuario || data._id;
    this.idUsuario = data.id || data.idUsuario || data._id; // Backward compatibility
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.email = data.email || data.correo;
    this.correo = data.email || data.correo; // Backward compatibility
    this.contraseña = data.contrasena;
    this.contrasena = data.contrasena;
    this.rol_id = data.rol_id || data.idRol;
    this.idRol = data.rol_id || data.idRol; // Backward compatibility
    this.rol = data.rol;
    this.telefono = data.telefono;
    this.imagen = data.imagen;
    this.estado = data.estado;
  }

  // Compare passwords
  async matchPassword(enteredPassword) {
    const passwordToCompare = this.contrasena;
    if (!passwordToCompare) return false;
    return await bcrypt.compare(enteredPassword, passwordToCompare);
  }

  // Find user by email
  static async findByEmail(email) {
    const query = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.contrasena, u.rol_id, u.telefono, u.imagen, u.estado, r.nombre AS rol
      FROM usuarios u
      LEFT JOIN rol r ON u.rol_id = r.idRol
      WHERE u.email = ?
    `;
    const [rows] = await pool.query(query, [email]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  // Find user by ID
  static async findById(id) {
    const query = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.contrasena, u.rol_id, u.telefono, u.imagen, u.estado, r.nombre AS rol
      FROM usuarios u
      LEFT JOIN rol r ON u.rol_id = r.idRol
      WHERE u.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  // Compatibility findOne for authController
  static async findOne(conditions) {
    if (conditions.correo || conditions.email) {
      return await this.findByEmail(conditions.correo || conditions.email);
    }
    if (conditions.id || conditions._id || conditions.idUsuario) {
      return await this.findById(conditions.id || conditions._id || conditions.idUsuario);
    }
    return null;
  }

  // Create new user
  static async create({ nombre, correo, contrasena, contraseña, rol }) {
    const pass = contrasena || contraseña;
  static async create({
    nombre,
    apellido,
    email,
    correo,
    contrasena,
    contraseña,
    password,
    rol_id,
    idRol,
    rol,
    telefono,
    imagen,
    estado = 1
  }) {
    const targetEmail = email || correo;
    const pass = contrasena || contraseña || password;
    if (!pass) {
      throw new Error('La contraseña es requerida');
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    // Resolve idRol
    let targetRolId = idRol || rol_id || id_rol;
    // Resolve rol_id
    let targetRolId = rol_id || idRol;
    if (!targetRolId) {
      const targetRolName = rol || 'Cliente';
      const [rolRows] = await pool.query('SELECT idRol FROM rol WHERE LOWER(nombre) = LOWER(?) LIMIT 1', [targetRolName]);
      if (rolRows.length > 0) {
        targetRolId = rolRows[0].idRol;
      } else {
        const [anyRol] = await pool.query('SELECT idRol FROM rol WHERE LOWER(nombre) = "cliente" LIMIT 1');
        targetRolId = anyRol.length > 0 ? anyRol[0].idRol : 3;
    // Resolve rol ID (default to Cliente if not found)
    const targetRol = rol || 'Cliente';
    const [rolRows] = await pool.query('SELECT idRol FROM rol WHERE LOWER(nombre) = LOWER(?) LIMIT 1', [targetRol]);
    
    let idRol = 3; // Default fallback to Cliente (ID 3 in seed)
    if (rolRows.length > 0) {
      idRol = rolRows[0].idRol;
    } else {
      // If the roles are empty or if another name is passed, check if there's any ID matching
      const [anyRol] = await pool.query('SELECT idRol FROM rol WHERE LOWER(nombre) = "cliente" LIMIT 1');
      if (anyRol.length > 0) {
        idRol = anyRol[0].idRol;
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
      INSERT INTO usuario (nombre, correo, contrasena, idRol, estado)
      VALUES (?, ?, ?, ?, 1)
    `;
    const [result] = await pool.query(insertQuery, [nombre, correo, hashedPassword, idRol]);
      INSERT INTO usuarios (nombre, apellido, email, contrasena, rol_id, telefono, imagen, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(insertQuery, [
      nombre,
      apellido || null,
      targetEmail,
      hashedPassword,
      targetRolId,
      telefono || null,
      imagen || null,
      estado !== undefined ? estado : 1
    ]);
    
    return await User.findById(result.insertId);
  }

  // Update user fields dynamically
  static async update(idUsuario, data) {
  static async update(id, data) {
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
    if (data.apellido !== undefined) {
      fields.push('apellido = ?');
      values.push(data.apellido);
    }
    if (data.email !== undefined || data.correo !== undefined) {
      fields.push('email = ?');
      values.push(data.email || data.correo);
    }
    if (data.contrasena !== undefined || data.contraseña !== undefined || data.password !== undefined) {
      const pass = data.contrasena || data.contraseña || data.password;
    if (data.correo !== undefined) {
      fields.push('correo = ?');
      values.push(data.correo);
    }
    if (data.contrasena !== undefined || data.contraseña !== undefined) {
      const pass = data.contrasena || data.contraseña;
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
    if (data.rol !== undefined) {
      // Resolve rol ID
    if (data.rol_id !== undefined || data.idRol !== undefined) {
      fields.push('rol_id = ?');
      values.push(data.rol_id || data.idRol);
    } else if (data.rol !== undefined) {
      const [rolRows] = await pool.query('SELECT idRol FROM rol WHERE LOWER(nombre) = LOWER(?) LIMIT 1', [data.rol]);
      if (rolRows.length > 0) {
        fields.push('rol_id = ?');
        values.push(rolRows[0].idRol);
      }
    }
    if (data.telefono !== undefined) {
      fields.push('telefono = ?');
      values.push(data.telefono);
    }
    if (data.imagen !== undefined) {
      fields.push('imagen = ?');
      values.push(data.imagen);
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
      fields.push('estado = ?');
      values.push(data.estado);
    }

    if (fields.length === 0) {
      return await User.findById(id);
    }

    values.push(id);
    const updateQuery = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(updateQuery, values);

    return await User.findById(id);
  }

  // Deactivate user
  static async deactivate(id) {
    const query = 'UPDATE usuarios SET estado = 0 WHERE id = ?';
    await pool.query(query, [id]);
    return true;
  }
}

module.exports = User;
