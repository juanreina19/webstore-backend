const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { generateToken } = require('../utils/tokenUtils');


exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered' });
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hash, role: 'user' });
        const token = generateToken({ id: user._id, role: user.role });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        next(err);
    }
};


exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = generateToken({ id: user._id, role: user.role });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        next(err);
    }
};


exports.getProfile = async (req, res, next) => {
    try {
        const user = req.user;
        res.json({ user });
    } catch (err) { next(err); }
};