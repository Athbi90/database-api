// Dependancies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Model
const { User } = require("../../db/models");

// Sign up
exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  //   console.log(JSON.parse(req.body.kids));

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    // let kids = req.body.kids;
    // req.body.kids = JSON.parse(kids);

    const newUser = await User.create(req.body);
    // console.log(req.body.kids);
    // Create Payload
    const payload = {
      id: newUser.id,
      username: newUser.username,
      expiry: Date.now() + process.env.JWT_EXPIRATION_MS,
    };

    const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);
    res.status(201).json({ token: token });
  } catch (error) {
    next(error);
  }
};

// Sign in
exports.signin = async (req, res, next) => {
  const { user } = req;
  const payload = {
    id: user.id,
    username: user.username,
    expiry: Date.now() + process.env.JWT_EXPIRATION_MS,
  };
  const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);
  res.json({ token: token });
};

// fetch user
exports.fetchUser = async (userId, next) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    return user;
  } catch (error) {
    next(error);
  }
};

// Get All users
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};
