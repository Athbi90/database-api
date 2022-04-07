"use strict";
const SequelizeSlugify = require("sequelize-slugify");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.Stock, {
        as: "stocks",
        foreignKey: {
          name: "productId",
        },
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      brand: DataTypes.STRING,
      price: DataTypes.INTEGER,
      slug: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  SequelizeSlugify.slugifyModel(Product, {
    source: ["brand", "name"],
  });
  return Product;
};
