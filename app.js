require('express-async-errors');
const express = require('express');
const error = require('./middlewares/error');
const config = require('config');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const home = require('./routes/home');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const logger = require('./logger');
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const app = express();
const port = process.env.PORT | 3000;

process.on('uncaughtException', (err) => {
    logger.error(err.message);
    logger.end();
    logger.on('finish', () => {
            process.exit(1);
        }
    );
});
// Unnecessary?
process.on('unhandledRejection', (err) => {
    logger.error(err.message);
    logger.end();
    logger.on('finish', () => {
            process.exit(1);
        }
    );
});


if (!config.get('jwtPrivateKey')) {
    console.error("FATAL ERROR: jwtPrivateKey is not provided.");
    process.exit(1);
}


mongoose.connect('mongodb://localhost/vidly',)
    .catch(err => console.error('Could not connect do MongoDB'));

app.use(express.json());
app.listen(port, () => console.log(`Listening on port ${port}`));


// ROUTES
app.use('/', home);
app.use('/api/genres/', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);


