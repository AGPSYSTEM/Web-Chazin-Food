const InsumoModel = require('../models/insumoModel');

const getInsumos = async (req, res, next) => {
  try {
    const insumos = await InsumoModel.getAll();
    res.json(insumos);
  } catch (error) {
    next(error);
  }
};

const getInsumoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const insumo = await InsumoModel.getById(id);
    
    if (!insumo) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    
    res.json(insumo);
  } catch (error) {
    next(error);
  }
};

const createInsumo = async (req, res, next) => {
  try {
    const newInsumoId = await InsumoModel.create(req.body);
    const newInsumo = await InsumoModel.getById(newInsumoId);
    res.status(201).json({ message: 'Insumo creado correctamente', data: newInsumo });
  } catch (error) {
    next(error);
  }
};

const updateInsumo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await InsumoModel.update(id, req.body);
    
    if (!updated) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    
    const updatedInsumo = await InsumoModel.getById(id);
    res.json({ message: 'Insumo actualizado correctamente', data: updatedInsumo });
  } catch (error) {
    next(error);
  }
};

const deleteInsumo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await InsumoModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    
    res.json({ message: 'Insumo eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInsumos,
  getInsumoById,
  createInsumo,
  updateInsumo,
  deleteInsumo
};
