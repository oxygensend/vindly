const mongoose = require("mongoose");
const logger = require('../logger');
const config = require('config')
module.exports = () => {
    mongoose.connect(config.get('db') )
        .then(logger.info('Connected to MongoDb'))
        .catch(e=> logger.error('Cannot connect to mongoDB'));
};