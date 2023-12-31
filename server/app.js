const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/User.js");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const indexRouter = require("./routes/index");
const socialRouter = require("./routes/social.js");

require("dotenv").config();

connect().catch((err) => console.log(err));
async function connect() {
  await mongoose.connect(process.env.URI);
}

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secret;
passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findOne({ username: payload.username });
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      console.log(err);
      done(err, false);
    }
  })
);

app.use("/", indexRouter);
app.use("/api/social", socialRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
