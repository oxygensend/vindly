const express = require('express');
const genres = require('./routes/genres');
const home = require('./routes/home');
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT | 3000;

mongoose.connect('mongodb://localhost/vidly')
    .catch(err => console.error('Could not connect do MongoDB'));

app.use(express.json());
app.listen(port, () => console.log(`Listening on port ${port}`));



// ROUTES
app.use('/', home);
app.use('/api/genres/', genres);


