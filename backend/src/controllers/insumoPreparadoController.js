const InsumoPreparadoModel = require('../models/insumoPreparadoModel');

const getPreparados = async (req, res, next) => {
  try {
    const preparados = await InsumoPreparadoModel.getAll();
    res.json(preparados);
  } catch (error) {
    next(error);
  }
};

const createPreparado = async (req, res, next) => {
  try {
    const id = await InsumoPreparadoModel.create(req.body);
    const preparado = await InsumoPreparadoModel.getById(id);
    res.status(201).json({ message: 'Insumo preparado creado', data: preparado });
  } catch (error) {
    next(error);
  }
};

const updatePreparado = async (req, res, next) => {
  try {
    const { id } = req.params;
    await InsumoPreparadoModel.update(id, req.body);
    const preparado = await InsumoPreparadoModel.getById(id);
    res.json({ message: 'Insumo preparado actualizado', data: preparado });
  } catch (error) {
    next(error);
  }
};

const deletePreparado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await InsumoPreparadoModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'No encontrado' });
    }
    res.json({ message: 'Insumo preparado eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPreparados,
  createPreparado,
  updatePreparado,
  deletePreparado
};
