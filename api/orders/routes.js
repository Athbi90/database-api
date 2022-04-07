const express = require("express");
const router = express.Router();
const passport = require("passport");

// Controllers
const {
  getPrice,
  addOrder,
  updateQuantity,
  cancelOrder,
  updateOrder,
  deleteOrder,
} = require("./controllers");

router.get("/price", getPrice);

router.post("/create", addOrder);

router.put("/updateQuantity", updateQuantity);

router.put("/cancel", cancelOrder);

router.put("/update", updateOrder);

router.delete("/delete", deleteOrder);

module.exports = router;
