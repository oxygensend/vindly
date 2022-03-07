const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 3,
                maxlength: 50,
                required: true,
            },
            isGold: {
                type: Boolean,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            }
        }),
        required: true
    },

    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                minlength: 3,
                maxlength: 255,
                trim: true,
                required: true,
            },
            dailyRentalRate: {
                type: Number,
                min: 0,
                max: 255,
                required: true,
            }
        }),
        required: true
    },

    dateOut: {
        type: Date,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    });
};

rentalSchema.methods.return = function() {
    this.dateReturned = Date.now();
    this.rentalFee = moment().diff(this.dateOut, 'days') * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

exports.Rental = Rental;
exports.validate = (rental) => {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });
    return schema.validate(rental);
};