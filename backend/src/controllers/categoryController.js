const Category = require('../models/Category');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || !nombre.trim()) {
      res.status(400);
      throw new Error('El nombre de la categoría es obligatorio');
    }

    const trimmedName = nombre.trim();

    // Check if category name already exists
    const categoryExists = await Category.findByName(trimmedName);
    if (categoryExists) {
      res.status(400);
      throw new Error('La categoría ya existe');
    }

    const category = await Category.create({
      nombre: trimmedName,
      descripcion: descripcion ? descripcion.trim() : ''
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category by ID
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404);
      throw new Error('Categoría no encontrada');
    }

    const updateData = {};

    if (nombre !== undefined) {
      const trimmedName = nombre.trim();
      if (!trimmedName) {
        res.status(400);
        throw new Error('El nombre de la categoría no puede estar vacío');
      }
      
      // If name is changing, check uniqueness
      if (trimmedName !== category.nombre) {
        const categoryExists = await Category.findByName(trimmedName);
        if (categoryExists) {
          res.status(400);
          throw new Error('Ya existe una categoría con ese nombre');
        }
      }
      updateData.nombre = trimmedName;
    }

    if (descripcion !== undefined) {
      updateData.descripcion = descripcion ? descripcion.trim() : '';
    }

    if (estado !== undefined) {
      updateData.estado = estado;
    }

    const updatedCategory = await Category.update(id, updateData);
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate/Inactivate a category (logical delete)
// @route   DELETE /api/categories/:id
// @access  Private
const deactivateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404);
      throw new Error('Categoría no encontrada');
    }

    await Category.deactivate(id);
    res.json({ message: 'Categoría desactivada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deactivateCategory
};
