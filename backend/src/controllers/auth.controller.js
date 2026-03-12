const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, phone, full_name, password } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const existingPhone = await User.findByPhone(phone);
        if (existingPhone) {
            return res.status(400).json({ message: 'User already exists with this phone number' });
        }

        const user = await User.create({
            email,
            phone,
            full_name,
            password
        });

        const token = generateToken(user.id);

        delete user.password_hash;

        res.status(201).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await User.comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

        delete user.password_hash;

        res.json({
            success: true,
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        delete user.password_hash;

        res.json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const updates = {
            full_name: req.body.full_name,
            bio: req.body.bio,
            location: req.body.location,
            profile_image: req.body.profile_image
        };

        Object.keys(updates).forEach(key => 
            updates[key] === undefined && delete updates[key]
        );

        const user = await User.update(req.user.id, updates);

        delete user.password_hash;

        res.json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};
