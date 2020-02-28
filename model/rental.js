const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const { movieSchema } = require('../model/movie.js');
const { customerSchema } = require('../model/customer')
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date,
    },
    rentalFee: {
        type: Number
    }
});
function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })
    return schema.validate(rental);
};

rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
};

rentalSchema.methods.calculateRentalFee = function (dailyRentalRate, period) {
    return dailyRentalRate * period;
};

rentalSchema.methods.processDevolution = function () {
    this.returnDate = new Date();
    const period = this.returnDate.getDate() - this.dateOut.getDate() + 3;
    this.rentalFee = this.calculateRentalFee(this.movie.dailyRentalRate, period);
}

const Rental = mongoose.model('Rental', rentalSchema);

exports.Rental = Rental;
exports.rentalSchema = rentalSchema;
exports.validateRental = validateRental;