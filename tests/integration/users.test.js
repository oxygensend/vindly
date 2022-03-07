const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require("../../models/user");
const server = require('../../app');
const ObjectId = require('mongoose').Types.ObjectId;

describe('/api/users', () => {

    let token;
    let user;
    beforeEach(async () => {
        user = await User.create({
            _id: new ObjectId(),
            name: 'Test',
            email: 'test@test.com',
            password: 'test123',
        });
        token = user.generateAuthToken();
    });
    afterEach(async () => {
        await User.deleteMany({});
    });

    describe('GET /me', () => {
        const exec = () => {
            return request(server)
                .get('/api/users/me')
                .set('x-auth-token', token);
        };

        it('should return 401 status if user is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return user data if user is logged in', async () => {
            const res = await exec();
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['name', 'email', 'isAdmin']));
        });

    });

    describe('GET /users', () => {

        const exec = () => {
            return request(server)
                .get('/api/users')
                .set('x-auth-token', token);
        };

        it('should return 401 if user is not authenticated', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if user is not authorizated', async () => {
            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('it should return all users if everything is properly', async () => {
            token = new User({isAdmin: true}).generateAuthToken();
            const res = await exec();


            expect(res.body.length).toBe(1);
            expect(res.body.some(g => g.name === 'Test')).toBeTruthy();
            expect(res.body.some(g => g.email === 'test@test.com')).toBeTruthy();
            expect(res.body.some(g => g.password === 'test123')).toBeTruthy();
            expect(res.body.some(g => g.isAdmin === false)).toBeTruthy();
        });
    });
});