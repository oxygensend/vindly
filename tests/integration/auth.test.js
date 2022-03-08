const request = require('supertest');
const {User} = require("../../models/user");
const {Genre} = require("../../models/genre");
const server = require('../../app');
const bcrypt = require("bcrypt");
describe('auth middleware', () => {


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

describe('/api/auth', () => {

    describe('/api/logout', () => {
        it('should delete auth header', async () => {
            const res = await request(server).delete('/api/auth/logout');

            expect(res.header).not.toHaveProperty('x-auth-token', '');
        });

        it('should return true in response', async () => {
            const res = await request(server).delete('/api/auth/logout');

            expect(res.body).toBe(true);
        });
    });

    describe('POST /', () => {

        let email;
        let password;
        let user;
        let salt;
        beforeAll(async () => {
            salt = await bcrypt.genSalt(10);
        });

        beforeEach(async () => {
            email = 'test@test.com';
            password = 'Test1234@';
            user = await User.create({
                email: email,
                password: await bcrypt.hash(password, salt),
                name: 'Test'
            });
        });
        afterEach(async () => {
            await User.deleteMany({});
        });
        const exec = () => {
            return request(server)
                .post('/api/auth')
                .send({email, password});
        };
        it('should return 400 if user is not registered', async () => {
            await User.deleteMany({});
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if password verify fail', async () => {
            password = 'TestTest@123';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is invalid', async () => {
            email = 'test';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is invalid', async () => {
            password = 'test';
            const res = await exec();

            expect(res.status).toBe(400);
        });


        it('should set auth token in header', async () => {
            const res = await exec();
            console.log(res.error);

            expect(res.header).toHaveProperty('x-auth-token', user.generateAuthToken());
        });
    });
});