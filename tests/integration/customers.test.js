const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require("../../models/user");
const server = require('../../app');
const {Movie} = require("../../models/movie");
const {Customer} = require("../../models/customer");
const ObjectId = require('mongoose').Types.ObjectId


describe('/api/customers', () => {

    describe('GET /', () => {

        it('should return all existing customers', async () => {
            await Customer.collection.insertMany([
                {name: 'Customer1', phone: '123456789'},
                {name: 'Customer2', isGold: true, phone: '123456789'},
            ]);
            const res = await request(server).get('/api/customers');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'Customer1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'Customer2')).toBeTruthy();

            await Customer.deleteMany({});
        });

        it('should empty body with no customers', async () => {
            const res = await request(server).get('/api/customers');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });
    })

    describe('GET /:id', () => {
        it('should return customer with proper id', async () => {
            const customer = await Customer.create({
                    name: 'Customer1',
                    phone: '123456789'
                }
            );
            const res = await request(server).get(`/api/customers/${customer._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Customer1')

            await Customer.deleteMany({});
        });

        it('should return 404 status if given id doesnt exist', async () => {
            const res = await request(server).get('/api/customers/' + new ObjectId());

            expect(res.status).toBe(404);
        });
    });



    describe('POST/', () => {
        let token;
        let name
        let phone
        const exec = () => {
            return request(server)
                .post('/api/customers')
                .set('x-auth-token', token)
                .send({name, phone});
        };
        beforeEach(() => {
            name = 'Customer'
            phone = '123456789'
            token = new User().generateAuthToken();

        });

        it('should return 401 status if user is not authenticated', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);

        });

        it('should return 400 status if customer is less than 3 char', async () => {

            name = 'Cu'
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 status if customer is more than 50 char', async () => {
            name = new Array(52).join('A');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 status if customer name first letter is not uppercase', async () => {
            name = 'customer';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 status if phone is not a real phone number', async () => {
            phone = 'abcd1';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save new customer to db', async () => {

            const res = await exec();
            const customer = await Customer.find({name: 'Customer'});

            expect(res.status).toBe(200);
            expect(customer).not.toBeNull();

        });

        it('should return new customer in response', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('name', 'Customer')
        })

    });



    describe('DELETE/:id', () => {

        let token;
        let genre;
        let customer;


        beforeEach(async () => {
            token = new User({isAdmin: true}).generateAuthToken();
            customer = await Customer.create({name: 'Customer', phone: '123456789'});
        });

        afterEach(async () => {
            await Genre.deleteMany({});
        });
        const exec = (id) => {
            return request(server)
                .delete('/api/customers/' + id)
                .set('x-auth-token', token);
        };

        it('should return 401 status if user is not authenticated', async () => {
            token = '';
            const res = await exec(customer._id);
            expect(res.status).toBe(401);

        });

        it('should return 404 status if given id is valid', async () => {
            const res = await exec(new ObjectId());

            expect(res.status).toBe(404);
        });

        it('should return 403 status if user is not admin', async () => {
            token = new User().generateAuthToken();
            const res = await exec(customer._id);

            expect(res.status).toBe(403);
        });

        it('should delete object from database', async () => {
            const res = await exec(customer._id);
            console.log(res.error)
            const find_customer = await Customer.find({_id: customer._id});

            expect(res.status).toBe(200);
            expect(find_customer).toEqual([]);
        });

        it('should return deleted object', async () => {
            const res = await exec(customer._id);
            expect(res.body).toHaveProperty('_id', customer._id.toHexString());
            expect(res.body).toHaveProperty('name', customer.name);
            expect(res.body).toHaveProperty('isGold', customer.isGold);
            expect(res.body).toHaveProperty('phone', customer.phone);

        });
    });

    describe('PUT/:id', () => {
        let token;
        let customer;
        let name;
        let phone;
        let isGold;
        const exec = (id) => {
            return request(server)
                .put('/api/customers/' + id)
                .set('x-auth-token', token)
                .send({name, phone, isGold});
        };
        beforeEach(async () => {
            token = new User().generateAuthToken();
            customer = await Customer.create({name: 'Customer', phone: '123456789'});

        });
        afterEach(async () => {
            await Customer.deleteMany({});

        });


        it('should return 401 status if user is not authenticated', async () => {
            token = '';
            const res = await exec(customer._id);

            expect(res.status).toBe(401);
        });

        it('should return 404 status if valid id is given', async () => {
            const res = await exec(new ObjectId());

            expect(res.status).toBe(404);
        });
        it('should return 400 status if customer is less than 3 char', async () => {

            name = 'Cu'
            const res = await exec(customer._id);
            expect(res.status).toBe(400);
        });

        it('should return 400 status if customer is more than 50 char', async () => {
            name = new Array(52).join('A');
            const res = await exec(customer._id)
            expect(res.status).toBe(400);
        });

        it('should return 400 status if customer name first letter is not uppercase', async () => {
            name = 'customer';
            const res = await exec(customer._id)
            expect(res.status).toBe(400);
        });

        it('should return 400 status if phone is not a real phone number', async () => {
            phone = 'abcd1';
            const res = await exec(customer._id);
            expect(res.status).toBe(400);
        });

        it('should change data of the customer properly', async () => {
            name = 'NewCustomer';
            isGold = true;
            phone = '123321123'

            const res = await exec(customer._id);
            const updatedCustomer = await Customer.findById(customer._id);

            expect(updatedCustomer.name).toBe(name);
            expect(updatedCustomer.isGold).toBe(true);
            expect(updatedCustomer.phone).toBe(phone);
            expect(res.status).toBe(200);
        });

        it('should return updated customer in response', async () => {
            name = 'NewCustomer';
            isGold = true;
            phone = '123321123'

            const res = await exec(customer._id);

            expect(res.body).toHaveProperty('name', name)
            expect(res.body).toHaveProperty('isGold', isGold)
            expect(res.body).toHaveProperty('phone', phone)
            }
        )

    });
})