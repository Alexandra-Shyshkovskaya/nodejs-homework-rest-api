const jwt = require('jsonwebtoken');
const path = require("path");
const mkdirp = require("mkdirp");
const Users = require('../repository/users');
const UploadService = require('../services/file-upload');
const { HttpCode, Subscription} = require('../helpers/constants');
const EmailService = require("../services/email/service");
const CreateSender = require("../services/email/sender");

require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
    const {email, password, subscription } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'Error',
            code: HttpCode.CONFLICT,
            message: 'Email is already exist',
        })
    }
    try {
        const newUser = await Users.create({ email, password, subscription });
        const emailService = new EmailService(
            process.env.NODE_ENV,
            new CreateSender()
        );
        const statusEmail = await emailService.sendVerifyEmail(
            newUser.email,
            newUser.name,
            newUser.verifyToken
        );

        return res.status(HttpCode.CREATED).json({
            status: 'Success',
            code: HttpCode.CREATED,
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                subscription: newUser.subscription,
                avatar: newUser.avatar,
                successEmail: statusEmail;
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findByEmail(email);
        const isValidPassword = await user?.isValidPassword(password);
        if (!user || !isValidPassword || !user?.verify) {
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

const verifyUser = async (req, res, next) => {
  const user = await Users.findUserByVerifyToken(req.params.token);
  if (user) {
    await Users.updateTokenVerify(user._id, true, null);
    return res.status(HttpCode.OK).json({
      status: "Success",
      code: HttpCode.OK,
      data: {
        message: "Success",
      },
    });
  }
  return res.status(HttpCode.NOT_FOUND).json({
    status: "Error",
    code: HttpCode.NOT_FOUND,
    message: "User not found",
  });
};

const repeatSendEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findByEmail(email);

  if (!email) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "Error",
      code: HttpCode.BAD_REQUEST,
      message: "Email missing required field",
    });
  }

  if (user && user.verifyToken) {
    const { email, name, verifyToken } = user;
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSender()
    );

    await emailService.sendVerifyEmail(email, name, verifyToken);

    return res.status(HttpCode.OK).json({
      status: "Success",
      code: HttpCode.OK,
      data: {
        message: "Verification email sent",
      },
    });
  }
  return res.status(HttpCode.BAD_REQUEST).json({
    status: "Error",
    code: HttpCode.BAD_REQUEST,
    message: "Verification has already been passed",
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
    verifyUser,
    repeatSendEmail,
};