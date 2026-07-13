const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Producto no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { nombre, precio, descripcion, imagen, stock, categoria, adiciones } = req.body;

    const product = new Product({
      nombre,
      precio,
      descripcion,
      imagen: imagen || '',
      stock: stock || 0,
      categoria,
      adiciones: adiciones || []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { nombre, precio, descripcion, imagen, stock, categoria, adiciones } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.nombre = nombre || product.nombre;
      product.precio = precio !== undefined ? precio : product.precio;
      product.descripcion = descripcion || product.descripcion;
      product.imagen = imagen || product.imagen;
      product.stock = stock !== undefined ? stock : product.stock;
      product.categoria = categoria || product.categoria;
      product.adiciones = adiciones || product.adiciones;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Producto no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404);
      throw new Error('Producto no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
