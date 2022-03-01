const {Genre, validate} = require('../models/genre');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = require('express').Router();

// Database

async function createGenre(req, res){
    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    const genre = await Genre.create({
        name: value.name,
    })
    res.send(genre);
}

async function getGenres(req, res){
    let genres = await Genre.find().sort('name');
    res.send(genres);
}

async function updateGenre(req, res){

    let genre = await  Genre.findById(req.params.id);
    if (!genre)
        return res.status(404).send("Page not found.");

    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    genre.name = value.name;
    genre.save();
    res.send(genre);
}
async function getGenre(req, res){
    const genre = await Genre.findById(req.params.id);
    if (!genre)
        return res.status(404).send("Page not found.");
    res.send(genre);
}

async function deleteGenre(req, res){
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)
        return res.status(404).send("Page not found.");
    res.send(genre);
}
router.get('/', getGenres);
router.post('/', [auth, admin], createGenre);
router.put( '/:id',[auth, admin], updateGenre);
router.get('/:id', getGenre);
router.delete('/:id',[auth, admin], deleteGenre);


module.exports = router;