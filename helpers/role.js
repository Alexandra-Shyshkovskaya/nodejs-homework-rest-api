const { HttpCode } = require('./constants');
const { FORBIDDEN } = require('./messages/role-message');

const role = (role) => (req, res, next) => {
    const roleUser = req.user.subscription;

    if (roleUser !== role) {
        return res.status(HttpCode.FORBIDDEN).json({
            status: 'Error',
            code: HttpCode.FORBIDDEN,
            message: FORBIDDEN[req.app.get('lang')],
        });
    };

    return next();
};

module.exports = role;