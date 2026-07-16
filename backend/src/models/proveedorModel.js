const connectDB = require('../config/db');

class ProveedorModel {
  static async getAll() {
    const connection = await connectDB.pool.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT p.*,
          CASE WHEN p.idTipoProveedor = 1 THEN 'Jurídica' ELSE 'Natural' END as tipoPersona
        FROM proveedor p
      `);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async getById(idProveedor) {
    const connection = await connectDB.pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM proveedor WHERE idProveedor = ?', [idProveedor]);
      return rows[0];
    } finally {
      connection.release();
    }
  }

  static async create(proveedorData) {
    const connection = await connectDB.pool.getConnection();
    try {
      const {
        nombre,
        numeroDocumento,
        telefono,
        correo,
        direccion,
        tipoPersona,
        estado
      } = proveedorData;

      // Map tipoPersona to idTipoProveedor
      const idTipoProveedor = tipoPersona === 'Natural' ? 2 : 1; 
      // Hardcode idTipoDocumento to 1 for NIT/CC
      const idTipoDocumento = 1;
      const estadoInt = estado === 'Activo' ? 1 : 0;

      const [result] = await connection.query(
        `INSERT INTO proveedor (idTipoProveedor, idTipoDocumento, nombre, numeroDocumento, telefono, correo, direccion, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [idTipoProveedor, idTipoDocumento, nombre, numeroDocumento, telefono, correo, direccion, estadoInt]
      );
      
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async update(idProveedor, proveedorData) {
    const connection = await connectDB.pool.getConnection();
    try {
      const {
        nombre,
        numeroDocumento,
        telefono,
        correo,
        direccion,
        tipoPersona,
        estado
      } = proveedorData;

      const idTipoProveedor = tipoPersona === 'Natural' ? 2 : 1;
      const estadoInt = estado === 'Activo' ? 1 : 0;

      const [result] = await connection.query(
        `UPDATE proveedor 
         SET idTipoProveedor = ?, nombre = ?, numeroDocumento = ?, telefono = ?, correo = ?, direccion = ?, estado = ?
         WHERE idProveedor = ?`,
        [idTipoProveedor, nombre, numeroDocumento, telefono, correo, direccion, estadoInt, idProveedor]
      );
      
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async delete(idProveedor) {
    const connection = await connectDB.pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM proveedor WHERE idProveedor = ?', [idProveedor]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = ProveedorModel;
