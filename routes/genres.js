const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { Genre, validateGenre } = require('../model/genre.js');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });

    genre = await genre.save();
    res.send(genre);
});

router.get('/', async (req, res, next) => {
    const genre = await Genre.find().sort('name');

    if (genre.length === 0) return res.status(400).send('database is empty...!');
    res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const id = req.params.id;

    const genre = await Genre.findOne({ _id: id });
    if (!genre) return res.status(400).send('Genre was not found...!');

    res.send(genre);
});


router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const id = req.params.id;
    // if (!id) return res.status(404).send('The id is required..!');

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await Genre.findOneAndUpdate({
        _id: id
    },
        {
            $set: {
                name: req.body.name
            }
        },
        { new: true });
    res.send(result);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const id = req.params.id;
    // if (!id) return res.status(404).send('Id is required...!')

    const result = await Genre.findOneAndDelete({ _id: id });
    res.send(result);
});

module.exports = router;