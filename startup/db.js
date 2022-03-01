const mongoose = require("mongoose");
const logger = require('../logger');
module.exports = () => {
    mongoose.connect('mongodb://localhost/vidly',)
        .then(logger.info('Connected to MongoDb'));
};