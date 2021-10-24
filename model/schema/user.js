const { Schema, model } = require('mongoose');
const { Subscription } = require('../helpers/constants');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 6;

const userSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            validate(value) {
                const re = /\S+@\S+.\S+/
                return re.test(String(value).toLowerCase())
            },
        },
        subscription: {
            type: String,
            enum: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
            default: Subscription.STARTER,
        },
        name: {
            type: String,
            default: 'Guest'
        },
        token: {
            type: String,
            default: null,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
    };
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;