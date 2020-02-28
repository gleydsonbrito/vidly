const { Movie } = require('../model/movie');
const { Rental } = require('../model/rental');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const auth = require('../middleware/auth');
const validator = require('../middleware/validator');
const express = require('express');
const router = express.Router();

router.post('/', [auth, validator(validateReturns)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental)
        return res.status(404).send('Theres no rental for given movie/customer');

    if (rental.returnDate)
        return res.status(400).send('The rental already processed');

    rental.processDevolution();
    await rental.save();

    await Movie.findByIdAndUpdate({ _id: req.body.movieId }, {
        $inc: { numberInStock: 1 },
    });

    res.send(rental);
});

function validateReturns(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })
    return schema.validate(req.body);
}

module.exports = router;