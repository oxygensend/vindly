const request = require('supertest');
const ObjectId = require('mongoose').Types.ObjectId;
const server = require('../../app');
const {Genre} = require("../../models/genre");
const {User} = require("../../models/user");

describe('validateId object', () => {

    let token;
    let genre;
    beforeEach( async () => {

        genre = await Genre.create({name: 'Genre1'})
        token = new User().generateAuthToken();
    });
    it('should return 404 if Id is not Object Id', async () => {
        const res = await request(server)
            .get('/api/genres/1')
            .set('x-auth-token', token);

        expect(res.status).toBe(404);

    });

    it('should return 200 status if Id is proper', async () => {
        const res = await request(server)
            .get('/api/genres/' + genre._id)
            .set('x-auth-token', token);

        expect(res.status).toBe(200)
    });

});