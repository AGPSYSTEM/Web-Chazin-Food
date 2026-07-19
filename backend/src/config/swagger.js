const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Chazin Food API',
    version: '1.0.0',
    description: 'Documentación interactiva de la API RESTful de Chazin Food. Permite probar peticiones GET, POST, PUT, DELETE, etc.',
    contact: {
      name: 'Soporte Chazin Food'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor de Desarrollo Local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Introduce el token JWT devuelto en el login con el formato: Bearer [token]'
      }
    }
  }
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Path to the API docs (where route definitions are located)
  apis: ['./src/routes/*.js', './src/config/swagger.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación & Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contrasena
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@chazinfood.com
 *               contrasena:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token JWT y los datos del usuario.
 *       401:
 *         description: Credenciales incorrectas o cuenta inactiva.
 * 
 * /api/usuarios/registro:
 *   post:
 *     summary: Registrar un nuevo usuario (Rol Cliente por defecto)
 *     tags: [Autenticación & Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUsuario
 *               - nombre
 *               - apellidos
 *               - email
 *               - contrasena
 *             properties:
 *               idUsuario:
 *                 type: integer
 *                 description: Número de documento de identidad del usuario
 *                 example: 1033183034
 *               nombre:
 *                 type: string
 *                 example: Alexis
 *               apellidos:
 *                 type: string
 *                 example: Gómez Pavas
 *               tipoDocumento:
 *                 type: string
 *                 example: C.C.
 *               email:
 *                 type: string
 *                 example: gomezpavas34@gmail.com
 *               contrasena:
 *                 type: string
 *                 example: 1033183034
 *               telefono:
 *                 type: string
 *                 example: 3023155969
 *               direccion:
 *                 type: string
 *                 example: Calle 10 # 5-20
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 * 
 * /api/usuarios/recuperar-contrasena:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Autenticación & Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: gomezpavas34@gmail.com
 *     responses:
 *       200:
 *         description: Instrucciones de restablecimiento enviadas por email.
 * 
 * /api/usuarios/restablecer-contrasena:
 *   post:
 *     summary: Restablecer contraseña con token JWT
 *     tags: [Autenticación & Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - email
 *               - contrasena
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT recibido en el enlace de recuperación
 *               email:
 *                 type: string
 *                 example: gomezpavas34@gmail.com
 *               contrasena:
 *                 type: string
 *                 description: Nueva contraseña (mínimo 6 caracteres)
 *                 example: NuevaContrase123
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente.
 *       400:
 *         description: Token inválido o contraseña muy corta.
 * 
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Autenticación & Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios del sistema.
 *   post:
 *     summary: Crear un nuevo usuario administrativamente (con rol libre)
 *     tags: [Autenticación & Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documento
 *               - nombre
 *               - apellidos
 *               - email
 *               - password
 *               - idRolStr
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "1099888777"
 *               tipoDocumento:
 *                 type: string
 *                 example: "C.C."
 *               nombre:
 *                 type: string
 *                 example: "Carlos"
 *               apellidos:
 *                 type: string
 *                 example: "López"
 *               email:
 *                 type: string
 *                 example: "carlos@chazinfood.com"
 *               telefono:
 *                 type: string
 *                 example: "3195556677"
 *               password:
 *                 type: string
 *                 example: "carlos123"
 *               idRolStr:
 *                 type: string
 *                 description: "ID de Rol (1=Administrador, 2=Cocinero, 3=Cliente)"
 *                 example: "2"
 *               direccion:
 *                 type: string
 *                 description: "Requerida si el rol es Cliente (3)"
 *                 example: ""
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 * 
 * /api/usuarios/{idUsuario}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Autenticación & Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID (número de documento) del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               tipoDocumento:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               idRolStr:
 *                 type: string
 *               estado:
 *                 type: string
 *                 example: "Activo"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *   delete:
 *     summary: Inactivar/Eliminar usuario (cambia estado a INACTIVO)
 *     tags: [Autenticación & Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID (número de documento) del usuario a inactivar
 *     responses:
 *       200:
 *         description: Usuario inactivado exitosamente.
 * 
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles con sus permisos asociados
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles del sistema.
 * 
 * /api/roles/{idRol}/permisos:
 *   put:
 *     summary: Actualizar los permisos asociados a un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idRol
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a actualizar (1=Administrador, 2=Cocinero, 3=Cliente)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permisos
 *             properties:
 *               permisos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Dashboard", "Productos", "Fichas Técnicas", "Gestión de Producción"]
 *     responses:
 *       200:
 *         description: Permisos de rol actualizados exitosamente.
 * 
 * /api/insumos:
 *   get:
 *     summary: Obtener lista de insumos
 *     tags: [Compras & Insumos]
 *     responses:
 *       200:
 *         description: Lista de insumos activos.
 * 
 * /api/proveedores:
 *   get:
 *     summary: Obtener lista de proveedores
 *     tags: [Compras & Insumos]
 *     responses:
 *       200:
 *         description: Lista de proveedores.
 */
