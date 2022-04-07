const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

// Import Users Model
const { Users } = require("../db/models");

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await Users.findOne({
      where: {
        username,
      },
    });

    const passwordMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    return passwordMatch ? done(null, user) : done(null, false);
  } catch (error) {
    done(error);
  }
});

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now > jwtPayload.expiry) return done(null, false);

    try {
      const user = Users.findByPk(jwtPayload.id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
