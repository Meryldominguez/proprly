"use strict";

/** Express app for proprly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT, ensureLoggedIn } = require("./middleware/auth");
const lotsRoutes = require("./routes/lots");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const prodRoutes = require("./routes/productions");
const propsRoutes = require("./routes/props");
const tagsRoutes = require("./routes/tags");
const locRoutes = require("./routes/locations");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/lots", lotsRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/productions", prodRoutes);
app.use("/props", propsRoutes);
app.use("/tags", tagsRoutes);
app.use("/locations", locRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
