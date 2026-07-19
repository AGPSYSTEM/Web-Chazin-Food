const connectDB = require('../config/db');
const { pool } = connectDB;

// @desc    Get all roles
// @route   GET /api/roles
// @access  Public
const getRoles = async (req, res, next) => {
  try {
    // Corrected subquery to point to 'usuario' table instead of 'usuarios'
    const query = `
      SELECT r.idRol as id, r.nombre, r.descripcion, r.estado, 
             COALESCE(u.count, 0) as usuarios
      FROM rol r
      LEFT JOIN (
        SELECT idRol, COUNT(*) as count 
        FROM usuario 
        GROUP BY idRol
      ) u ON r.idRol = u.idRol
    `;
    const [rows] = await pool.query(query);

    // Retrieve all role-permission associations from the database
    const [permisosRows] = await pool.query(`
      SELECT rp.idRol, p.nombrePermiso 
      FROM rolpermiso rp 
      JOIN permiso p ON rp.idPermiso = p.idPermiso
    `);
    
    const roles = rows.map(row => {
      // Filter permissions belonging to this specific role
      const rolPermisos = permisosRows
        .filter(p => p.idRol === row.id)
        .map(p => p.nombrePermiso);

      return {
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion || '',
        usuarios: Number(row.usuarios),
        permisos: rolPermisos,
        estado: row.estado === 1 ? 'Activo' : 'Inactivo'
      };
    });

    res.json(roles);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a role
// @route   POST /api/roles
// @access  Public
const createRole = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre || !nombre.trim()) {
      res.status(400);
      throw new Error('El nombre del rol es obligatorio');
    }

    const query = 'INSERT INTO rol (nombre, descripcion, estado) VALUES (?, ?, 1)';
    const [result] = await pool.query(query, [nombre.trim(), descripcion ? descripcion.trim() : '']);

    const newRole = {
      id: result.insertId,
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : '',
      usuarios: 0,
      permisos: [],
      estado: 'Activo'
    };

    res.status(201).json(newRole);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Public
const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre || !nombre.trim()) {
      res.status(400);
      throw new Error('El nombre del rol es obligatorio');
    }

    const checkQuery = 'SELECT * FROM rol WHERE idRol = ?';
    const [checkRows] = await pool.query(checkQuery, [id]);
    if (checkRows.length === 0) {
      res.status(404);
      throw new Error('Rol no encontrado');
    }

    const updateQuery = 'UPDATE rol SET nombre = ?, descripcion = ? WHERE idRol = ?';
    await pool.query(updateQuery, [nombre.trim(), descripcion ? descripcion.trim() : '', id]);

    res.json({
      id: Number(id),
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : '',
      usuarios: 0,
      permisos: [],
      estado: checkRows[0].estado === 1 ? 'Activo' : 'Inactivo'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update permissions for a role
// @route   PUT /api/roles/:id/permisos
// @access  Public
const updateRolePermisos = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { permisos } = req.body;

    if (!Array.isArray(permisos)) {
      res.status(400);
      throw new Error('Los permisos deben ser enviados como una lista/arreglo');
    }

    const checkQuery = 'SELECT * FROM rol WHERE idRol = ?';
    const [checkRows] = await connection.query(checkQuery, [id]);
    if (checkRows.length === 0) {
      res.status(404);
      throw new Error('Rol no encontrado');
    }

    await connection.beginTransaction();

    // 1. Clear existing permissions for this role
    await connection.query('DELETE FROM rolpermiso WHERE idRol = ?', [id]);

    // 2. Insert selected permissions by matching permission names
    if (permisos.length > 0) {
      // Find all matching permissions in one query
      const [permDocs] = await connection.query(
        'SELECT idPermiso, nombrePermiso FROM permiso WHERE nombrePermiso IN (?)',
        [permisos]
      );

      for (const doc of permDocs) {
        await connection.query(
          'INSERT INTO rolpermiso (idRol, idPermiso) VALUES (?, ?)',
          [id, doc.idPermiso]
        );
      }
    }

    await connection.commit();
    res.json({ message: 'Permisos de rol actualizados exitosamente', permisos });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Public
const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkQuery = 'SELECT * FROM rol WHERE idRol = ?';
    const [checkRows] = await pool.query(checkQuery, [id]);
    if (checkRows.length === 0) {
      res.status(404);
      throw new Error('Rol no encontrado');
    }

    if (checkRows[0].nombre === 'Administrador' || Number(id) === 1) {
      res.status(400);
      throw new Error('No se puede eliminar el rol de Administrador');
    }

    await pool.query('DELETE FROM rolpermiso WHERE idRol = ?', [id]);

    const deleteQuery = 'DELETE FROM rol WHERE idRol = ?';
    await pool.query(deleteQuery, [id]);

    res.json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoles,
  createRole,
  updateRole,
  updateRolePermisos,
  deleteRole
};
