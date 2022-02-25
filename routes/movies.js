const {Movie, validate} = require('../models/movie');
const {Genre} = require("../models/genre");
const router = require('express').Router();

async function createMovie(req, res){
    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    const genre = Genre.findById(req.body.genreId);
    if(genre)
        return res.status(404).send('Invalid genre...');

    const movie = await Movie.create({
        title: value.title,
        numberInStock: value.numberInStock,
        dailyRentalRate: value.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name,
        }
    })
    res.send(movie);
}

async function getMovies(req, res){
    let movies = await Movie.find().sort('name');
    res.send(movies);
}

async function updateMovie(req, res){

    let movie = await  Movie.findById(req.params.id);
    if (!movie)
        return res.status(404).send("Page not found.");

    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    movie.title = value.title;
    movie.numberInStock = value.numberInStock;
    movie.dailyRentalRate = value.dailyRentalRate;
    movie.author = value.author;
    movie.save();
    res.send(movie);
}
async function getMovie(req, res){
    const movie = await Movie.findById(req.params.id);
    if (!movie)
        return res.status(404).send("Page not found.");
    res.send(movie);
}

async function deleteMovie(req, res){
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie)
        return res.status(404).send("Page not found.");
    res.send(movie);
}
router.get('/', getMovies);
router.post('/', createMovie);
router.put( '/:id', updateMovie);
router.get('/:id', getMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
