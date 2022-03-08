const {Rental} = require("../../models/rental");
const moment = require('moment');
const {User} = require("../../models/user");
const request = require("supertest");
const {Customer} = require("../../models/customer");
const {Movie} = require("../../models/movie");
const ObjectId = require('mongoose').Types.ObjectId;
const server = require('../../app');
describe('/api/returns', () => {
    let rental;
    let token;
    let movieId;
    let customerId;
    let movie;

    beforeEach(async () => {
        token = new User().generateAuthToken();
        movieId = new ObjectId();
        customerId = new ObjectId();
        const customer = {
            _id: customerId,
            name: '12345',
            isGold: false,
            phone: '123456789',
        };
        movie = {
            _id: movieId,
            title: '12345',
            dailyRentalRate: 1,
            genre: {name: 'Genre1'},
            numberInStock: 3,
        };
        rental = await Rental.create({customer, movie});
        await Movie.create(movie);
        await Customer.create(customer);


    });
    afterEach(async () => {
        await Rental.deleteMany({});
        await Customer.deleteMany({});
        await Movie.deleteMany({});

    });

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId, movieId});
    };

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 status if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 status if moveId is not provided', async () => {
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if customer doesnt exists', async () => {
        customerId = new ObjectId();
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movie doesnt exists', async () => {
        movieId = new ObjectId();
        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 404 status if no rental found for this customer/movie', async () => {
        await Rental.deleteMany({});
        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 status if return already processed', async () => {
        await Rental.findByIdAndUpdate(rental._id, {dateReturned: new Date()});
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200  if is valid request', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set dateReturned if request is valid', async () => {
        await exec();
        const rentalDB = await Rental.findById(rental._id);

        const diff = new Date() - rentalDB.dateReturned;
        expect(diff).toBeLessThan(1000);
    });

    it('should calculate the rental fee properly', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        await exec();
        const rentalDB = await Rental.findById(rental._id);

        expect(rentalDB.rentalFee).toEqual(7);
    });

    it('should increase the stock for the movie', async () => {
        await exec();
        const updated_movie = await Movie.findById(movie._id);

        expect(updated_movie.numberInStock).toEqual(movie.numberInStock + 1);
    });

    it('should return the rental in response', async () => {
        const res = await exec();

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee',
                'customer', 'movie']));
    });
});