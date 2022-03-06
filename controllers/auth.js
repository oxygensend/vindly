const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

exports.login = async (req, res, next) => {
    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    const user = await User.findOne({email: req.body.email});
    if (!user)
        return res.status(400).send("Invalid password or email.");

    const validPassword = await bcrypt.compare(value.password, user.password);
    if (!validPassword)
        return res.status(400).send("Invalid password or email.");


    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(token);

};

exports.logout = (req, res) => {

    delete req.headers['x-auth-token'];
    res.send(true);

};

const validate = (user) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: passwordComplexity().required(),
    });
    return schema.validate(user);
};

