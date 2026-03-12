const Campaign = require('../models/Campaign');
const { validationResult } = require('express-validator');

exports.createCampaign = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const campaignData = {
            ...req.body,
            user_id: req.user.id,
            status: 'draft'
        };

        const campaign = await Campaign.create(campaignData);

        res.status(201).json({
            success: true,
            campaign
        });
    } catch (error) {
        next(error);
    }
};

exports.getCampaigns = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filters = {
            status: req.query.status || 'active',
            category: req.query.category,
            search: req.query.search
        };

        const result = await Campaign.findAll(filters, page, limit);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

exports.getCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        await Campaign.incrementViews(req.params.id);

        res.json({
            success: true,
            campaign
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        if (campaign.user_id !== req.user.id && !req.user.is_admin) {
            return res.status(403).json({ message: 'Not authorized to update this campaign' });
        }

        const updatedCampaign = await Campaign.update(req.params.id, req.body);

        res.json({
            success: true,
            campaign: updatedCampaign
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        if (campaign.user_id !== req.user.id && !req.user.is_admin) {
            return res.status(403).json({ message: 'Not authorized to delete this campaign' });
        }

        await Campaign.delete(req.params.id);

        res.json({
            success: true,
            message: 'Campaign deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.getUserCampaigns(req.user.id);

        res.json({
            success: true,
            campaigns
        });
    } catch (error) {
        next(error);
    }
};

exports.getFeaturedCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.getFeatured();

        res.json({
            success: true,
            campaigns
        });
    } catch (error) {
        next(error);
    }
};

exports.getTrendingCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.getTrending();

        res.json({
            success: true,
            campaigns
        });
    } catch (error) {
        next(error);
    }
};

exports.publishCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        if (campaign.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to publish this campaign' });
        }

        const updatedCampaign = await Campaign.update(req.params.id, {
            status: 'active',
            start_date: new Date()
        });

        res.json({
            success: true,
            campaign: updatedCampaign
        });
    } catch (error) {
        next(error);
    }
};
