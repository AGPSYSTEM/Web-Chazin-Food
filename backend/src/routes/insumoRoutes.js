const express = require('express');
const router = express.Router();
const insumoController = require('../controllers/insumoController');
// const { protect } = require('../middlewares/authMiddleware'); // Uncomment if authentication is needed

router.route('/')
  .get(insumoController.getInsumos)
  .post(insumoController.createInsumo);

router.get('/deleted', insumoController.getDeletedInsumos);
router.put('/:id/restore', insumoController.restoreInsumo);
router.delete('/:id/permanent', insumoController.permanentDeleteInsumo);

router.route('/:id')
  .get(insumoController.getInsumoById)
  .put(insumoController.updateInsumo)
  .delete(insumoController.deleteInsumo);

module.exports = router;
