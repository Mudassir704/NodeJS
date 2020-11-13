const winston = require("winston");
const mongoose = require("mongoose");
const config = require('config');

module.exports = function () {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    const db = config.get('db');
    mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })      
        .then(() => winston.info(`Connected to ${db}...`));
}