const connectDB = require('../config/db');

class TrazabilidadModel {
  static async getAll() {
    const connection = await connectDB.pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM trazabilidad ORDER BY fecha DESC');
      return rows;
    } finally {
      connection.release();
    }
  }

  static async create(trazabilidadData) {
    const connection = await connectDB.pool.getConnection();
    try {
      const { tipo, entidadNombre, detalle } = trazabilidadData;
      const [result] = await connection.query(
        'INSERT INTO trazabilidad (tipo, entidadNombre, detalle) VALUES (?, ?, ?)',
        [tipo, entidadNombre, detalle]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async clearAll() {
    const connection = await connectDB.pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM trazabilidad');
      return result.affectedRows;
    } finally {
      connection.release();
    }
  }

  static async markAllAsRead() {
    const connection = await connectDB.pool.getConnection();
    try {
      const [result] = await connection.query('UPDATE trazabilidad SET leido = 1');
      return result.affectedRows;
    } finally {
      connection.release();
    }
  }
}

module.exports = TrazabilidadModel;
