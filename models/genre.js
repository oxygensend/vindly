const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({

    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
        unique: true
    }


});
const Genre = mongoose.model('Genre', genreSchema);


exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = (genre) => {
    const schema = Joi.object({
        name: Joi.string().regex(new RegExp('[A-Z][A-z]*')).min(3).required()
    });

    return schema.validate(genre);
};