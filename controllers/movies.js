const {Movie, validate} = require('../models/movie');
const {Genre} = require("../models/genre");

exports.create = async (req, res) => {
    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre)
        return res.status(400).send('Invalid genre...');

    const movie = await Movie.create({
        title: value.title,
        numberInStock: value.numberInStock,
        dailyRentalRate: value.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name,
        }

    });
    res.send(movie);
};

exports.index = async (req, res) => {
    let movies = await Movie.find().sort('name');
    res.send(movies);
};

exports.update = async (req, res) => {

    let movie = await Movie.findById(req.params.id);
    if (!movie)
        return res.status(404).send("Invalid movie`");

    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre)
        return res.status(400).send('Invalid genre...');

    movie.title = value.title;
    movie.numberInStock = value.numberInStock;
    movie.dailyRentalRate = value.dailyRentalRate;
    movie.genre = {
        _id: genre._id,
        name: genre.name,
    }
    await movie.save();
    res.send(movie);
};

exports.get = async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
        return res.status(404).send("Invalid movie");
    res.send(movie);
};

exports.destroy = async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie)
        return res.status(404).send("Invalid movie");
    res.send(movie);
};