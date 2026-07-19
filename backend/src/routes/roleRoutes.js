const express = require('express');
const router = express.Router();
const {
  getRoles,
  createRole,
  updateRole,
  updateRolePermisos,
  deleteRole
} = require('../controllers/roleController');

router.route('/')
  .get(getRoles)
  .post(createRole);

router.route('/:id')
  .put(updateRole)
  .delete(deleteRole);

router.route('/:id/permisos')
  .put(updateRolePermisos);

module.exports = router;
