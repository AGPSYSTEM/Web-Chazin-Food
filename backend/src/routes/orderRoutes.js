const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .post(createOrder) // Allow public guest checkouts
  .get(protect, authorize('administrador', 'cocinero'), getOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, authorize('administrador', 'cocinero'), updateOrderStatus);

module.exports = router;
