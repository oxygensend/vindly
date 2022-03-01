const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const _ = require('lodash');
const router = require('express').Router();

async function getMe(req, res){
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
}
async function register(req, res) {
    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    let user = await User.findOne({email: req.body.email});
    if (user)
        return res.status(400).send("User is already registered");

    const salt = await bcrypt.genSalt(10);
    user = await User.create({
        name: value.name,
        email: value.email,
        password: await bcrypt.hash(value.password, salt),
    });

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
}

async function getUsers(req, res) {
    let users = await User.find().sort('name');
    res.send(users);
}

router.get('/', getUsers);
router.post('/', register);
router.get('/me', auth, getMe);

module.exports = router;