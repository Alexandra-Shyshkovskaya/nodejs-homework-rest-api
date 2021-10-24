const express = require('express');
const router = express.Router();
const { signup,
    login,
    logout,
    current,
    updateSubscription,
    onlyStarter,
    onlyPro,
    onlyBusiness } = require('../../controllers/users');
const { validateCreateUser, validateLogin, validateUpdateSubscription } = require('./validation');
const guard = require('../../helpers/guard');
const { Subscription } = require('../../helpers/constants');
const role = require('../../helpers/role');
const loginLimit = require('../../helpers/rate-limit-login');

router.patch('/', guard, validateUpdateSubscription, updateSubscription);

router.post('/signup', validateCreateUser, signup);

router.post('/login', validateLogin, loginLimit, login);

router.post('/logout', guard, logout);

router.get('/current', guard, current);

router.get('/starter', guard, role(Subscription.STARTER), onlyStarter);

router.get('/pro', guard, role(Subscription.PRO), onlyPro);

router.get('/business', guard, role(Subscription.BUSINESS), onlyBusiness);

router.patch('/', guard, updateSubscription);


module.exports = router;