const dotenv = require('dotenv');
// Load environment variables as early as possible
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middlewares/errorMiddleware');
const { swaggerUi, swaggerSpec } = require('./src/config/swagger');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Configure Helmet - disable CSP entirely so Swagger UI renders without issues
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Swagger UI served at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { background-color: #F05454; }',
  customSiteTitle: 'Chazin Food - API Docs'
}));

// Root route redirects directly to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// APIs in Spanish
app.use('/api/autenticacion', require('./src/routes/authRoutes'));
app.use('/api/categorias', require('./src/routes/categoryRoutes'));
app.use('/api/usuarios', require('./src/routes/userRoutes'));
app.use('/api/productos', require('./src/routes/productRoutes'));
app.use('/api/pedidos', require('./src/routes/orderRoutes'));
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
