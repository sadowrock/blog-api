const User = require('../model/users');
const jwt = require('jsonwebtoken');

exports.getUsers = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      let result = jwt.verify(token.split(" ")[1], req.app.get("jwt_secret"));
      User.find({}, (err, user) => {
        if (!err) {
          res.send(user);
        } else {
          return next(err);
        }
      });
    } catch (err) {
      return next(err);
    }
  } else {
    result = {
      error: "Authentication error. Token required.",
      status: 401,
    };
    res.status(401).send(result);
  }
}

exports.getUserid = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      let result = jwt.verify(token.split(" ")[1], req.app.get("jwt_secret"))
      User.findById(result._id, (err, user) => {
        if (!err) {
          res.send(user);
        } else {
          return next(err);
        }
      });
    } catch (err) {
      return next(err);
    }
  } else {
    result = {
      error: "Authentication error. Token required.",
      status: 401,
    };
    res.status(401).send(result);
  }
}