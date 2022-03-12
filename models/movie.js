const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('../models/genre');
const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 255,
        trim: true,
        required: true,
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255,
        required: true,
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        required: true,
    },
    genre: {
      type: genreSchema,
      required: true
    }

}));


exports.Movie = Movie;
exports.validate = (movie) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required(),
        genreId: Joi.objectId().required()
    });

    return schema.validate(movie);
};