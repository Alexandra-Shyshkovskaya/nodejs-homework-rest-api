const Subscription = {
    STARTER: "starter",
    PRO: "pro",
    BUSINESS: "business",
};

const HttpCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
};

const LimitSize = {
    FIELD_SIZE: 2000000,
};

const SizeAvatar = {
    S:'250',
};


module.exports = { Subscription, HttpCode, LimitSize, SizeAvatar };