# 🍔 Chazin Food Backend API

Backend en Node.js + Express + MongoDB para el sistema de Chazin Food.

## 🚀 Cómo Empezar

### Prerrequisitos
- Node.js instalado (v18 o superior).
- MongoDB activo localmente.

### Instalación de dependencias
Ejecuta el siguiente comando en la raíz del proyecto para instalar las dependencias:
```bash
npm install
```

### Ejecución en modo desarrollo
Para ejecutar el servidor con auto-recarga por cambios:
```bash
npm run dev
```
El servidor arrancará por defecto en `http://localhost:5000`.

---

## 🛠️ Estructura del Proyecto (Arquitectura Modular)

El backend sigue un patrón modular limpio y organizado:

- `src/config/`: Configuración y conexiones externas (Base de datos).
- `src/models/`: Modelos y esquemas de base de datos definidos con Mongoose.
- `src/controllers/`: Funciones controladoras con la lógica de negocio por cada entidad.
- `src/routes/`: Enrutadores de Express que exponen los endpoints HTTP correspondientes.
- `src/middlewares/`: Funciones middleware para autenticación (JWT) y manejo centralizado de errores.

---

## 🔒 Endpoints Disponibles

### Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registro de usuario cliente.
- `POST /api/auth/login` - Autenticación y obtención de JWT.
- `GET /api/auth/profile` - Perfil de usuario (Protegido con JWT).

### Productos (`/api/products`)
- `GET /api/products` - Listar todos los productos del menú.
- `GET /api/products/:id` - Detalle de un producto.
- `POST /api/products` - Crear producto (Solo administrador).
- `PUT /api/products/:id` - Actualizar producto (Solo administrador).
- `DELETE /api/products/:id` - Eliminar producto (Solo administrador).

### Órdenes y Compras (`/api/orders`)
- `POST /api/orders` - Crear una nueva orden/venta (Público/Cliente/Invitado).
- `GET /api/orders` - Listar todas las órdenes (Solo cocineros y administradores).
- `GET /api/orders/:id` - Ver detalle de una orden (Protegido).
- `PUT /api/orders/:id/status` - Actualizar el estado de la orden (Solo cocineros y administradores).
