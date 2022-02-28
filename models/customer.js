const mongoose = require("mongoose");
const Joi = require("joi");
const Customer = mongoose.model('Customer', new mongoose.Schema({
        isGold: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            minlength: 3,
            maxlength: 50,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        }

    })
);


exports.Customer = Customer;
exports.validate = (customer) => {

    const schema = Joi.object({
        name: Joi.string().regex(new RegExp('[A-Z][A-z]*')).min(3).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().regex(/^\d+$/).required()
    });

    return schema.validate(customer);
};