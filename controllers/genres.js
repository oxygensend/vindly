const {Genre, validate} = require('../models/genre');

exports.create = async (req, res) => {
    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    const genre = await Genre.create({
        name: value.name,
    });
    res.send(genre);
};

exports.index = async (req, res, next) => {
    let genres = await Genre.find().sort('name');
    res.send(genres);
};

exports.update = async (req, res) => {

    let genre = await Genre.findById(req.params.id);

    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    genre.name = value.name;
    genre.save();
    res.send(genre);
};

exports.get = async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    res.send(genre);
};

exports.destroy = async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    res.send(genre);
};
