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
    if (error.message === 'IN_USE') {
      return res.status(400).json({ message: 'No se puede eliminar el insumo porque está siendo utilizado en un insumo preparado' });
    }
    next(error);
  }
};

const getDeletedInsumos = async (req, res, next) => {
  try {
    const insumos = await InsumoModel.getDeleted();
    res.json(insumos);
  } catch (error) {
    next(error);
  }
};

const restoreInsumo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restored = await InsumoModel.restore(id);
    
    if (!restored) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    
    const restoredInsumo = await InsumoModel.getById(id);
    res.json({ message: 'Insumo restaurado correctamente', data: restoredInsumo });
  } catch (error) {
    next(error);
  }
};

const permanentDeleteInsumo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await InsumoModel.permanentDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    
    res.json({ message: 'Insumo eliminado permanentemente' });
  } catch (error) {
    if (error.message === 'NOT_IN_TRASH') {
      return res.status(400).json({ message: 'Solo se pueden eliminar permanentemente insumos que estén en la papelera' });
    }
    next(error);
  }
};

module.exports = {
  getInsumos,
  getInsumoById,
  createInsumo,
  updateInsumo,
  deleteInsumo,
  getDeletedInsumos,
  restoreInsumo,
  permanentDeleteInsumo
};
