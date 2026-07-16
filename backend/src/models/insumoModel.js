const connectDB = require('../config/db');

class InsumoModel {
  static async getAll() {
    const connection = await connectDB.pool.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT i.*, 
          COALESCE((SELECT nombre FROM categoriainsumo c WHERE c.idCategoriaInsumo = i.idCategoriaInsumo), 'Sin Categoría') as categoriaNombre,
          COALESCE((SELECT nombre FROM proveedor p WHERE p.idProveedor = i.idProveedor), 'Sin Proveedor') as proveedorNombre
        FROM insumo i
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
      const [result] = await connection.query('DELETE FROM insumo WHERE idInsumo = ?', [idInsumo]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = InsumoModel;
