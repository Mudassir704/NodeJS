const express = require('express');
const error = require('../middleware/error')
const generes = require("../routes/generes");
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');

module.exports = function (app) {
    app.use(express.json());
    app.use("/api/generes", generes);
    app.use("/api/customers", customers);
    app.use("/api/movies",movies);
    app.use("/api/rentals",rentals);
    app.use("/api/users", users);
    app.use("/api/auth",auth);
    app.use("/api/returns", returns);
    app.use(error);
}