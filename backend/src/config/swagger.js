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
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Auxiliar de Cocina
 *               descripcion:
 *                 type: string
 *                 example: Apoyo en preparación de insumos
 *     responses:
 *       201:
 *         description: Rol creado exitosamente.
 *       400:
 *         description: Nombre del rol es requerido.
 * 
 * /api/roles/{idRol}:
 *   put:
 *     summary: Actualizar un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idRol
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Cocinero Principal
 *               descripcion:
 *                 type: string
 *                 example: Encargado de cocina y producción
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente.
 *       404:
 *         description: Rol no encontrado.
 *   delete:
 *     summary: Eliminar un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: idRol
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *     responses:
 *       200:
 *         description: Rol eliminado correctamente.
 *       400:
 *         description: No se puede eliminar el rol de Administrador.
 *       404:
 *         description: Rol no encontrado.
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
 *     summary: Obtener lista de insumos activos
 *     tags: [Insumos]
 *     responses:
 *       200:
 *         description: Lista de insumos activos obtenida exitosamente.
 *   post:
 *     summary: Crear un nuevo insumo
 *     tags: [Insumos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - idCategoriaInsumo
 *               - stock
 *               - unidadMedida
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Harina de Trigo
 *               idCategoriaInsumo:
 *                 type: integer
 *                 example: 1
 *               stock:
 *                 type: number
 *                 example: 50
 *               unidadMedida:
 *                 type: string
 *                 example: kg
 *               precioUnitario:
 *                 type: number
 *                 example: 1200.00
 *               idProveedor:
 *                 type: integer
 *                 example: 2
 *               descripcion:
 *                 type: string
 *                 example: Harina de trigo refinada tipo 0000
 *     responses:
 *       201:
 *         description: Insumo creado correctamente.
 * 
 * /api/insumos/deleted:
 *   get:
 *     summary: Obtener lista de insumos eliminados (papelera)
 *     tags: [Insumos]
 *     responses:
 *       200:
 *         description: Lista de insumos eliminados en la papelera.
 * 
 * /api/insumos/{id}:
 *   get:
 *     summary: Obtener insumo por ID
 *     tags: [Insumos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a obtener
 *     responses:
 *       200:
 *         description: Insumo encontrado.
 *       404:
 *         description: Insumo no encontrado.
 *   put:
 *     summary: Actualizar un insumo existente
 *     tags: [Insumos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               idCategoriaInsumo:
 *                 type: integer
 *               stock:
 *                 type: number
 *               unidadMedida:
 *                 type: string
 *               precioUnitario:
 *                 type: number
 *               idProveedor:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Insumo actualizado correctamente.
 *       404:
 *         description: Insumo no encontrado.
 *   delete:
 *     summary: Eliminar lógicamente un insumo (mover a papelera)
 *     tags: [Insumos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a eliminar lógicamente
 *     responses:
 *       200:
 *         description: Insumo eliminado correctamente.
 *       400:
 *         description: El insumo está en uso.
 *       404:
 *         description: Insumo no encontrado.
 * 
 * /api/insumos/{id}/restore:
 *   put:
 *     summary: Restaurar un insumo eliminado de la papelera
 *     tags: [Insumos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a restaurar
 *     responses:
 *       200:
 *         description: Insumo restaurado correctamente.
 *       404:
 *         description: Insumo no encontrado.
 * 
 * /api/insumos/{id}/permanent:
 *   delete:
 *     summary: Eliminar permanentemente un insumo de la papelera
 *     tags: [Insumos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a eliminar de forma permanente
 *     responses:
 *       200:
 *         description: Insumo eliminado permanentemente.
 *       400:
 *         description: El insumo no está en la papelera.
 *       404:
 *         description: Insumo no encontrado.
 * 
 * /api/insumos-preparados:
 *   get:
 *     summary: Obtener lista de insumos preparados activos
 *     tags: [Insumos Preparados]
 *     responses:
 *       200:
 *         description: Lista de insumos preparados activos.
 *   post:
 *     summary: Crear un nuevo insumo preparado con componentes
 *     tags: [Insumos Preparados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - unidadMedida
 *               - precioVenta
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Salsa Boloñesa Casa
 *               descripcion:
 *                 type: string
 *                 example: Salsa boloñesa artesanal preparada con carne e insumos frescos
 *               unidadMedida:
 *                 type: string
 *                 example: L
 *               precioVenta:
 *                 type: number
 *                 example: 15000.00
 *               componentes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - idInsumo
 *                     - cantidad
 *                     - unidadMedida
 *                     - precioUnitario
 *                   properties:
 *                     idInsumo:
 *                       type: integer
 *                       example: 1
 *                     cantidad:
 *                       type: number
 *                       example: 0.5
 *                     unidadMedida:
 *                       type: string
 *                       example: kg
 *                     precioUnitario:
 *                       type: number
 *                       example: 5000.00
 *     responses:
 *       201:
 *         description: Insumo preparado creado correctamente.
 * 
 * /api/insumos-preparados/deleted:
 *   get:
 *     summary: Obtener lista de insumos preparados eliminados (papelera)
 *     tags: [Insumos Preparados]
 *     responses:
 *       200:
 *         description: Lista de insumos preparados eliminados.
 * 
 * /api/insumos-preparados/{id}:
 *   put:
 *     summary: Actualizar un insumo preparado existente
 *     tags: [Insumos Preparados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo preparado a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               unidadMedida:
 *                 type: string
 *               precioVenta:
 *                 type: number
 *               componentes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idInsumo:
 *                       type: integer
 *                     cantidad:
 *                       type: number
 *                     unidadMedida:
 *                       type: string
 *                     precioUnitario:
 *                       type: number
 *     responses:
 *       200:
 *         description: Insumo preparado actualizado correctamente.
 *       404:
 *         description: Insumo preparado no encontrado.
 *   delete:
 *     summary: Eliminar lógicamente un insumo preparado (mover a papelera)
 *     tags: [Insumos Preparados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo preparado a eliminar lógicamente
 *     responses:
 *       200:
 *         description: Insumo preparado eliminado lógicamente.
 *       404:
 *         description: Insumo preparado no encontrado.
 * 
 * /api/insumos-preparados/{id}/restore:
 *   put:
 *     summary: Restaurar un insumo preparado eliminado de la papelera
 *     tags: [Insumos Preparados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo preparado a restaurar
 *     responses:
 *       200:
 *         description: Insumo preparado restaurado correctamente.
 *       404:
 *         description: Insumo preparado no encontrado.
 * 
 * /api/insumos-preparados/{id}/permanent:
 *   delete:
 *     summary: Eliminar permanentemente un insumo preparado de la papelera
 *     tags: [Insumos Preparados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo preparado a eliminar permanentemente
 *     responses:
 *       200:
 *         description: Insumo preparado eliminado permanentemente.
 *       400:
 *         description: El preparado no está en la papelera.
 *       404:
 *         description: Insumo preparado no encontrado.
 */
