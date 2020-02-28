const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    phone: {
        required: true,
        type: Number
    }
});

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required(),

        isGold: Joi.boolean(),

        phone: Joi.number()
            .required()
            .min(1)
    });
    return schema.validate(customer);
}

const Customer = mongoose.model('Customer', customerSchema)

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validateCustomer = validateCustomer;