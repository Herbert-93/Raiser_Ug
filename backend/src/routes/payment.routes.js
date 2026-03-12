const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    processMTNPayment,
    processAirtelPayment,
    processCardPayment,
    getPaymentStatus,
    getCampaignDonations
} = require('../controllers/payment.controller');

const paymentValidation = [
    body('amount').isNumeric().isFloat({ min: 100 }),
    body('campaignId').notEmpty().isUUID(),
    body('phone').optional().matches(/^0[7][0-9]{8}$/),
    body('donorName').optional().trim().escape(),
    body('donorEmail').optional().isEmail().normalizeEmail()
];

router.post('/mtn', paymentValidation, processMTNPayment);
router.post('/airtel', paymentValidation, processAirtelPayment);
router.post('/card', paymentValidation, processCardPayment);
router.get('/:id/status', getPaymentStatus);
router.get('/campaign/:campaignId', getCampaignDonations);

module.exports = router;
