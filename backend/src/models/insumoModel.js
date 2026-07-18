const connectDB = require('../config/db');

// Auto-migrate: ensure insumo table has required columns
const initInsumoTable = async () => {
  try {
    const [columns] = await connectDB.pool.query('SHOW COLUMNS FROM insumo');
    const columnNames = columns.map(c => c.Field.toLowerCase());

    if (!columnNames.includes('preciounitario')) {
      await connectDB.pool.query('ALTER TABLE insumo ADD COLUMN precioUnitario DECIMAL(10,2) DEFAULT 0');
      console.log('Added precioUnitario to insumo table');
    }
    if (!columnNames.includes('idproveedor')) {
      await connectDB.pool.query('ALTER TABLE insumo ADD COLUMN idProveedor INT DEFAULT NULL');
      console.log('Added idProveedor to insumo table');
    }
    if (!columnNames.includes('descripcion')) {
      await connectDB.pool.query("ALTER TABLE insumo ADD COLUMN descripcion VARCHAR(255) DEFAULT NULL");
      console.log('Added descripcion to insumo table');
    }
  } catch (err) {
    // Table may not exist yet, skip silently
    console.error('Insumo migration check skipped:', err.message);
  }
};
initInsumoTable();

class InsumoModel {
  static async getAll() {
    const connection = await connectDB.pool.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT i.*, 
          COALESCE((SELECT nombre FROM categoriainsumo c WHERE c.idCategoriaInsumo = i.idCategoriaInsumo), 'Sin Categoría') as categoriaNombre,
          COALESCE((SELECT nombre FROM proveedor p WHERE p.idProveedor = i.idProveedor), 'Sin Proveedor') as proveedorNombre
        FROM insumo i
        WHERE i.estado = 1
      `);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async getDeleted() {
    const connection = await connectDB.pool.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT i.*, 
          COALESCE((SELECT nombre FROM categoriainsumo c WHERE c.idCategoriaInsumo = i.idCategoriaInsumo), 'Sin Categoría') as categoriaNombre,
          COALESCE((SELECT nombre FROM proveedor p WHERE p.idProveedor = i.idProveedor), 'Sin Proveedor') as proveedorNombre
        FROM insumo i
        WHERE i.estado = 0
      `);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async getById(idInsumo) {
    const connection = await connectDB.pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM insumo WHERE idInsumo = ?', [idInsumo]);
      return rows[0];
    } finally {
      connection.release();
    }
  }

  static async create(insumoData) {
    const connection = await connectDB.pool.getConnection();
    try {
      const {
        nombre,
        idCategoriaInsumo,
        stock,
        unidadMedida,
        precioUnitario,
        idProveedor,
        descripcion
      } = insumoData;

      const [result] = await connection.query(
        `INSERT INTO insumo (nombre, idCategoriaInsumo, stock, unidadMedida, precioUnitario, idProveedor, descripcion) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nombre, idCategoriaInsumo, stock, unidadMedida, precioUnitario, idProveedor, descripcion]
      );
      
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async update(idInsumo, insumoData) {
    const connection = await connectDB.pool.getConnection();
    try {
      const {
        nombre,
        idCategoriaInsumo,
        stock,
        unidadMedida,
        precioUnitario,
        idProveedor,
        descripcion
      } = insumoData;

      const [result] = await connection.query(
        `UPDATE insumo 
         SET nombre = ?, idCategoriaInsumo = ?, stock = ?, unidadMedida = ?, precioUnitario = ?, idProveedor = ?, descripcion = ?
         WHERE idInsumo = ?`,
        [nombre, idCategoriaInsumo, stock, unidadMedida, precioUnitario, idProveedor, descripcion, idInsumo]
      );
      
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async delete(idInsumo) {
    const connection = await connectDB.pool.getConnection();
    try {
      const [usage] = await connection.query('SELECT COUNT(*) as count FROM detalleinsumopreparadoinsumo WHERE idInsumo = ?', [idInsumo]);
      if (usage[0].count > 0) {
        throw new Error('IN_USE');
      }

      const [result] = await connection.query('UPDATE insumo SET estado = 0 WHERE idInsumo = ?', [idInsumo]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async restore(idInsumo) {
    const connection = await connectDB.pool.getConnection();
    try {
      const [result] = await connection.query('UPDATE insumo SET estado = 1 WHERE idInsumo = ?', [idInsumo]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async permanentDelete(idInsumo) {
    const connection = await connectDB.pool.getConnection();
    try {
      // Only allow permanent deletion of items already in the trash (estado = 0)
      const [check] = await connection.query('SELECT estado FROM insumo WHERE idInsumo = ?', [idInsumo]);
      if (check.length === 0) return false;
      if (check[0].estado !== 0) {
        throw new Error('NOT_IN_TRASH');
      }

      const [result] = await connection.query('DELETE FROM insumo WHERE idInsumo = ? AND estado = 0', [idInsumo]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = InsumoModel;
