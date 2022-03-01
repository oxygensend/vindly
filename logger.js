const winston = require("winston");
require('winston-mongodb');

module.exports = winston.createLogger({
    transports: [
        new winston.transports.File({filename: 'logfile.log'}),
        new winston.transports.MongoDB({
            db: 'mongodb://localhost/vidly',
            options: {useUnifiedTopology: true}
        }),
    ]
});
