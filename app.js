const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const mongoose = require("mongoose");
const User = require("./model/users");
const bodyParser = require("body-parser");
const path = require("path");

//connect db
mongoose.connect("mongodb://localhost:27017/blogapi", err => {
  if (err) throw err;
  console.log("Successfully connected");
});
mongoose.connection.on("error", err => {
  console.log("DB connection error:", err.message);
});

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const indexRouter = require("./routes/index");

const app = express();

app.set("jwt_secret", "nguyenhien");

// passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    function(username, password, cb) {
      //Assume there is a DB module pproviding a global UserModel
      return User.findOne({ username, password })
        .then(user => {
          if (!user) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }

          return cb(null, user, {
            message: "Logged In Successfully",
          });
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken("secret_token"),
      secretOrKey: app.get("jwt_secret"),
    },
    function(jwtPayload, cb) {
      //find the user in db if needed
      return User.findOneById(jwtPayload.id)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
module.exports = app;
