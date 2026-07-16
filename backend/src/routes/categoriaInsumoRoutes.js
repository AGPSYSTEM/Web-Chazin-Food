const express = require('express');
const router = express.Router();
const categoriaInsumoController = require('../controllers/categoriaInsumoController');

router.route('/')
  .get(categoriaInsumoController.getCategorias)
  .post(categoriaInsumoController.createCategoria);

router.route('/:id')
  .put(categoriaInsumoController.updateCategoria)
  .delete(categoriaInsumoController.deleteCategoria);

module.exports = router;
