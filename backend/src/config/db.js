const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ?? '12345',
  database: process.env.DB_NAME || 'chazinfood',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Conectado a la base de datos "chazinfood"');
    connection.release();
  } catch (error) {
    console.error(`Error de conexión a MySQL: ${error.message}`);
    console.log('El backend continuará ejecutándose. Por favor asegúrate de que MySQL esté activo.');
  }
};

connectDB.pool = pool;

module.exports = connectDB;

