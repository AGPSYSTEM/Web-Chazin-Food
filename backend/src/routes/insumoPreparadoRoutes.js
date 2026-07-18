const express = require('express');
const router = express.Router();
const insumoPreparadoController = require('../controllers/insumoPreparadoController');

router.route('/')
  .get(insumoPreparadoController.getPreparados)
  .post(insumoPreparadoController.createPreparado);

router.get('/deleted', insumoPreparadoController.getDeletedPreparados);
router.put('/:id/restore', insumoPreparadoController.restorePreparado);
router.delete('/:id/permanent', insumoPreparadoController.permanentDeletePreparado);

router.route('/:id')
  .put(insumoPreparadoController.updatePreparado)
  .delete(insumoPreparadoController.deletePreparado);

module.exports = router;
