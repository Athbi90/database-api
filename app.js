const express = require("express");
const cors = require("cors");
const ip = require("ip");
const path = require("path");
const passport = require("passport");
const { Umzug, SequelizeStorage } = require("umzug");
const Sequelize = require("sequelize");
const s3upload = require("./middleware/s3upload");

const sequelize = new Sequelize(
  `${process.env.DB_NAME}`,
  `${process.env.DB_USERNAME}`,
  `${process.env.DB_PASSWORD}`,
  {
    host: `${process.env.DB_HOST}`,
    dialect: "postgres",
  }
);

const umzug = new Umzug({
  migrations: {
    glob: ["db/migrations/*.js", { cwd: __dirname }],
    resolve: ({ name, path, context }) => {
      // adjust the migration parameters Umzug will
      // pass to migration methods, this is done because
      // Sequilize-CLI generates migrations that require
      // two parameters be passed to the up and down methods
      // but by default Umzug will only pass the first
      const migration = require(path || "");
      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// import api routes
const userRoutes = require("./api/users/routes");
const productRoutes = require("./api/products/routes");
const stockRoutes = require("./api/stocks/routes");
const orderRoutes = require("./api/orders/routes");

// Passport strategies
const { localStrategy, jwtStrategy } = require("./middleware/passport");

// Initializing App
const app = express();

// Importing database
const db = require("./db/models");

app.use(cors());
app.use(express.json());
app.use("/media", express.static(path.join(__dirname, "media"))); // Media

// Passport Setup
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// use api routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/stocks", stockRoutes);
app.use("/orders", orderRoutes);

// Handling Errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
  });
});

// Start Server
const run = async () => {
  try {
    await db.sequelize.authenticate();
    await umzug.up();
    // await umzug.down({ to: 0 });
    console.log("Server Connected Successfully!");

    app.listen(process.env.PORT, () => {
      console.log(`Running on ${ip.address()}:${process.env.PORT}`);
    });
  } catch (error) {
    console.log(
      `Failed to connect to ${process.env.DB_NAME} database, ${error}`
    );
  }
};
app.use((req, res, next) => {
  res.status(404).json({ message: "Path not found" });
});
run();
