const TrazabilidadModel = require('../models/trazabilidadModel');

exports.getAllEventos = async (req, res, next) => {
  try {
    const eventos = await TrazabilidadModel.getAll();
    res.json(eventos);
  } catch (error) {
    next(error);
  }
};

exports.createEvento = async (req, res, next) => {
  try {
    const insertId = await TrazabilidadModel.create(req.body);
    res.status(201).json({ message: 'Evento de trazabilidad creado', id: insertId });
  } catch (error) {
    next(error);
  }
};

exports.clearEventos = async (req, res, next) => {
  try {
    await TrazabilidadModel.clearAll();
    res.json({ message: 'Todos los eventos eliminados' });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await TrazabilidadModel.markAllAsRead();
    res.json({ message: 'Todos los eventos marcados como leídos' });
  } catch (error) {
    next(error);
  }
};
