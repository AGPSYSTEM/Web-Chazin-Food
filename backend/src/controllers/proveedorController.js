const ProveedorModel = require('../models/proveedorModel');

exports.getAllProveedores = async (req, res, next) => {
  try {
    const proveedores = await ProveedorModel.getAll();
    res.json(proveedores);
  } catch (error) {
    next(error);
  }
};

exports.getProveedorById = async (req, res, next) => {
  try {
    const proveedor = await ProveedorModel.getById(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (error) {
    next(error);
  }
};

exports.createProveedor = async (req, res, next) => {
  try {
    const insertId = await ProveedorModel.create(req.body);
    res.status(201).json({ message: 'Proveedor creado', id: insertId });
  } catch (error) {
    next(error);
  }
};

exports.updateProveedor = async (req, res, next) => {
  try {
    const updated = await ProveedorModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json({ message: 'Proveedor actualizado' });
  } catch (error) {
    next(error);
  }
};

exports.deleteProveedor = async (req, res, next) => {
  try {
    const deleted = await ProveedorModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json({ message: 'Proveedor eliminado' });
  } catch (error) {
    next(error);
  }
};
