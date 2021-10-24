const rateLimit = require('express-rate-limit');
const { HttpCode } = require('../helpers/constants');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 3, 
    handler: (req, res, next) => {
        return res.status(HttpCode.TOO_MANY_REQUESTS).json({
            status: 'Error',
            code: HttpCode.TOO_MANY_REQUESTS,
            message: 'Too Many Requests, please try again later!',
        });
    },
})

module.exports = limiter;