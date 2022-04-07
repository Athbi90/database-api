const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  addStock,
  updateStock,
  fetchStock,
  deleteStock,
  listStocks,
} = require("./controllers");

// Params middleware
router.param("stockId", async (req, res, next, stockId) => {
  const stock = await fetchstock(stockId, next);
  if (stock) {
    req.stock = stock;
    next();
  } else {
    const err = new Error("Stock not found!");
    err.status = 401;
    next(err);
  }
});

// List All Stocks
router.get("/", listStocks);

// Add Stock
router.post("/", addStock);

// Update Stock
router.put("/", updateStock);

// Delete Stock
router.delete("/", deleteStock);

module.exports = router;
