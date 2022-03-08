const request = require('supertest');
const server = require('../../app');
const {Customer} = require("../../models/customer");
const {Movie} = require("../../models/movie");
const {Rental} = require("../../models/rental");
const {User} = require("../../models/user");
const ObjectId = require('mongoose').Types.ObjectId;

describe('/api/rentals', () => {

    describe(' GET /', () => {

        it('should return empty array if no rentals exists', async () => {
            const res = await request(server).get('/api/rentals');

            expect(res.body).toEqual([]);
        });

        it('should return rentals in response', async () => {
            const movie = await Movie.create({
                    title: 'movie1',
                    numberInStock: 4,
                    dailyRentalRate: 1,
                    genre: {name: 'genre1'}
                }
            );
            const customer = await Customer.create({
                    name: 'Customer1',
                    phone: '123456789'
                }
            );

            const rental = await Rental.create({
                customer, movie
            });

            const res = await request(server).get('/api/rentals');
            Rental.deleteMany({});
            Customer.deleteMany({});
            Movie.deleteMany({});
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body.some(g => g.customer.name === customer.name)).toBeTruthy();
            expect(res.body.some(g => g.movie.title === movie.title)).toBeTruthy();


        });
    });
    describe('GET /:id', () => {

        let movie, rental, customer;

        beforeEach(async () => {
            movie = await Movie.create({
                    title: 'movie1',
                    numberInStock: 4,
                    dailyRentalRate: 1,
                    genre: {name: 'genre1'}
                }
            );
            customer = await Customer.create({
                    name: 'Customer1',
                    phone: '123456789'
                }
            );

            rental = await Rental.create({
                customer, movie
            });
        });

        afterEach(async () => {
            await Movie.deleteMany({});
            await Customer.deleteMany({});
            await Rental.deleteMany({});
        });

        it('should return rental with proper id', async () => {

            const res = await request(server).get(`/api/rentals/${rental._id}`);

            expect(res.status).toBe(200);
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'customer', 'movie',
                    'dateOut']));
        });

        it('should return 404 status if given id doesnt exist', async () => {

            const res = await request(server).get('/api/rentals/' + new ObjectId());

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let movie, customer, customerId, movieId, token;

        beforeEach(async () => {
            token = new User().generateAuthToken();
            movie = await Movie.create({
                    title: 'movie1',
                    numberInStock: 4,
                    dailyRentalRate: 1,
                    genre: {name: 'genre1'}
                }
            );
            customer = await Customer.create({
                    name: 'Customer1',
                    phone: '123456789'
                }
            );
            movieId = movie._id;
            customerId = customer._id;
        });

        afterEach(async () => {
            await Movie.deleteMany({});
            await Customer.deleteMany({});
            await Rental.deleteMany({});
        });

        const exec = () => {
            return request(server)
                .post('/api/rentals')
                .set('x-auth-token', token)
                .send({customerId, movieId});
        };

        it('should return 401 if user is not authenticated', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
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


        it('should return 400 if there is no books in stock', async () => {
            movie.numberInStock = 0;
            await movie.save();

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 200 after success', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
        });

        it('should decrease number of books in stock after good response', async () => {
            const res = await exec();
            const movie_new = await Movie.findById(movie._id);

            expect(movie_new.numberInStock).toEqual(movie.numberInStock - 1);
        });

        it('should add rental to db', async () => {
            const res = await exec();
            const rental = await Rental.find({});

            expect(rental).toBeTruthy();
        });

        it('should return rental in response', async () => {
            const res = await exec();

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['_id', 'customer', 'movie',
                    'dateOut']));

        });


    });


});
