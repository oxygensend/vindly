const express = require('express');
const config = require('config');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const home = require('./routes/home');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const app = express();
const port = process.env.PORT | 3000;

if(!config.get('jwtPrivateKey')){
    console.error("FATAL ERROR: jwtPrivateKey is not provided.");
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
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


