const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const { pool } = connectDB;

// Initialize database tables if they do not exist
const initDB = async () => {
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

    // 2. Create table usuario
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        idUsuario INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(100) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        idRol INT NOT NULL,
        estado TINYINT DEFAULT 1,
        fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (idRol) REFERENCES rol(idRol)
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
initDB();

class User {
  constructor(data) {
    this._id = data.idUsuario || data._id;
    this.idUsuario = data.idUsuario || data._id;
    this.nombre = data.nombre;
    this.correo = data.correo;
    this.contrase\u00f1a = data.contrasena || data.contraseña;
    this.contrasena = data.contrasena || data.contraseña;
    this.rol = data.rol;
    this.estado = data.estado;
    this.fechaCreacion = data.fechaCreacion;
  }

  // Compare passwords
  async matchPassword(enteredPassword) {
    const passwordToCompare = this.contrasena || this.contraseña;
    if (!passwordToCompare) return false;
    return await bcrypt.compare(enteredPassword, passwordToCompare);
  }

  // Find user by email
  static async findByEmail(correo) {
    const query = `
      SELECT u.idUsuario, u.nombre, u.correo, u.contrasena, u.estado, u.fechaCreacion, r.nombre AS rol
      FROM usuario u
      LEFT JOIN rol r ON u.idRol = r.idRol
      WHERE u.correo = ?
    `;
    const [rows] = await pool.query(query, [correo]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  // Find user by ID
  static async findById(id) {
    const query = `
      SELECT u.idUsuario, u.nombre, u.correo, u.contrasena, u.estado, u.fechaCreacion, r.nombre AS rol
      FROM usuario u
      LEFT JOIN rol r ON u.idRol = r.idRol
      WHERE u.idUsuario = ?
    `;
    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  // Create new user
  static async create({ nombre, correo, contrasena, contraseña, rol }) {
    const pass = contrasena || contraseña;
    if (!pass) {
      throw new Error('La contraseña es requerida');
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

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
      INSERT INTO usuario (nombre, correo, contrasena, idRol, estado)
      VALUES (?, ?, ?, ?, 1)
    `;
    const [result] = await pool.query(insertQuery, [nombre, correo, hashedPassword, idRol]);
    
    return await User.findById(result.insertId);
  }

  // Update user fields dynamically
  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(data.nombre);
    }
    if (data.correo !== undefined) {
      fields.push('correo = ?');
      values.push(data.correo);
    }
    if (data.contrasena !== undefined || data.contraseña !== undefined) {
      const pass = data.contrasena || data.contraseña;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(pass, salt);
      fields.push('contrasena = ?');
      values.push(hashedPassword);
    }
    if (data.rol !== undefined) {
      // Resolve rol ID
      const [rolRows] = await pool.query('SELECT idRol FROM rol WHERE LOWER(nombre) = LOWER(?) LIMIT 1', [data.rol]);
      if (rolRows.length > 0) {
        fields.push('idRol = ?');
        values.push(rolRows[0].idRol);
      }
    }
    if (data.estado !== undefined) {
      fields.push('estado = ?');
      values.push(data.estado);
    }

    if (fields.length === 0) {
      return await User.findById(id);
    }

    values.push(id);
    const updateQuery = `UPDATE usuario SET ${fields.join(', ')} WHERE idUsuario = ?`;
    await pool.query(updateQuery, values);

    return await User.findById(id);
  }

  // Deactivate user
  static async deactivate(id) {
    const query = 'UPDATE usuario SET estado = 0 WHERE idUsuario = ?';
    await pool.query(query, [id]);
    return true;
  }
}

module.exports = User;
