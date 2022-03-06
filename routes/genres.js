const {Genre, validate} = require('../models/genre');
const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const admin = require('../middlewares/admin');
const router = require('express').Router();

// Database

async function createGenre(req, res) {
    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    const genre = await Genre.create({
        name: value.name,
    });
    res.send(genre);
}

async function getGenres(req, res, next) {
    let genres = await Genre.find().sort('name');
    res.send(genres);
}

async function updateGenre(req, res) {

    let genre = await Genre.findById(req.params.id);

    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    genre.name = value.name;
    genre.save();
    res.send(genre);
}

async function getGenre(req, res) {
    const genre = await Genre.findById(req.params.id);
    res.send(genre);
}

async function deleteGenre(req, res) {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    res.send(genre);
}

router.get('/', getGenres);
router.post('/', auth, createGenre);
router.put('/:id', validateObjectId, auth, updateGenre);
router.get('/:id', validateObjectId, getGenre);
router.delete('/:id', validateObjectId, auth,admin, deleteGenre);


module.exports = router;