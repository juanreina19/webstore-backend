const { verifyToken } = require('../utils/tokenUtils');
const User = require('../models/userModel');


const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user = user; // attach user
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};


const adminOnly = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    next();
};


module.exports = { protect, adminOnly };