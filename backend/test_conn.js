const mysql = require('mysql2/promise');

async function testConnection() {
  const configs = [
    {
      name: 'Código actual (Contraseña: "12345")',
      host: 'localhost',
      user: 'root',
      password: '12345',
    },
    {
      name: 'Default XAMPP (Contraseña vacía)',
      host: 'localhost',
      user: 'root',
      password: '',
    }
  ];

  let activeConfig = null;
  let connection = null;

  for (const config of configs) {
    console.log(`Intentando conectar con config: ${config.name}...`);
    try {
      connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password
      });
      console.log(`✅ ¡Conexión exitosa usando: ${config.name}!`);
      activeConfig = config;
      break;
    } catch (err) {
      console.log(`❌ Falló la conexión: ${err.message}`);
    }
  }

  if (!connection) {
    console.log('\n❌ No se pudo conectar a MySQL con ninguna configuración. Por favor verifica los datos.');
    process.exit(1);
  }

  try {
    // Check if database 'chazinfood' exists
    const [databases] = await connection.query('SHOW DATABASES');
    const dbNames = databases.map(d => d.Database);
    console.log('\nBases de datos encontradas:', dbNames);

    const hasDb = dbNames.includes('chazinfood');
    if (!hasDb) {
      console.log('⚠️ La base de datos "chazinfood" no existe. Intentando crearla...');
      await connection.query('CREATE DATABASE chazinfood');
      console.log('✅ Base de datos "chazinfood" creada con éxito.');
    } else {
      console.log('✅ La base de datos "chazinfood" existe.');
    }

    // Connect specifically to chazinfood database
    await connection.changeUser({ database: 'chazinfood' });

    // Check tables
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.log('Tablas encontradas en "chazinfood":', tableNames);

    const requiredTables = ['rol', 'usuario', 'rolpermiso'];
    const missingTables = requiredTables.filter(t => !tableNames.includes(t));

    if (missingTables.length > 0) {
      console.log(`⚠️ Faltan las siguientes tablas: ${missingTables.join(', ')}`);
      
      // Auto-create missing tables if they don't exist
      if (missingTables.includes('rol')) {
        console.log('Creando tabla "rol"...');
        await connection.query(`
          CREATE TABLE rol (
            idRol INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            descripcion VARCHAR(255),
            estado TINYINT DEFAULT 1
          )
        `);
        console.log('✅ Tabla "rol" creada.');
        
        // Insert default roles if table created
        await connection.query(`
          INSERT INTO rol (idRol, nombre, descripcion, estado) VALUES
          (1, 'Administrador', 'Acceso completo al sistema', 1),
          (2, 'Cocinero', 'Acceso a producción y fichas técnicas', 1),
          (3, 'Cliente', 'Acceso básico para realizar pedidos', 1)
        `);
        console.log('✅ Roles por defecto insertados.');
      }

      if (missingTables.includes('usuario')) {
        console.log('Creando tabla "usuario"...');
        await connection.query(`
          CREATE TABLE usuario (
            idUsuario INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            correo VARCHAR(100) NOT NULL UNIQUE,
            idRol INT,
            FOREIGN KEY (idRol) REFERENCES rol(idRol)
          )
        `);
        console.log('✅ Tabla "usuario" creada.');
      }

      if (missingTables.includes('rolpermiso')) {
        console.log('Creando tabla "rolpermiso"...');
        await connection.query(`
          CREATE TABLE rolpermiso (
            idRol INT,
            permiso VARCHAR(100),
            PRIMARY KEY (idRol, permiso),
            FOREIGN KEY (idRol) REFERENCES rol(idRol) ON DELETE CASCADE
          )
        `);
        console.log('✅ Tabla "rolpermiso" creada.');
      }
    } else {
      console.log('✅ Todas las tablas requeridas ("rol", "usuario", "rolpermiso") están presentes.');
    }

    console.log('\n🎉 ¡Configuración completada y funcionando correctamente!');
  } catch (err) {
    console.error('❌ Ocurrió un error procesando la base de datos:', err);
  } finally {
    await connection.end();
  }
}

testConnection();
