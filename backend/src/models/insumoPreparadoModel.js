const connectDB = require('../config/db');

class InsumoPreparadoModel {
  static async getAll() {
    const connection = await connectDB.pool.getConnection();
    try {
      const [preparados] = await connection.query('SELECT * FROM insumopreparado ORDER BY fechaCreacion DESC');
      
      // Get all details
      const [detalles] = await connection.query(`
        SELECT d.*, i.nombre as nombreInsumo
        FROM insumopreparado_detalle d
        JOIN insumo i ON d.idInsumo = i.idInsumo
      `);
      
      // Assemble the final object
      return preparados.map(prep => {
        const componentes = detalles
          .filter(d => d.idPreparado === prep.id)
          .map(d => ({
            idInsumo: d.idInsumo,
            nombre: d.nombreInsumo,
            cantidad: d.cantidad,
            unidadMedida: d.unidadMedida,
            precioUnitario: d.precioUnitario
          }));
          
        return {
          ...prep,
          componentes
        };
      });
    } finally {
      connection.release();
    }
  }

  static async getById(id) {
    const connection = await connectDB.pool.getConnection();
    try {
      const [preparados] = await connection.query('SELECT * FROM insumopreparado WHERE id = ?', [id]);
      if (preparados.length === 0) return null;
      
      const prep = preparados[0];
      const [detalles] = await connection.query(`
        SELECT d.*, i.nombre as nombreInsumo
        FROM insumopreparado_detalle d
        JOIN insumo i ON d.idInsumo = i.idInsumo
        WHERE d.idPreparado = ?
      `, [id]);
      
      prep.componentes = detalles.map(d => ({
        idInsumo: d.idInsumo,
        nombre: d.nombreInsumo,
        cantidad: d.cantidad,
        unidadMedida: d.unidadMedida,
        precioUnitario: d.precioUnitario
      }));
      
      return prep;
    } finally {
      connection.release();
    }
  }

  static async create(data) {
    const connection = await connectDB.pool.getConnection();
    await connection.beginTransaction();
    try {
      const {
        nombre, descripcion, rendimiento, unidadRendimiento, precioVenta, costoTotal, componentes
      } = data;

      const [result] = await connection.query(
        `INSERT INTO insumopreparado (nombre, descripcion, rendimiento, unidadRendimiento, precioVenta, costoTotal) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, descripcion, rendimiento, unidadRendimiento, precioVenta, costoTotal]
      );
      
      const insertId = result.insertId;
      
      if (componentes && componentes.length > 0) {
        const values = componentes.map(c => [
          insertId, c.idInsumo, c.cantidad, c.unidadMedida, c.precioUnitario
        ]);
        await connection.query(
          `INSERT INTO insumopreparado_detalle (idPreparado, idInsumo, cantidad, unidadMedida, precioUnitario) VALUES ?`,
          [values]
        );
      }
      
      await connection.commit();
      return insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await connectDB.pool.getConnection();
    await connection.beginTransaction();
    try {
      const {
        nombre, descripcion, rendimiento, unidadRendimiento, precioVenta, costoTotal, componentes
      } = data;

      await connection.query(
        `UPDATE insumopreparado 
         SET nombre = ?, descripcion = ?, rendimiento = ?, unidadRendimiento = ?, precioVenta = ?, costoTotal = ?
         WHERE id = ?`,
        [nombre, descripcion, rendimiento, unidadRendimiento, precioVenta, costoTotal, id]
      );
      
      // Delete old components
      await connection.query('DELETE FROM insumopreparado_detalle WHERE idPreparado = ?', [id]);
      
      // Insert new components
      if (componentes && componentes.length > 0) {
        const values = componentes.map(c => [
          id, c.idInsumo, c.cantidad, c.unidadMedida, c.precioUnitario
        ]);
        await connection.query(
          `INSERT INTO insumopreparado_detalle (idPreparado, idInsumo, cantidad, unidadMedida, precioUnitario) VALUES ?`,
          [values]
        );
      }
      
      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await connectDB.pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM insumopreparado WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = InsumoPreparadoModel;
