const mongoose = require('mongoose');

const additionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Por favor ingrese el nombre del producto'],
    },
    precio: {
      type: Number,
      required: [true, 'Por favor ingrese el precio del producto'],
    },
    descripcion: {
      type: String,
      required: [true, 'Por favor ingrese una descripción'],
    },
    imagen: {
      type: String,
    },
    stock: {
      type: Number,
      required: [true, 'Por favor ingrese el stock disponible'],
      default: 0,
    },
    categoria: {
      type: String,
      required: [true, 'Por favor ingrese la categoría'],
    },
    adiciones: [additionSchema]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
