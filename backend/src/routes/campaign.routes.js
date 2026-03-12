const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createCampaign,
    getCampaigns,
    getCampaign,
    updateCampaign,
    deleteCampaign,
    getUserCampaigns,
    getFeaturedCampaigns,
    getTrendingCampaigns,
    publishCampaign
} = require('../controllers/campaign.controller');
const { protect } = require('../middleware/auth.middleware');

const campaignValidation = [
    body('title').notEmpty().trim().escape(),
    body('description').notEmpty().trim().escape(),
    body('goal_amount').isNumeric().isFloat({ min: 1000 }),
    body('category').notEmpty(),
    body('location').optional().trim().escape()
];

router.get('/', getCampaigns);
router.get('/featured', getFeaturedCampaigns);
router.get('/trending', getTrendingCampaigns);
router.get('/:id', getCampaign);

router.use(protect);
router.post('/', campaignValidation, createCampaign);
router.get('/user/me', getUserCampaigns);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);
router.put('/:id/publish', publishCampaign);

module.exports = router;
