const mongoose = require("mongoose");
const logger = require('../logger');
const config = require('config')

const uri = process.env.MONGODB_URI || config.get('db');
console.log(uri);
module.exports = () => {
    mongoose.connect(uri)
        .then(logger.info('Connected to MongoDb'))
        .catch(e=> logger.error('Cannot connect to mongoDB'));
};