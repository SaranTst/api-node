const express = require("express");
const authRouter = require("./auth.js");
const bookRouter = require("./book");
const uploadsRouter = require("./uploads");

const app = express();

app.use("/auth/", authRouter);
app.use("/book/", bookRouter);
app.use("/uploads/", uploadsRouter)

module.exports = app;