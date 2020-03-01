const auth = require('../middleware/auth');
const _ = require('lodash');
const { User, validateUser } = require('../model/user');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(400).send('User is not found...!');

    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send('Invalid user ...!');

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered..!')

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));

    await user.save();

    const token = await user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', 'isAdmin']));
});

module.exports = router;