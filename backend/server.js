const dotenv = require('dotenv');
// Load environment variables as early as possible
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middlewares/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Welcome Route
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Chazin Food!' });
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/roles', require('./src/routes/roleRoutes'));
app.use('/api/insumos', require('./src/routes/insumoRoutes'));
app.use('/api/categorias-insumo', require('./src/routes/categoriaInsumoRoutes'));
app.use('/api/insumos-preparados', require('./src/routes/insumoPreparadoRoutes'));
app.use('/api/proveedores', require('./src/routes/proveedorRoutes'));
app.use('/api/trazabilidad', require('./src/routes/trazabilidadRoutes'));
// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT} en modo ${process.env.NODE_ENV || 'development'}`);
});
