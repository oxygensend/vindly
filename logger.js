const winston = require("winston");
const config = require("config")
require('winston-mongodb');

module.exports = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'logfile.log'}),
        new winston.transports.MongoDB({
            db: config.get('db'),
            options: {useUnifiedTopology: true}
        }),
    ]
});
