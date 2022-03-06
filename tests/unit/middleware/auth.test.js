const {User} = require("../../../models/user");
const ObjectId = require('mongoose').Types.ObjectId;
const auth = require('../../../middlewares/auth')

describe('auth middleware', () => {
    it('should populate req.user with payload of a valid jwt', () =>{
        const user = {_id: ObjectId(), isAdmin: true}
        const token = new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {}
        const next = jest.fn();
        auth(req, res, next);
        expect(req.user).toMatchObject(user);
    })
})