const jwt = require('jsonwebtoken');
const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET || 'secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(payload, secret, { expiresIn });
};
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.verify(token, secret);
};
module.exports = { generateToken, verifyToken };