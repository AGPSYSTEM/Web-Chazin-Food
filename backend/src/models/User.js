const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const { pool } = connectDB;

// Ensure local db schema migration runs at startup
const initUserDB = async () => {
  try {
    const [tables] = await pool.query("SHOW TABLES LIKE 'usuario'");
    if (tables.length === 0) {
      console.log('La tabla usuario no existe todavía.');
    }
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
  }
};
initUserDB();

class User {
  constructor(data) {
    this.idUsuario = data.idUsuario || data.id || data._id;
    this.id = data.idUsuario || data.id || data._id; // Compatibility alias
    this._id = data.idUsuario || data.id || data._id; // Compatibility alias
    this.nombre = data.nombre;
    this.apellidos = data.apellidos || data.apellido || '';
    this.apellido = data.apellidos || data.apellido || ''; // Compatibility alias
    this.tipoDocumento = data.tipoDocumento || '';
    this.telefono = data.telefono || '';
    this.email = data.email || data.correo;
    this.correo = data.email || data.correo; // Compatibility alias
    this.contrasena = data.contrasena;
    this.contraseña = data.contrasena; // Compatibility alias
    this.idRol = data.idRol || data.rol_id;
    this.rol_id = data.idRol || data.rol_id; // Compatibility alias
    this.rol = data.rol;
    this.estado = data.estado || 'ACTIVO';
    this.direccion = data.direccion || ''; // Address inherited from cliente table
    this.fechaRegistro = data.fechaRegistro;
  }

  // Compare passwords
  async matchPassword(enteredPassword) {
    const passwordToCompare = this.contrasena;
    if (!passwordToCompare) return false;
    return await bcrypt.compare(enteredPassword, passwordToCompare);
  }

  // Get all users (joined with roles and client addresses)
  static async getAll() {
    const query = `
      SELECT u.*, r.nombre AS rol, c.direccion
      FROM usuario u
      LEFT JOIN rol r ON u.idRol = r.idRol
      LEFT JOIN cliente c ON u.idUsuario = c.idUsuario
      ORDER BY u.fechaRegistro DESC
    `;
    const [rows] = await pool.query(query);
    return rows.map(row => new User(row));
  }

  // Find user by email
  static findByEmail(email) {
    const promise = (async () => {
      const query = `
        SELECT u.*, r.nombre AS rol, c.direccion
        FROM usuario u
        LEFT JOIN rol r ON u.idRol = r.idRol
        LEFT JOIN cliente c ON u.idUsuario = c.idUsuario
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
          if (fieldToRemove === 'contraseña' || fieldToRemove === 'contrasena') {
            delete user.contrasena;
            delete user.contraseña;
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
        SELECT u.*, r.nombre AS rol, c.direccion
        FROM usuario u
        LEFT JOIN rol r ON u.idRol = r.idRol
        LEFT JOIN cliente c ON u.idUsuario = c.idUsuario
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
          if (fieldToRemove === 'contraseña' || fieldToRemove === 'contrasena') {
            delete user.contrasena;
            delete user.contraseña;
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
          if (fieldToRemove === 'contraseña' || fieldToRemove === 'contrasena') {
            delete user.contrasena;
            delete user.contraseña;
          } else {
            delete user[fieldToRemove];
          }
        }
        return user;
      });
    };

    return promise;
  }

  // Create new user (handling client inheritance and custom idUsuario document numbers)
  static async create({
    idUsuario, // Custom ID (number of document)
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
    direccion,
    estado = 'ACTIVO'
  }) {
    const targetEmail = email || correo;
    const pass = contrasena || contraseña || password;
    const targetApellidos = apellidos || apellido || '';
    const targetDocumento = tipoDocumento || documento || 'C.C.';
    const targetIdUsuario = idUsuario || parseInt(documento);

    if (!targetIdUsuario) {
      throw new Error('El número de documento es requerido como ID de usuario');
    }
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

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert into main 'usuario' table using targetIdUsuario as Primary Key
      const insertQuery = `
        INSERT INTO usuario (idUsuario, nombre, apellidos, tipoDocumento, telefono, email, contrasena, estado, idRol)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const finalEstado = (estado === 'INACTIVO' || estado === 0 || estado === false || estado === 'Inactivo') ? 'INACTIVO' : 'ACTIVO';

      await connection.query(insertQuery, [
        targetIdUsuario,
        nombre,
        targetApellidos,
        targetDocumento,
        telefono || null,
        targetEmail,
        hashedPassword,
        finalEstado,
        targetRolId
      ]);

      // 2. If role is Cliente (typically idRol = 3) and direction is provided, insert into 'cliente' table
      const [rolCheck] = await connection.query('SELECT nombre FROM rol WHERE idRol = ?', [targetRolId]);
      const rolName = rolCheck.length > 0 ? rolCheck[0].nombre.toLowerCase() : '';

      if ((rolName === 'cliente' || targetRolId === 3) && direccion) {
        await connection.query(
          'INSERT INTO cliente (direccion, idUsuario) VALUES (?, ?)',
          [direccion, targetIdUsuario]
        );
      }

      await connection.commit();
      return await User.findById(targetIdUsuario);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Update user fields dynamically (handling client inheritance and address upserts)
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
      const finalEstado = (data.estado === 'INACTIVO' || data.estado === 0 || data.estado === false || data.estado === 'Inactivo') ? 'INACTIVO' : 'ACTIVO';
      fields.push('estado = ?');
      values.push(finalEstado);
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Update usuario table if there are changes
      if (fields.length > 0) {
        const updateValues = [...values, idUsuario];
        const updateQuery = `UPDATE usuario SET ${fields.join(', ')} WHERE idUsuario = ?`;
        await connection.query(updateQuery, updateValues);
      }

      // 2. Fetch role to check if user is a Client
      const [userRow] = await connection.query('SELECT idRol FROM usuario WHERE idUsuario = ?', [idUsuario]);
      const currentIdRol = userRow.length > 0 ? userRow[0].idRol : null;

      const [rolCheck] = await connection.query('SELECT nombre FROM rol WHERE idRol = ?', [currentIdRol]);
      const rolName = rolCheck.length > 0 ? rolCheck[0].nombre.toLowerCase() : '';

      if (rolName === 'cliente' || currentIdRol === 3) {
        if (data.direccion !== undefined) {
          // Check if client record already exists
          const [checkClient] = await connection.query('SELECT idCliente FROM cliente WHERE idUsuario = ?', [idUsuario]);
          if (checkClient.length > 0) {
            // Update address
            await connection.query('UPDATE cliente SET direccion = ? WHERE idUsuario = ?', [data.direccion, idUsuario]);
          } else {
            // Create client record
            await connection.query('INSERT INTO cliente (direccion, idUsuario) VALUES (?, ?)', [data.direccion, idUsuario]);
          }
        }
      } else {
        // If role was changed to non-client, clean up client address record (optional but keeps database clean)
        await connection.query('DELETE FROM cliente WHERE idUsuario = ?', [idUsuario]);
      }

      await connection.commit();
      return await User.findById(idUsuario);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Deactivate user
  static async deactivate(idUsuario) {
    const query = `UPDATE usuario SET estado = 'INACTIVO' WHERE idUsuario = ?`;
    await pool.query(query, [idUsuario]);
    return true;
  }
}

module.exports = User;
