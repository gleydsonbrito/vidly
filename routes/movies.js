const auth = require('../middleware/auth');
const { Genre } = require('../model/genre');
const { Movie, validateMovie } = require('../model/movie');
const express = require('express');
const routes = express.Router();

routes.post('/', auth, async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.message);

    const { title, genreId, numberInStock, delayRentalRate } = req.body;

    const genre = await Genre.findOne({ _id: genreId });
    if (!genre) return res.status(400).send('Invalid Genre...!');

    const movie = new Movie({
        title: title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: numberInStock,
        delayRentalRate: delayRentalRate
    });

    const result = await movie.save();
    res.send(result);
});

routes.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');

    if (movies.length === 0) return res.status(400).send('Sorry, Database is empty...');
    res.send(movies);
});

routes.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(404).send('Id is required...');

    const movie = await Movie.find({ _id: id });
    if (!movie) return res.status(404).send('The movie with the given id was not found...!');

    res.send(movie);
});



routes.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const { title, genreId, numberInStock, delayRentalRate } = req.body;

    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findOne({ _id: genreId });
    if (!genre) return res.status(400).send('Invalid Genre...!');

    const movie = await Movie.findOneAndUpdate({ _id: id },
        {
            $set: {
                title: title,
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: numberInStock,
                delayRentalRate: delayRentalRate
            }
        },
        { new: true });
    res.send(movie);
});

routes.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).send('The movie with given id was not found...!')

    const movie = await Movie.findOneAndDelete({ _id: id })
    res.send(movie); res.send(ex.message);
});

module.exports = routes;