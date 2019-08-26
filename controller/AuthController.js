const User = require("../model/users");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");

exports.login = (req, res, next) => {
  const { username, password } = req.body;
  if ({ username, password }) {
    User.findOne({ username }, (err, user) => {
      if ({ username }) {
        bcrypt
          .compare(password, user.password)
          .then(macth => {
            if (macth) {
              res.json({
                user: user,
                token: jwt.sign({ _id: user._id }, req.app.get("jwt_secret")),
              });
            } else {
              return next(err);
            }
          })
          .catch(err => {
            res.status(500).res.send(err);
          });
      }
    });
  } else {
    return next(err);
  }
};

exports.register = (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (user === null) {
      let numSaltRounds = 10;
      bcrypt.genSalt(numSaltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            return next(err);
          }
          const user = new User(req.body);
          user.password = hash;
          user.save((err, result) => {
            if (err) {
              return next(err);
            }
            res.json({ user: result });
          });
        });
      });
    } else {
      res.json({ err: "username has been used" });
    }
  });
};
