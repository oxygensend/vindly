const {Customer, validate} = require('../models/customer');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = require('express').Router();



async function createCustomer(req, res){
    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    const customer = await Customer.create({
        name: value.name,
        isGold: value.isGold,
        phone: value.phone,
    })
    res.send(customer);
}

async function getCustomers(req, res){
    let customers = await Customer.find().sort('name');
    res.send(customers);
}

async function updateCustomer(req, res){

    let customer = await  Customer.findById(req.params.id);
    if (!customer)
        return res.status(404).send("Page not found.");

    const {error, value} = validate(req.body);

    if (error)
        return res.status(400).send(error.message);

    customer.name = value.name;
    customer.isGold = value.isGold;
    customer.phone = value.phone;
    customer.save();
    res.send(customer);
}
async function getCustomer(req, res){
    const customer = await Customer.findById(req.params.id);
    if (!customer)
        return res.status(404).send("Page not found.");
    res.send(customer);
}

async function deleteCustomer(req, res){
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer)
        return res.status(404).send("Page not found.");
    res.send(customer);
}
router.get('/', getCustomers);
router.post('/', [auth, admin],createCustomer);
router.put( '/:id',[auth, admin], updateCustomer);
router.get('/:id', getCustomer);
router.delete('/:id',[auth, admin], deleteCustomer);

module.exports = router;
