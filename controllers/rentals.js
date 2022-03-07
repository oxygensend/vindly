const {Rental, validate} = require('../models/rental');
const {Customer} = require("../models/customer");
const {Movie} = require("../models/movie");
const Fawn = require('fawn');
const config = require("config");


exports.index = async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
};

exports.create = async (req, res) => {

    const {error, value} = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const customer = await Customer.findById(value.customerId);
    if (!customer) return res.status(400).send('Invalid customer...');
    const movie = await Movie.findById(value.movieId);
    if (!movie) return res.status(400).send('Invalid movie...');

    if (movie.numberInStock === 0)
        return res.status(400).send('Movie is not in the stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },

    });

    // transaction
    try {
        await new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {
                $inc: {numberInStock: -1}
            })
            .run();
        res.send(rental);
    } catch (ex) {
        res.status(500).send("Something failed");
    }

};

exports.get = async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
};
