require('dotenv').config();

const {
    SECRET_KEY,
    PUBLIC_KEY,
    PRIVATE_KEY
} = process.env;

module.exports = {
    SECRET_KEY,
    PUBLIC_KEY,
    PRIVATE_KEY
};
