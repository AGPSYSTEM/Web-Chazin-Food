const CategoriaInsumoModel = require('../models/categoriaInsumoModel');

const getCategorias = async (req, res, next) => {
  try {
    const categorias = await CategoriaInsumoModel.getAll();
    res.json(categorias);
  } catch (error) {
    next(error);
  }
};

const createCategoria = async (req, res, next) => {
  try {
    const id = await CategoriaInsumoModel.create(req.body);
    const categoria = await CategoriaInsumoModel.getById(id);
    res.status(201).json({ message: 'Categoría creada', data: categoria });
  } catch (error) {
    next(error);
  }
};

const updateCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await CategoriaInsumoModel.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    const categoria = await CategoriaInsumoModel.getById(id);
    res.json({ message: 'Categoría actualizada', data: categoria });
  } catch (error) {
    next(error);
  }
};

const deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await CategoriaInsumoModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
};
