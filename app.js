require('express-async-errors');
const express = require('express');
const logger = require('./logger');

const app = express();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT | 3000;
if(process.env.NODE_ENV !== 'test') {
    app.listen(port, () => logger.info(`Listening on port ${port}`));
}

module.exports = app;




