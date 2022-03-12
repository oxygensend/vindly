const {Rental, validate} = require('../models/rental');
const {Customer} = require("../models/customer");
const {Movie} = require("../models/movie");
const Fawn = require('fawn');
const config = require('config');
const Request = require("../models/request");


exports.create = async (req, res) => {
    const requests = await Request.userRequests(req.user);
    if (requests > 10)
        return res.status(404).send('You have exceeded your month limit');

    const {error, value} = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const customer = await Customer.findById(value.customerId);
    if (!customer) return res.status(400).send('Invalid customer...');
    const movie = await Movie.findById(value.movieId);
    if (!movie) return res.status(400).send('Invalid movie...');

    const rental = await Rental.lookup(value.customerId, value.movieId);

    if (!rental) return res.status(404).send('There is no rental for this user and movie');
    if (rental.dateReturned) return res.status(400).send('Rental is already processed');


    rental.return();
    await rental.save();

    try {
        await new Fawn.Task()
            .update('movies', {_id: movie._id}, {
                $inc: {numberInStock: 1}
            })
            .run();
        res.send(rental);
    } catch (ex) {
        res.status(500).send("Something failed");
    }
};
