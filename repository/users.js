const User = require('../model/schema/user');

const findById = async (id) => {
    return await User.findById({ _id: id });
};

const findByEmail = async (email) => {
    return await User.findOne({ email });
};

const create = async (options) => {
    const user = new User(options);
    return await user.save();
};

const updateToken = async (id, token) => {
    return await User.updateOne({ _id: id }, { token });
};

const updateTokenVerify = async (id, verify, verifyToken) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken });
};

const updateSubscription = async (userId, body) => {
    const result = await User.findOneAndUpdate(
        { _id: userId },
        { ...body },
        { new: true }
    );
    return result;
};

const updateAvatar = async (id, avatar) => {
    return await User.updateOne({ _id: id }, { avatar });
};

const findUserByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken });
};

module.exports = {
    findById,
    findByEmail,
    create,
    updateToken,
    updateTokenVerify,
    updateSubscription,
    updateAvatar,
    findUserByVerifyToken,
};