const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('administrador'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('administrador'), updateProduct)
  .delete(protect, authorize('administrador'), deleteProduct);

module.exports = router;
