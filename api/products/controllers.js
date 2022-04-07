// Model
const { Product, Stock } = require("../../db/models");

// Add Product
exports.addProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

// Get Product
exports.fetchProduct = async (productId, next) => {
  try {
    const product = await Product.findByPk(productId);
    return product;
  } catch (err) {
    next(err);
  }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.body.productId);
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.body.productId);
    await product.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// List Products
exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: {
        model: Stock,
        as: "stocks",
        attributes: { exclude: ["createdAt", "updatedAt", "productId"] },
      },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};
