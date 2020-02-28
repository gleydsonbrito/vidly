const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    isAdmin: {
        type: Boolean
    }
});

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        isAdmin: Joi.boolean()
    });

    return schema.validate(user);
}

userSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    catch (ex) {
        console.log(ex.message);
    }

});

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
        return token;
    }
    catch (ex) {
        console.log(ex.message);
    }
}

const User = mongoose.model('User', userSchema);

exports.userSchema = userSchema;
exports.User = User;
exports.validateUser = validateUser;