const express = require("express");
const winston = require("winston");
const app = express();

require('./startups/logging')();
require('./startups/routes')(app);
require('./startups/db')();
require('./startups/config')();
require('./startups/validation')();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => winston.info(`App is listening at ${port}...`));

module.exports = server;
