const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chazinfood');
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`);
    console.log('El backend continuará ejecutándose. Por favor asegúrate de que MongoDB esté activo.');
  }
};

module.exports = connectDB;
