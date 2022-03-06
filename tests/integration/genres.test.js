const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require("../../models/user");
let server;

describe('api/genres', () => {
    beforeEach(() => {
        server = require('../../app');
    });
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});

    });

    describe(' GET /', () => {
        it('should return all existing genres', async () => {

            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);
            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });

        it('should empty body with no gernes', async () => {

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });

    describe('GET /:id', () => {
        it('should return genre with proper id', async () => {

            const genre = await Genre.create({name: 'genre1'});
            const res = await request(server).get(`/api/genres/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return 404 status if given id doesnt exist', async () => {

            const res = await request(server).get(`/api/genres/1`);

            expect(res.status).toBe(404);
        });
    });

    let token;
    let name;
    const exec = async () => {
        return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name});
    };
    beforeEach(() => {
        server = require('../../app');
        token = new User().generateAuthToken();

    });
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});

    });

    describe('POST/', () => {
        it('should return 401 status if user is not authenticated', async () => {

            token = '';
            name = 'k';
            const res = await exec();
            expect(res.status).toBe(401);

        });
        it('should save new genre to db', async () => {

            name = 'Genre';
            const res = await exec();
            const genre = await Genre.find({name: 'Genre'});
            expect(res.status).toBe(200);
            expect(genre).not.toBeNull();

        });
        ;
        it('should return 400 status if genre is less than 3 char', async () => {
            name = 'Ge';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 status if genre doesnt match pattern', async () => {
            name = 'genre';
            const res = await exec();
            expect(res.status).toBe(400);
        });

    });


    describe('DELETE/:id', () => {

        let token;
        let genre;

        const exec = async (id) => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token);
        };

        beforeEach(async () => {
            token = new User({isAdmin: true}).generateAuthToken();
            genre = await Genre.create({name: 'Genre1'});
        });

        afterEach(async () => {
            await Genre.deleteMany({});
        });

        it('should return 401 status if user is not authenticated', async () => {
            token = '';
            const res = await exec(genre._id);
            expect(res.status).toBe(401);

        });

        it('should return 404 status if given id is valid', async () => {
            const res = await exec('1');

            expect(res.status).toBe(404);
        });
        it('should return 403 status if user is not admin', async () => {
            token = new User().generateAuthToken();
            const res = await exec(genre._id);

            expect(res.status).toBe(403);
        });

        it('should delete object from database', async () => {
            const res = await exec(genre._id);
            const find_genre = await Genre.find({_id: genre._id});

            expect(res.status).toBe(200);
            expect(find_genre).toEqual([]);
        });

        it('should return deleted object', async () => {
            const res = await exec(genre._id);
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);

        });
    });


    describe('PUT/:id', () => {
        let token;
        let genre;
        let name;
        const exec = async (id) => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({name: name});
        };
        beforeEach(async () => {
            server = require('../../app');
            token = new User().generateAuthToken();
            genre = await Genre.create({name: 'Genre'});

        });
        afterEach(async () => {
            server.close();
            await Genre.deleteMany({});

        });


        it('should return 401 status if user is not authenticated', async () => {
            token = '';
            const res = await exec(genre._id);
            expect(res.status).toBe(401);
        });
        it('should return 404 status if valid id is given', async () => {
            const res = await exec('1');
            expect(res.status).toBe(404);
        });
        it('should change data of the genre properly', async () => {
            name = 'NewGenre';
            const res = await exec(genre._id);
            const updatedGenre = await Genre.findById(genre._id);
            expect(updatedGenre.name).toBe("NewGenre");
            expect(res.status).toBe(200);
        });
        it('should return 400 status if genre is less than 3 char', async () => {
            name = 'Ge';
            const res = await exec(genre._id);
            expect(res.status).toBe(400);
        });
        it('should return 400 status if genre doesnt match pattern', async () => {
            name = 'genre';
            const res = await exec(genre._id);
            expect(res.status).toBe(400);
        });


    });
});
