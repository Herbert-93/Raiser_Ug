const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, updateProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('phone').matches(/^0[7][0-9]{8}$/).withMessage('Invalid Ugandan phone number'),
    body('full_name').notEmpty().trim().escape(),
    body('password').isLength({ min: 6 })
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
