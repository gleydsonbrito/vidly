const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const { User } = require('../model/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email }).select('password 1 isAdmin');
    if (!user) return res.status(400).send('Invalid email or password ...!')

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(400).send('Invalid email or password...!');

    const token = await user.generateAuthToken();
    res.header('x-auth-token', token).send(token);
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(1),
        isAdmin: Joi.boolean()
    });
    return schema.validate(req);
}

module.exports = router;