const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 5,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }

});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
}
const User = mongoose.model('User', userSchema);


exports.User = User;
exports.validate = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: passwordComplexity().required(),
    });
    return schema.validate(user);
};