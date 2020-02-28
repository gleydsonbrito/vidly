const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    }
});

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string()
            .min(5)
            .max(50)
            .required()
    })

    return schema.validate(genre);
}

const Genre = mongoose.model('Genre', genreSchema);

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;