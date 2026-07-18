const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'chazinfood' });
  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Seed types
    await conn.query(`INSERT IGNORE INTO tipoproveedor (idTipoProveedor, nombre) VALUES (1, 'Local')`);
    await conn.query(`INSERT IGNORE INTO tipodocumento (idTipoDocumento, nombre) VALUES (1, 'NIT')`);
    
    // Seed proveedores
    await conn.query(`
      INSERT IGNORE INTO proveedor (idProveedor, idTipoProveedor, idTipoDocumento, nombre, estado) VALUES 
      (1, 1, 1, 'FruVer SA', 1), 
      (2, 1, 1, 'Carnes Premium', 1), 
      (3, 1, 1, 'Avícola del Sur', 1), 
      (4, 1, 1, 'Lácteos del Valle', 1), 
      (5, 1, 1, 'Panadería El Trigo', 1), 
      (6, 1, 1, 'Distribuidora Andina', 1), 
      (7, 1, 1, 'Alimentos del Caribe', 1)
    `);
    
    // Create insumopreparado tables
    await conn.query(`
      CREATE TABLE IF NOT EXISTS insumopreparado (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        nombre VARCHAR(150) NOT NULL, 
        descripcion VARCHAR(255), 
        rendimiento DECIMAL(10,2) DEFAULT 1, 
        unidadRendimiento VARCHAR(30) DEFAULT 'und', 
        precioVenta DECIMAL(10,2) DEFAULT 0, 
        costoTotal DECIMAL(10,2) DEFAULT 0, 
        fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS detalleinsumopreparadoinsumo (
        idDetalle INT AUTO_INCREMENT PRIMARY KEY,
        idPreparado INT,
        idInsumo INT,
        cantidad DECIMAL(10, 2),
        unidadMedida VARCHAR(20), 
        precioUnitario DECIMAL(10,2), 
        FOREIGN KEY (idPreparado) REFERENCES insumopreparado(id) ON DELETE CASCADE, 
        FOREIGN KEY (idInsumo) REFERENCES insumo(idInsumo) ON DELETE CASCADE
      )
    `);
    
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('DB schema updated and seeded successfully');
  } catch (e) {
    console.error(e);
  } finally {
    await conn.end();
  }
}

run();
