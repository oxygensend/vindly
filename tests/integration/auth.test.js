const request = require('supertest');
const {User} = require("../../models/user");
const {Genre} = require("../../models/genre");
let server;

describe('auth middleware', () => {

    beforeEach(() => {
        server = require('../../app');
    });
    afterEach(() => {
        server.close();
    });
    let token;
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: 'Genre1'});
    };
    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if provided token is invalid', async () => {
        token = '1';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return status 200 if provided token is valid', async () => {
        token = new User().generateAuthToken();
        const res = await exec();
        expect(res.status).toBe(200);
        await Genre.deleteMany({});
    });
});