const Joi = require("joi");
const mongoose = require('mongoose');
const router = require('express').Router();

// Database


const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
    }
}));

async function createGenre(req, res){
    const {error, value} = validateGenre(req.body);

    if (error)
        return res.status(400).send(error.message);

    const genre = await Genre.create({
        name: value.name
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

    const {error, value} = validateGenre(req.body);

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
router.post('/', createGenre);
router.put( '/:id', updateGenre);
router.get('/:id', getGenre);
router.delete('/:id', deleteGenre);

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().regex(new RegExp('[A-Z][A-z]*')).min(3).required()
    });

    return schema.validate(genre);

}

module.exports = router;