const {Customer, validate} = require('../models/customer');
const Request = require("../models/request");

exports.create = async (req, res) => {
    const requests  = await Request.userRequests(req.user);
    if (requests > 10 )
        return res.status(404).send('You have exceeded your month limit');

    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);


    const customer = await Customer.create({
        name: value.name,
        isGold: value.isGold,
        phone: value.phone,
    });
    res.send(customer);
};

exports.index = async (req, res) => {
    let customers = await Customer.find().sort('name');
    res.send(customers);
};

exports.update = async (req, res) => {

    let customer = await Customer.findById(req.params.id);
    if (!customer)
        return res.status(404).send("Page not found.");

    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    customer.name = value.name;
    customer.isGold = value.isGold;
    customer.phone = value.phone;
    await customer.save();
    res.send(customer);
};

exports.get = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
        return res.status(404).send("Invalid customer...");
    res.send(customer);
};

exports.destroy = async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer)
        return res.status(404).send("Invalid customer...");
    res.send(customer);
};
