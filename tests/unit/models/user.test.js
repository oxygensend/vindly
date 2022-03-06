const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const moongose = require('mongoose');
const mongoose = require("mongoose");

describe('user.generateAuthToken', () => {
    it('check if jwtToken is generated properly', () => {

        const id = new mongoose.Types.ObjectId().toHexString();
        const user = new User({
           _id: id
        });
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject({
            _id: id,
            isAdmin: false,
        });
    });
});
