const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  nombre: String,
  precio: Number,
  cantidad: { type: Number, required: true },
  adiciones: [
    {
      nombre: String,
      precio: Number,
      cantidad: Number
    }
  ]
});

const orderSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // can be guest or registered user
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true
    },
    estado: {
      type: String,
      enum: ['pendiente', 'en_preparacion', 'completado', 'cancelado'],
      default: 'pendiente'
    },
    metodoPago: {
      type: String,
      enum: ['efectivo', 'tarjeta', 'nequi', 'daviplata'],
      default: 'efectivo'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
