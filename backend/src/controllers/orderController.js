const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const { items, total, metodoPago } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No hay ítems en la orden');
    }

    const order = new Order({
      cliente: req.user ? req.user._id : null,
      items,
      total,
      metodoPago: metodoPago || 'efectivo',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin/Cocinero
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('cliente', 'nombre correo');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('cliente', 'nombre correo');

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Orden no encontrada');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Cocinero
const updateOrderStatus = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.estado = estado || order.estado;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Orden no encontrada');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
