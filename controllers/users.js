const jwt = require('jsonwebtoken');
const path = require("path");
const mkdirp = require("mkdirp");
const Users = require('../repository/users');
const { HttpCode, Subscription} = require('../helpers/constants');
require('dotenv').config();
const UploadService = require('../services/file-upload');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
    const {email} = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'Error',
            code: HttpCode.CONFLICT,
            message: 'Email is already exist',
        })
    }
    try {
        const newUser = await Users.create(req.body);
        return res.status(HttpCode.CREATED).json({
            status: 'Success',
            code: HttpCode.CREATED,
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                subscription: newUser.subscription,
                avatar: newUser.avatar,
            },
        })
    } catch (error) {
        next(error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findByEmail(email);
        const isValidPassword = await user?.isValidPassword(password);
        if (!user || !isValidPassword) {
            return res.status(HttpCode.UNAUTHORIZED).json({
                status: 'Error',
                code: HttpCode.UNAUTHORIZED,
                message: 'Email or password is wrong',
            });
        };
        const id = user.id;
        const payload = { id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
        await Users.updateToken(id, token);
        return res.status(HttpCode.OK).json({
            status: 'Success',
            code: HttpCode.OK,
            date: {
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res) => {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
};

const current = async (req, res, next) => {
    try {
        const { id, name, email, subscription } = req.user;
        return res.status(HttpCode.OK).json({
            status: 'Success',
            code: HttpCode.OK,
            data: {
                id,
                name,
                email,
                subscription,
            },
        });
    } catch (error) {
        next(error);
    };
};

const updateSubscription = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await Users.updateSubscription(id, req.body)
        if (user) {
            return res.json({
                status: 'Success',
                code: HttpCode.OK,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    subscription: user.subscription,
                },
            })
        } else {
            return res.status(HttpCode.NOT_FOUND).json({
                status: 'Error',
                code: HttpCode.NOT_FOUND,
                data: 'Not found',
            });
        };
    } catch (error) {
        next(error);
    };
};

const onlyStarter = async (_req, res) => {
    return res.json({
        status: 'Success',
        code: HttpCode.OK,
        data: {
            message: `Only ${Subscription.STARTER}`,
        },
    });
};

const onlyPro = async (_req, res) => {
    return res.json({
        status: 'Success',
        code: HttpCode.OK,
        data: {
            message: `Only ${Subscription.PRO}`,
        },
    });
};

const onlyBusiness = async (_req, res) => {
    return res.json({
        status: 'Success',
        code: HttpCode.OK,
        data: {
            message: `Only ${Subscription.BUSINESS}`,
        },
    });
};

const uploadAvatar = async (req, res, next) => {
    const userId = String(req.user._id);
    const file = req.file;
    const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
    const destination = path.join(AVATAR_OF_USERS, userId);
    await mkdirp(destination);
    const uploadService = new UploadService(destination);
    const avatarURL = await uploadService.save(file, userId);
    await Users.updateAvatar(userId, avatarURL);
    
    return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: {
      avatar: avatarURL,
    },
  });

    
};

module.exports = {
    signup,
    login,
    logout,
    current,
    updateSubscription,
    onlyStarter,
    onlyPro,
    onlyBusiness,
    uploadAvatar,
};