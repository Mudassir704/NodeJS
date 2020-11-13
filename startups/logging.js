const winstone = require('winston');
require('winston-mongodb');
require('express-async-errors');


module.exports = function () {
    winstone.exceptions.handle(
        new winstone.transports.Console({ colorize: true , pretttPrint: true }),
        new winstone.transports.File({ filename: "uncaughtException.log"})
        );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    })

    winstone.add(new winstone.transports.File({filename: "logfile.log"}));
    winstone.add(new winstone.transports.MongoDB({ db: 'mongodb://localhost/vidly', level: "info" }));
}