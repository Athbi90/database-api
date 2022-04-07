const { Product, Stock } = require("../../db/models");

// Add Stock
exports.addStock = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.body.productId);
    if (product) {
      const newStock = await Stock.create(req.body);
      res.status(201).json(newStock);
    }
  } catch (err) {
    next(err);
  }
};

// Get Stock
exports.fetchStock = async (stockId, next) => {
  try {
    const stock = await Stock.findByPk(stockId);
    return stock;
  } catch (err) {
    next(err);
  }
};

// Update Stock
exports.updateStock = async (req, res, next) => {
  try {
    const stock = await Stock.findByPk(req.body.stockId);
    await stock.update(req.body);
    res.json(stock);
  } catch (err) {
    next(err);
  }
};

// Delete stock
exports.deleteStock = async (req, res, next) => {
  try {
    const stock = await Stock.findByPk(req.body.stockId);
    await stock.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// List Stocks
exports.listStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (err) {
    next(err);
  }
};
