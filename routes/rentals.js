const auth = require('../middleware/auth')
const { Rental, validateRental } = require('../model/rental');
const { Customer } = require('../model/customer');
const { Movie } = require('../model/movie');
const mongoose = require('mongoose');
const Fawn = require('fawn')
const express = require('express');
const routes = express.Router();

Fawn.init(mongoose);

routes.get('/', async (req, res) => {
    const rentals = await Rental.find()
        .sort('returnDate')
        .select('-__v');

    if (!rentals) return res.status(400).send('Sorry, Rentals database is empty...!');

    res.send(rentals);
});

routes.post('/', auth,  async (req, res) => {
    const customerId = req.body.customerId;
    const movieId = req.body.movieId;

    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) return res.status(400).send('Customer was not found...!');

    const movie = await Movie.findOne({ _id: movieId });
    if (!movie) return res.status(400).send(`Movie with given id was not found...!`);

    if (movie.numberInStock === 0) return res.status(400).send("There's no stock for this movie...!")

    const rental = new Rental({
        customer: {
            isGold: customer.isGold,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            title: movie.title,
            genre: movie.genre,
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        })
        .run();

    res.send(rental);
});


module.exports = routes;