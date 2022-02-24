const mongoose = require("mongoose");
const Joi = require("joi");
const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
    }
}));

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().regex(new RegExp('[A-Z][A-z]*')).min(3).required()
    });

    return schema.validate(genre);

}

exports.Genre = Genre;
exports.validate = validateGenre;