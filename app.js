const express = require('express');
const genres = require('./routes/genres');
const home = require('./routes/home');

const app = express();
const port = process.env.PORT | 3000;

app.use(express.json());
app.listen(port, () => console.log(`Listening on port ${port}`));



// ROUTES
app.use('/', home);
app.use('/api/genres/', genres);


