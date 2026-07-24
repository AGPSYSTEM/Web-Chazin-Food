# Chazin Food - Sistema Web Monolítico en Arquitectura por Capas

Este repositorio contiene el sistema web integral para la gestión de restaurante, control de inventario, proveedores, insumos, productos y pedidos de **Chazin Food**.

El proyecto ha sido completamente refactorizado eliminando la antigua separación en subcarpetas independientes de cliente-servidor (`backend` y `frontend`), consolidando el código en una **Arquitectura por Capas (Layered Architecture)** unificada con acceso a datos gestionado mediante **Sequelize ORM** sobre MySQL.

---

## 🏛️ Arquitectura del Sistema: Arquitectura por Capas (*Layered Architecture*)

Toda la aplicación está estructurada dentro del directorio `src/` bajo un patrón de capas horizontales con responsabilidades bien delimitadas:

```text
Web-Chazin-Food-develop/
├── README.md                    # Documentación y guía de publicación en GitHub
├── package.json                 # Gestión unificada de dependencias
├── server.js                    # Punto de entrada y servidor Express monolítico
├── index.html / vite.config.ts  # Configuración y empaquetador de interfaz
└── src/                         # Código fuente unificado por capas
    ├── presentation/            # CAPA DE PRESENTACIÓN
    │   ├── components/          # Componentes visuales de interfaz de usuario
    │   ├── pages/               # Vistas y páginas principales de la aplicación
    │   ├── controllers/         # Controladores HTTP (Manejo de req, res y códigos de estado)
    │   └── routes/              # Mapeo de rutas y endpoints de la API REST
    │
    ├── application/             # CAPA DE APLICACIÓN (LÓGICA DE NEGOCIO)
    │   ├── services/            # Servicios de negocio (AuthService, UserService, InsumoService, etc.)
    │   └── state/               # Estado de aplicación y hooks personalizados
    │
    ├── domain/                  # CAPA DE DOMINIO
    │   └── entities/            # Definiciones de tipos y entidades del negocio
    │
    ├── persistence/             # CAPA DE PERSISTENCIA (ACCESO A DATOS CON ORM)
    │   ├── config/              # Conexión Sequelize ORM a la base de datos MySQL (db.js)
    │   └── models/              # Modelos y asociaciones relacionales Sequelize
    │
    └── infrastructure/          # CAPA DE INFRAESTRUCTURA
        ├── middlewares/         # Middlewares de seguridad JWT y gestión de errores
        └── swagger/             # Documentación interactiva de la API con OpenAPI/Swagger
```

---

## 🔄 Migración de SQL Nativo a ORM (Sequelize)

Anteriormente, el acceso a la base de datos se realizaba mediante consultas nativas manuales en SQL puro (`pool.query('SELECT...')`). En esta nueva arquitectura:

1. **Modelos Declarativos**: Se definieron modelos relacionales estructurados (`User`, `Role`, `Permiso`, `CategoriaInsumo`, `Insumo`, `InsumoPreparado`, `Proveedor`, `Trazabilidad`, `Product`, `Order`) utilizando **Sequelize ORM**.
2. **Relaciones e Integridad**: Se establecieron asociaciones nativas (`belongsTo`, `hasMany`, `belongsToMany`) facilitando consultas complejas e inserciones estructuradas.
3. **Capa de Servicios**: Los controladores ya no ejecutan SQL directo; únicamente invocan los métodos de la capa `application/services`, garantizando máxima mantenibilidad y facilidad de pruebas.

---

## 🚀 Requisitos Previos e Instalación

### Requisitos
- **Node.js**: Versión 18.x o superior.
- **MySQL Server**: Instancia en ejecución con la base de datos `chazinfood`.

### Instalación de Dependencias
Ejecuta en la raíz del proyecto:
```bash
npm install
```

---

## 💻 Ejecución del Proyecto

### Modo Desarrollo
Inicia el servidor unificado con recarga automática:
```bash
npm run dev
```

### Modo Producción
Compila la interfaz y arranca el servidor monolítico:
```bash
npm run build
npm start
```

### Documentación de la API (Swagger UI)
Una vez iniciado el servidor, puedes acceder a la documentación interactiva de la API en:
👉 `http://localhost:5000/api-docs`

---

## 📤 Guía para Subir los Cambios al Repositorio de GitHub

Para publicar todos estos cambios en el repositorio remoto oficial:  
🔗 `https://github.com/GUTI2007/AGPSYSTEM-Web-Chazin-Foodv2.git`

Sigue estos comandos desde la terminal en la raíz del proyecto:

```bash
# 1. Configurar la URL del repositorio remoto
git remote set-url origin https://github.com/GUTI2007/AGPSYSTEM-Web-Chazin-Foodv2.git

# 2. Agregar todos los archivos refactorizados
git add .

# 3. Crear el commit en español
git commit -m "feat: reestructuración completa a Arquitectura por Capas unificada y migración de SQL nativo a Sequelize ORM"

# 4. Asegurar la rama principal y subir al servidor remoto
git branch -M main
git push -u origin main
```

*(Si es un repositorio nuevo o no has vinculado la rama aún, puedes ejecutar `git init` antes del paso 1).*
