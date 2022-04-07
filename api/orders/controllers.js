// Import models needed
const { Order, Product, Stock, OrderItem } = require("../../db/models");
const product = require("../../db/models/product");

// Add Order
exports.addOrder = async (req, res, next) => {
  try {
    const [price, productsList] = await this.getPrice(
      req.body.products,
      res,
      next
    );
    const newOrder = await Order.create({ ...req.body, price: price });

    // Create cart of our items with orderId
    const cart = productsList.map((item) => ({
      ...item,
      stockId: item.id,
      orderId: newOrder.id,
    }));

    // Create OrderItems and deduct the quantity from stocks
    await OrderItem.bulkCreate(cart);
    await productsList.forEach(async (product) => {
      let item = await Stock.findByPk(product.id);
      await item.update({ ...item, stock: item.stock - product.quantity });
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

// Get total price of products
exports.getPrice = async (products, res, next) => {
  try {
    let price = 0;

    const productsList = await Promise.all(
      products.map(async (product) => ({
        ...(await Stock.findByPk(product.stockId, {
          raw: true,
          include: {
            model: Product,
            as: "product",
            attributes: ["name", "price"],
          },
        })),
        quantity: product.quantity,
      }))
    );

    productsList.forEach((item) => {
      price = price + item["product.price"] * item.quantity;
    });
    return [price, productsList];
  } catch (error) {
    next(error);
  }
};

// Update Order Items Quantity
exports.updateQuantity = async (req, res, next) => {
  try {
    await req.body.products.forEach(async (product) => {
      let stock = await Stock.findByPk(product.stockId);
      let item = await OrderItem.findOne({
        where: { orderId: req.body.orderId, stockId: stock.id },
      });

      await stock.update({
        stock: stock.stock + item.quantity - product.quantity,
      });

      await item.update({ quantity: product.quantity });
    });

    const order = await Order.findByPk(req.body.orderId);
    const orderItems = await OrderItem.findAll({
      where: {
        orderId: req.body.orderId,
      },
      raw: true,
    });
    const [price, _] = await this.getPrice(orderItems, res, next);

    await order.update({ price: price });

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Cancel Order
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.body.orderId);
    const orderItems = await OrderItem.findAll({
      where: {
        orderId: order.id,
      },
      raw: true,
      attributes: { include: ["id"] },
    });

    await orderItems.forEach(async (product) => {
      let stock = await Stock.findByPk(product.stockId);
      await stock.update({
        stock: stock.stock + product.quantity,
      });
      let item = await OrderItem.findOne({
        where: {
          id: product.id,
        },
      });
      await item.update({ quantity: 0 });
    });
    await order.update({ status: "Cancelled" });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Update order details
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.body.orderId);
    req.body.price = order.price;
    await order.update({ ...req.body });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Delete order
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.body.orderId);

    if (order.status === "Cancelled") {
      await order.destroy();
      res.status(204).json({ message: "Order has been deleted!" }).end();
    } else {
      res
        .status(405)
        .json({ message: "Please cancel the order before delete" })
        .end();
    }
  } catch (error) {
    next(error);
  }
};
