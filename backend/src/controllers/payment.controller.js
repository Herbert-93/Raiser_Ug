const PaymentService = require('../services/payment.service');
const Donation = require('../models/Donation');
const { validationResult } = require('express-validator');

exports.processMTNPayment = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const result = await PaymentService.processMTNPayment({
            ...req.body,
            donorId: req.user?.id
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.processAirtelPayment = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const result = await PaymentService.processAirtelPayment({
            ...req.body,
            donorId: req.user?.id
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.processCardPayment = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const result = await PaymentService.processCardPayment({
            ...req.body,
            donorId: req.user?.id
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getPaymentStatus = async (req, res, next) => {
    try {
        const donation = await Donation.findById(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        res.json({
            success: true,
            status: donation.status,
            donation
        });
    } catch (error) {
        next(error);
    }
};

exports.getCampaignDonations = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await Donation.getCampaignDonations(req.params.campaignId, page, limit);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};
