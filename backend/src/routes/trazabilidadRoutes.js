const express = require('express');
const router = express.Router();
const trazabilidadController = require('../controllers/trazabilidadController');

router.get('/', trazabilidadController.getAllEventos);
router.post('/', trazabilidadController.createEvento);
router.delete('/clear', trazabilidadController.clearEventos);
router.put('/read-all', trazabilidadController.markAllAsRead);

module.exports = router;
