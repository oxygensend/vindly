const winston = require("winston");
const config = require("config")
require('winston-mongodb');

const uri = process.env.MONGODB_URI || config.get('db');
module.exports = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'logfile.log'}),
        new winston.transports.MongoDB({
            db: uri,
            options: {useUnifiedTopology: true}
        }),
    ]
});
