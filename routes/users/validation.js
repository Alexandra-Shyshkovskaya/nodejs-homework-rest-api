const Joi = require('joi');
const { Subscription, HttpCode } = require('../helpers/constants');

const schemaAddUser = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .pattern(/[A-Z]\w+/)
        .optional(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(7)
        .required(),
    subscription: Joi.string()
        .valid(Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS)
        .optional()
});

const schemaLogin = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(7)
        .required(),
});

const schemaUpdateSubscriptionUser = Joi.object({
    subscription: Joi.string()
        .valid(Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS)
        .required(),
});

const validate = async (schema, obj, next) => {
    try {
        await schema.validateAsync(obj);
        return next();
    } catch (err) {
        next({
            status: 'Error',
            code: HttpCode.BAD_REQUEST,
            message: `Field ${err.message.replace(/"/g, '')}`,
        });
    }
};

module.exports.validateCreateUser = (req, _res, next) => {
    return validate(schemaAddUser, req.body, next);
};

module.exports.validateUpdateSubscription = (req, _res, next) => {
    return validate(schemaUpdateSubscriptionUser, req.body, next);
};

module.exports.validateLogin = (req, _res, next) => {
    return validate(schemaLogin, req.body, next);
};