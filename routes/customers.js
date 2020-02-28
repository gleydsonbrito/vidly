const auth = require('../middleware/auth');
const { Customer, validateCustomer } = require('../model/customer.js')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(404).send(error.message);

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    const result = await customer.save();
    res.send(result);
});

router.get('/', async (req, res) => {
    const customers = await Customer.find()
        .sort('name');

    if (customers.length === 0) return res.status(400).send('database is empty...!');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).send('The customer with given id was not found');

    const customer = await Customer.findById({ _id: id });
    if (!customer) return res.status(400).send('The customer with a given id was not found...!');

    res.send(customer)
});


router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).send('The id is required...!');

    const { error } = validateCustomer(req.body);
    if (error) return res.status(404).send(error.message);

    const customer = await Customer.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                isGold: req.body.isGold,
                name: req.body.name,
                phone: req.body.phone
            }
        },
        { new: true })
    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).send('The id is required...!');

    const customer = await Customer.findOneAndDelete({ _id: id });
    res.send(customer);
});

module.exports = router;