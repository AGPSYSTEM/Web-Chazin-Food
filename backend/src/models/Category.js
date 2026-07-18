const connectDB = require('../config/db');
const { pool } = connectDB;

const initCategoryDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categoria_insumo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) UNIQUE NOT NULL,
        descripcion VARCHAR(255),
        estado TINYINT DEFAULT 1
      )
    `);
    console.log('Tabla "categoria_insumo" inicializada correctamente.');
  } catch (error) {
    console.error('Error al inicializar la tabla "categoria_insumo":', error.message);
  }
};

// Run initialization immediately on file import (async, non-blocking)
initCategoryDB();

class Category {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.estado = data.estado;
  }

  // Create a new category
  static async create({ nombre, descripcion }) {
    const insertQuery = `
      INSERT INTO categoria_insumo (nombre, descripcion, estado)
      VALUES (?, ?, 1)
    `;
    const [result] = await pool.query(insertQuery, [nombre, descripcion || '']);
    return await Category.findById(result.insertId);
  }

  // Retrieve all categories
  static async findAll() {
    const query = 'SELECT id, nombre, descripcion, estado FROM categoria_insumo';
    const [rows] = await pool.query(query);
    return rows.map(row => new Category(row));
  }

  // Retrieve category by ID
  static async findById(id) {
    const query = 'SELECT id, nombre, descripcion, estado FROM categoria_insumo WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    return new Category(rows[0]);
  }

  // Find category by Name
  static async findByName(nombre) {
    const query = 'SELECT id, nombre, descripcion, estado FROM categoria_insumo WHERE nombre = ?';
    const [rows] = await pool.query(query, [nombre]);
    if (rows.length === 0) return null;
    return new Category(rows[0]);
  }

  // Update a category
  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(data.nombre);
    }
    if (data.descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(data.descripcion);
    }
    if (data.estado !== undefined) {
      fields.push('estado = ?');
      values.push(data.estado);
    }

    if (fields.length === 0) {
      return await Category.findById(id);
    }

    values.push(id);
    const updateQuery = `UPDATE categoria_insumo SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(updateQuery, values);

    return await Category.findById(id);
  }

  // Deactivate a category (logical delete)
  static async deactivate(id) {
    const query = 'UPDATE categoria_insumo SET estado = 0 WHERE id = ?';
    await pool.query(query, [id]);
    return true;
  }
}

// Attach initCategoryDB to Category class as well
Category.initCategoryDB = initCategoryDB;

module.exports = Category;
