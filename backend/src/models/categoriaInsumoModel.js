const connectDB = require('../config/db');

class CategoriaInsumoModel {
  static async getAll() {
    const connection = await connectDB.pool.getConnection();
    try {
      // Return with 'cantidad' of insumos associated
      const [rows] = await connection.query(`
        SELECT c.idCategoriaInsumo as id, c.nombre, c.descripcion, 
        CASE WHEN c.estado = 1 THEN 'Activo' ELSE 'Inactivo' END as estado,
        (SELECT COUNT(*) FROM insumo i WHERE i.idCategoriaInsumo = c.idCategoriaInsumo) as cantidad
        FROM categoriainsumo c
      `);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async getById(id) {
    const connection = await connectDB.pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM categoriainsumo WHERE idCategoriaInsumo = ?', [id]);
      return rows[0];
    } finally {
      connection.release();
    }
  }

  static async create(data) {
    const connection = await connectDB.pool.getConnection();
    try {
      const estadoVal = data.estado === 'Activo' ? 1 : 0;
      const [result] = await connection.query(
        `INSERT INTO categoriainsumo (nombre, descripcion, estado) VALUES (?, ?, ?)`,
        [data.nombre, data.descripcion || null, estadoVal]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await connectDB.pool.getConnection();
    try {
      const estadoVal = data.estado === 'Activo' ? 1 : 0;
      const [result] = await connection.query(
        `UPDATE categoriainsumo SET nombre = ?, descripcion = ?, estado = ? WHERE idCategoriaInsumo = ?`,
        [data.nombre, data.descripcion || null, estadoVal, id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await connectDB.pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM categoriainsumo WHERE idCategoriaInsumo = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = CategoriaInsumoModel;
