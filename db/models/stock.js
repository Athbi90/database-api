"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Stock.belongsTo(models.Product, {
        as: "product",
        foreignKey: {
          name: "productId",
        },
      });
    }
  }
  Stock.init(
    {
      size: DataTypes.STRING,
      color: DataTypes.STRING,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Stock",
    }
  );
  return Stock;
};
