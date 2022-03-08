const request = require('supertest');
const {Genre} = require('../../models/genre');
const server = require('../../app');
const {Movie} = require("../../models/movie");
const {User} = require("../../models/user");
const ObjectId = require('mongoose').Types.ObjectId;


describe('/api/moveis', () => {

    describe('GET /', () => {

        it('should return all existing movies', async () => {

            await Movie.collection.insertMany([
                {title: 'movie1', numberInStock: 2, dailyRentalRate: 1, genre: {name: 'genre1'}},
                {title: 'movie2', numberInStock: 2, dailyRentalRate: 1, genre: {name: 'genre2'}}
            ]);
            const res = await request(server).get('/api/movies');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.title === 'movie1')).toBeTruthy();
            expect(res.body.some(g => g.title === 'movie2')).toBeTruthy();

            await Movie.deleteMany({});
        });

        it('should empty body with no movies', async () => {

            const res = await request(server).get('/api/movies');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });

    });

    describe('GET /:id', () => {
        it('should return movie with proper id', async () => {

            const movie = await Movie.create({
                    title: 'movie1',
                    numberInStock: 2,
                    dailyRentalRate: 1,
                    genre: {name: 'genre1'}
                }
            );
            const res = await request(server).get(`/api/movies/${movie._id}`);

            expect(res.status).toBe(200);
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['title', 'numberInStock', 'dailyRentalRate',
                    'genre']));
            await Movie.deleteMany({});
        });

        it('should return 404 status if given id doesnt exist', async () => {

            const res = await request(server).get('/api/movies/' + new ObjectId());

            expect(res.status).toBe(404);
        });
    });


    let token;
    let genreId;

    describe('POST/', () => {
        let title = 'Movie1';
        let numberInStock = 1;
        let dailyRentalRate = 1;

        const exec = () => {
            return request(server)
                .post('/api/movies')
                .set('x-auth-token', token)
                .send({title, numberInStock, dailyRentalRate, genreId});
        };

        beforeEach(() => {
            genreId = new ObjectId();
            token = new User().generateAuthToken();

        });
        afterEach(async () => {
            await Movie.deleteMany({});
        });

        it('should return 401 status if user is not authenticated', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);

        });

        it('should save new movie to db', async () => {
            await Genre.create({_id: genreId, name: 'Genre'});
            const res = await exec();
            const movie = await Movie.find({name: 'Movie1'});

            expect(res.status).toBe(200);
            expect(movie).not.toBeNull();

            await Genre.deleteMany({});

        });

        it('should return 400 status if movie is less than 3 char', async () => {
            name = 'Mo';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 status if numberInStock is negative', async () => {
            numberInStock = -1;
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 status if numberInStock is greater than 255', async () => {
            numberInStock = 256;
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 status if numberInStock is not number', async () => {
            dailyRentalRate = "s";
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 status if dailyRentalRate is greater than 255', async () => {
            dailyRentalRate = 256;
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 status if dailyRentalRate is negative', async () => {
            dailyRentalRate = -1;
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 status if dailyRentalRate is not number', async () => {
            dailyRentalRate = "s";
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 status if genreId is invalid', async () => {
            genreId = '1';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 status if genre doesnt exists', async () => {

            const res = await exec();

            expect(res.status).toBe(400);
        });
    });

    describe('DELETE/:id', () => {

        let movie;

        const exec = (id) => {
            return request(server)
                .delete('/api/movies/' + id)
                .set('x-auth-token', token);
        };

        beforeEach(async () => {
            token = new User({isAdmin: true}).generateAuthToken();
            movie = await Movie.create({
                    title: 'movie1',
                    numberInStock: 2,
                    dailyRentalRate: 1,
                    genre: { name: 'genre1'}
                }
            );
        });

        afterEach(async () => {
            await Movie.deleteMany({});
        });

        it('should return 401 status if user is not authenticated', async () => {
            token = '';
            const res = await exec(movie._id);
            expect(res.status).toBe(401);

        });

        it('should return 404 status if given id is valid', async () => {
            const res = await exec(new ObjectId());

            expect(res.status).toBe(404);
        });

        it('should return 403 status if user is not admin', async () => {
            token = new User().generateAuthToken();
            const res = await exec(movie._id);

            expect(res.status).toBe(403);
        });

        it('should delete object from database', async () => {
            const res = await exec(movie._id);
            const find_genre = await Genre.find({_id: movie._id});

            expect(res.status).toBe(200);
            expect(find_genre).toEqual([]);
        });

        it('should return deleted object', async () => {
            const res = await exec(movie._id);
            expect(res.body).toHaveProperty('_id', movie._id.toHexString());
            expect(res.body).toHaveProperty('title', movie.title);

        });
    });

    describe('PUT/:id', () => {
        let title;
        let numberInStock;
        let dailyRentalRate;
        let movie;


        beforeEach(async () => {
            token = new User().generateAuthToken();
            const genre = await Genre.create({name:'genre1'})
            genreId = genre._id
            movie = await Movie.create({
                    title: 'movie1',
                    numberInStock: 2,
                    dailyRentalRate: 1,
                    genre: { _id: genre._id, name: 'genre1'}

                }
            );
        });

        afterEach(async () => {
            await Movie.deleteMany({});
        });

        const exec = (id) => {
            return request(server)
                .put('/api/movies/' + id)
                .set('x-auth-token', token)
                .send({title, numberInStock, dailyRentalRate, genreId});
        };

        it('should return 401 status if user is not authenticated', async () => {
            token = '';
            const res = await exec(movie._id);

            expect(res.status).toBe(401);
        });

        it('should return 404 status if valid id is given', async () => {
            const res = await exec(new ObjectId());

            expect(res.status).toBe(404);
        });
        it('should return 400 status if movie  title is less than 3 char', async () => {
            title = 'Mo';
            const res = await exec(movie._id);

            expect(res.status).toBe(400);
        });

        it('should return 400 status if numberInStock is negative', async () => {
            numberInStock = -1;
            const res = await exec(movie._id);

            expect(res.status).toBe(400);
        });

        it('should return 400 status if numberInStock is greater than 255', async () => {
            numberInStock = 256;
            const res = await exec(movie._id);

            expect(res.status).toBe(400);
        });

        it('should return 400 status if numberInStock is not number', async () => {
            dailyRentalRate = "s";
            const res = await exec(movie._id);

            expect(res.status).toBe(400);
        });

        it('should return 400 status if dailyRentalRate is greater than 255', async () => {
            dailyRentalRate = 256;
            const res = await exec(movie._id);

            expect(res.status).toBe(400);
        });

        it('should return 400 status if dailyRentalRate is negative', async () => {
            dailyRentalRate = -1;
            const res = await exec(movie._id);

            expect(res.status).toBe(400);
        });

        it('should return 400 status if dailyRentalRate is not number', async () => {
            dailyRentalRate = "s";
            const res = await exec(movie._id);

            expect(res.status).toBe(400);
        });

        it('should return 400 status if genreId is invalid', async () => {
            genreId = '1';
            const res = await exec(movie._id);

            expect(res.status).toBe(400);
        });

        it('should return 400 status if genre doesnt exists', async () => {
            const res = await exec(movie._id);

            expect(res.status).toBe(400);
        });

        it('should change data of the movie properly', async () => {
            title = 'NewMovie';
            numberInStock = 10;
            dailyRentalRate = 3;
            const res = await exec(movie._id);
            console.log(res.error)
            const updatedMovie = await Movie.findById(movie._id);

            expect(updatedMovie.title).toBe("NewMovie");
            expect(updatedMovie.numberInStock).toBe(10);
            expect(updatedMovie.dailyRentalRate).toBe(3);
            expect(res.status).toBe(200);
        });
    });

});