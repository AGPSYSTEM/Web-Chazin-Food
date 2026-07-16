const express = require('express');
const router = express.Router();
const insumoPreparadoController = require('../controllers/insumoPreparadoController');

router.route('/')
  .get(insumoPreparadoController.getPreparados)
  .post(insumoPreparadoController.createPreparado);

router.route('/:id')
  .put(insumoPreparadoController.updatePreparado)
  .delete(insumoPreparadoController.deletePreparado);

module.exports = router;
