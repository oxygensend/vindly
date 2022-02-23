const Joi = require("joi");
const router = require('express').Router();

// Database
const genres = [
    {id: 1, name: 'Comedy'},
    {id: 2, name: 'Horror'},
    {id: 3, name: 'Romantic'},
    {id: 4, name: 'Dramatic'},
];
router.get('/', (req, res) => {
    res.send(genres);
});

router.post('/', (req, res) => {

    const {error, value} = validateGenre(req.body);

    if (error)
        return res.status(400).send(error.message);

    const genre = {
        id: genres.length + 1,
        name: value.name,
    };
    genres.push(genre);
    res.send(genre);
});

router.get('/:id', (req, res) => {

    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre)
        return res.status(404).send("Page not found.");

    res.send(genre);

});

router.put('/:id', (req,res) => {

    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre)
        return res.status(404).send("Page not found.");

    const {error, value} = validateGenre(req.body);

    if (error)
        return res.status(400).send(error.message);

    genre.name = value.name;
    res.send(genre);
})

router.delete('/:id', (req, res) => {

    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre)
        return res.status(404).send("Page not found.");

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
})

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().regex(new RegExp('[A-Z][A-z]*')).min(3).required()
    });

    return schema.validate(genre);

}

module.exports = router;