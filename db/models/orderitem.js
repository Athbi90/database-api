"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Many-to-Many relation between Orders and Items
      models.Order.belongsToMany(models.Stock, {
        through: OrderItem,
        foreignKey: "orderId",
        as: "order",
        onDelete: "CASCADE",
      });

      models.Stock.belongsToMany(models.Order, {
        through: OrderItem,
        foreignKey: "stockId",
        as: "items",
      });
    }
  }
  OrderItem.init(
    {
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderItem",
    }
  );
  return OrderItem;
};
