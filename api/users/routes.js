const express = require("express");
const router = express.Router();
const passport = require("passport");

// Controllers
const { signup, signin, fetchUser, listUsers } = require("./controllers");

// Params middleware
router.param("userId", async (req, res, next, userId) => {
  const user = await fetchUser(userId, next);
  if (user) {
    req.user = user;
    next();
  } else {
    const err = new Error("User not found!");
    err.status = 401;
    next(err);
  }
});

// Sign up
router.post("/signup", signup);

// Sign in
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

router.get("/", listUsers);

module.exports = router;
