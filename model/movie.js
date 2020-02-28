const Joi = require('@hapi/joi');
const {genreSchema} = require('./genre')
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true,
        minlength: 0,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255
    }
});

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().required(),
        delayRentalRate: Joi.number().required()
    })

    return schema.validate(movie);
}

const Movie = mongoose.model('Movie', movieSchema);

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validateMovie = validateMovie;