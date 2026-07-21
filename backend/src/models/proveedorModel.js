const connectDB = require('../config/db');

// Auto-migrate: ensure proveedor table has required columns and seed data on startup
const initProveedorTable = async () => {
  try {
    const [columns] = await connectDB.pool.query('SHOW COLUMNS FROM proveedor');
    const columnNames = columns.map(c => c.Field.toLowerCase());

    if (!columnNames.includes('nombrecontacto')) {
      await connectDB.pool.query('ALTER TABLE proveedor ADD COLUMN nombreContacto VARCHAR(150) DEFAULT NULL');
      console.log('Added nombreContacto to proveedor table');
    }

    // Seed suppliers if table is empty
    const [rows] = await connectDB.pool.query('SELECT COUNT(*) as count FROM proveedor');
    if (rows[0].count === 0) {
      console.log('Proveedor table is empty. Seeding suppliers from Figma...');
      const seedData = [
        [1, 1, 1, 'FruVer SA', '900.123.456-7', '604 123 4567', 'ventas@fruversa.com', 'Calle 50 #45-30, Medellín', 'Juan Pérez', 1],
        [2, 1, 1, 'Carnes Premium', '900.234.567-8', '604 234 5678', 'info@carnespremium.com', 'Carrera 43A #12-80, Medellín', 'María García', 1],
        [3, 1, 1, 'Avícola del Sur', '900.345.678-9', '604 345 6789', 'ventas@avicolasur.com', 'Calle 10 Sur #48-20, Envigado', 'Carlos López', 1],
        [4, 1, 1, 'Lácteos del Valle', '900.456.789-0', '604 456 7890', 'contacto@lacteosval.com', 'Avenida Las Palmas #55-100, Medellín', 'Ana Martínez', 1],
        [5, 2, 1, 'Panadería El Trigo', '43.123.456-7', '604 567 8901', 'eltrigo@gmail.com', 'Calle 33 #70-25, Medellín', 'Luis Rodríguez', 1],
        [6, 1, 1, 'Distribuidora Andina', '900.567.890-1', '604 678 9012', 'ventas@distrandina.com', 'Carrera 65 #8B-91, Medellín', 'Pedro Gómez', 0]
      ];

      for (const data of seedData) {
        await connectDB.pool.query(
          `INSERT INTO proveedor (idProveedor, idTipoProveedor, idTipoDocumento, nombre, numeroDocumento, telefono, correo, direccion, nombreContacto, estado) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          data
        );
      }
      console.log('Seeded 6 suppliers successfully.');
    }
  } catch (err) {
    console.error('Proveedor migration/seed check skipped:', err.message);
  }
};
initProveedorTable();

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
        estado,
        nombreContacto
      } = proveedorData;

      // Map tipoPersona to idTipoProveedor
      const idTipoProveedor = tipoPersona === 'Natural' ? 2 : 1; 
      // Hardcode idTipoDocumento to 1 for NIT/CC
      const idTipoDocumento = 1;
      const estadoInt = estado === 'Activo' ? 1 : 0;

      const [result] = await connection.query(
        `INSERT INTO proveedor (idTipoProveedor, idTipoDocumento, nombre, numeroDocumento, telefono, correo, direccion, nombreContacto, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [idTipoProveedor, idTipoDocumento, nombre, numeroDocumento, telefono, correo, direccion, nombreContacto || null, estadoInt]
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
        estado,
        nombreContacto
      } = proveedorData;

      const idTipoProveedor = tipoPersona === 'Natural' ? 2 : 1;
      const estadoInt = estado === 'Activo' ? 1 : 0;

      const [result] = await connection.query(
        `UPDATE proveedor 
         SET idTipoProveedor = ?, nombre = ?, numeroDocumento = ?, telefono = ?, correo = ?, direccion = ?, nombreContacto = ?, estado = ?
         WHERE idProveedor = ?`,
        [idTipoProveedor, nombre, numeroDocumento, telefono, correo, direccion, nombreContacto || null, estadoInt, idProveedor]
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
