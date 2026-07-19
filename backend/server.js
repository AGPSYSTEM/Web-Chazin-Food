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

// Configure Helmet with relaxed directives (Swagger requires inline assets)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Swagger UI Route - Bypass Helmet CSP to render UI properly
app.use('/api-docs', (req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com"
  );
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Welcome Route with Premium Interactive REST API Documentation
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chazin Food | RESTful API Documentation</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #F05454;
      --primary-hover: #e04343;
      --bg: #0B132B;
      --card-bg: rgba(28, 37, 65, 0.6);
      --border: rgba(255, 255, 255, 0.08);
      --text: #F4F6F9;
      --text-muted: #8C9FB8;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Outfit', sans-serif;
      background-color: var(--bg);
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(240, 84, 84, 0.1) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(48, 71, 94, 0.15) 0%, transparent 50%);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.6;
      padding: 40px 20px;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .logo {
      font-size: 50px;
      margin-bottom: 15px;
      display: inline-block;
      filter: drop-shadow(0 0 15px rgba(240, 84, 84, 0.4));
      animation: pulse 2s infinite alternate;
    }
    
    @keyframes pulse {
      from { transform: scale(1); }
      to { transform: scale(1.05); }
    }
    
    h1 {
      font-size: 36px;
      font-weight: 800;
      background: linear-gradient(135deg, #FFF 30%, var(--primary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    
    .subtitle {
      color: var(--text-muted);
      font-size: 16px;
      font-weight: 300;
      margin-bottom: 25px;
    }
    
    .btn-swagger {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, var(--primary) 0%, #ff6b8b 100%);
      color: white;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 30px;
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 8px 25px rgba(240, 84, 84, 0.3);
      transition: all 0.3s ease;
    }
    
    .btn-swagger:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(240, 84, 84, 0.4);
    }
    
    .status-bar {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 30px;
    }
    
    .status-badge {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 8px 16px;
      border-radius: 30px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #2ECC71;
      box-shadow: 0 0 8px #2ECC71;
    }
    
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 25px;
      margin-top: 40px;
    }
    
    .card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    
    .card h2 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      border-left: 4px solid var(--primary);
      padding-left: 12px;
    }
    
    .endpoint {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 12px;
      padding: 12px 20px;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    @media (min-width: 600px) {
      .endpoint {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
    
    .endpoint-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .method {
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: 70px;
      text-align: center;
    }
    
    .get { background: rgba(46, 204, 113, 0.15); color: #2ECC71; }
    .post { background: rgba(52, 152, 219, 0.15); color: #3498DB; }
    .put { background: rgba(241, 196, 15, 0.15); color: #F1C40F; }
    .delete { background: rgba(231, 76, 60, 0.15); color: #E74C3C; }
    
    .path {
      font-family: monospace;
      font-size: 14px;
      color: #FFF;
      font-weight: bold;
    }
    
    .desc {
      font-size: 13px;
      color: var(--text-muted);
    }
    
    footer {
      text-align: center;
      margin-top: 50px;
      color: var(--text-muted);
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">🍳</div>
      <h1>Chazin Food RESTful API</h1>
      <p class="subtitle">Servicio de Backend Activo y Listo para Conexiones</p>
      
      <a href="/api-docs" class="btn-swagger">
        ⚡ Ir a Swagger UI (Panel Interactivo)
      </a>
      
      <div class="status-bar">
        <div class="status-badge">
          <div class="dot"></div>
          Servidor: Online
        </div>
        <div class="status-badge">
          <div class="dot"></div>
          Base de Datos: MySQL
        </div>
        <div class="status-badge">
          Puerto: ${PORT}
        </div>
      </div>
    </header>
    
    <div class="grid">
      <!-- Sección Autenticación y Usuarios -->
      <div class="card">
        <h2>Gestión de Autenticación y Usuarios</h2>
        
        <div class="endpoint">
          <div class="endpoint-left">
            <span class="method post">POST</span>
            <span class="path">/api/usuarios/registro</span>
          </div>
          <span class="desc">Registrar un nuevo cliente en el sistema</span>
        </div>
        
        <div class="endpoint">
          <div class="endpoint-left">
            <span class="method post">POST</span>
            <span class="path">/api/usuarios/login</span>
          </div>
          <span class="desc">Autenticar un usuario y obtener token JWT</span>
        </div>
        
        <div class="endpoint">
          <div class="endpoint-left">
            <span class="method post">POST</span>
            <span class="path">/api/usuarios/recuperar-contrasena</span>
          </div>
          <span class="desc">Solicitar enlace de recuperación por email (Nodemailer)</span>
        </div>
        
        <div class="endpoint">
          <div class="endpoint-left">
            <span class="method post">POST</span>
            <span class="path">/api/usuarios/restablecer-contrasena</span>
          </div>
          <span class="desc">Restablecer la contraseña usando token JWT</span>
        </div>

        <div class="endpoint">
          <div class="endpoint-left">
            <span class="method get">GET</span>
            <span class="path">/api/usuarios</span>
          </div>
          <span class="desc">Listar todos los usuarios (Requiere Auth)</span>
        </div>
      </div>
      
      <!-- Sección Compras e Insumos -->
      <div class="card">
        <h2>Gestión de Compras e Insumos</h2>
        
        <div class="endpoint">
          <div class="endpoint-left">
            <span class="method get">GET</span>
            <span class="path">/api/insumos</span>
          </div>
          <span class="desc">Obtener lista de insumos</span>
        </div>
        
        <div class="endpoint">
          <div class="endpoint-left">
            <span class="method get">GET</span>
            <span class="path">/api/categorias-insumo</span>
          </div>
          <span class="desc">Obtener categorías de insumos</span>
        </div>
        
        <div class="endpoint">
          <div class="endpoint-left">
            <span class="method get">GET</span>
            <span class="path">/api/proveedores</span>
          </div>
          <span class="desc">Obtener lista de proveedores registrados</span>
        </div>
      </div>
    </div>
    
    <footer>
      <p>&copy; 2026 Chazin Food. Todos los derechos reservados.</p>
    </footer>
  </div>
</body>
</html>
  `);
});

// Traduced APIs to Spanish
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
