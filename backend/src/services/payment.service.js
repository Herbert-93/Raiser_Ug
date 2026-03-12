const axios = require('axios');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

class PaymentService {
    // MTN Mobile Money
    async processMTNPayment(donationData) {
        try {
            const { amount, phone, campaignId, donorName, donorEmail } = donationData;
            
            // Format phone number
            const formattedPhone = this.formatPhoneNumber(phone, 'MTN');
            
            // Generate reference
            const reference = `MTN-${crypto.randomBytes(8).toString('hex')}`;
            
            // Create donation record
            const donation = await Donation.create({
                campaign_id: campaignId,
                donor_name: donorName,
                donor_email: donorEmail,
                amount,
                currency: 'UGX',
                payment_method: 'mtn',
                payment_reference: reference,
                status: 'pending'
            });
            
            return {
                success: true,
                reference,
                donationId: donation.id,
                message: 'Payment request sent to MTN. Please check your phone to complete payment.'
            };
        } catch (error) {
            console.error('MTN Payment Error:', error);
            throw new Error('Failed to process MTN payment');
        }
    }

    // Airtel Money
    async processAirtelPayment(donationData) {
        try {
            const { amount, phone, campaignId, donorName, donorEmail } = donationData;
            
            // Format phone number
            const formattedPhone = this.formatPhoneNumber(phone, 'AIRTEL');
            
            // Generate reference
            const reference = `AIR-${crypto.randomBytes(8).toString('hex')}`;
            
            // Create donation record
            const donation = await Donation.create({
                campaign_id: campaignId,
                donor_name: donorName,
                donor_email: donorEmail,
                amount,
                currency: 'UGX',
                payment_method: 'airtel',
                payment_reference: reference,
                status: 'pending'
            });
            
            return {
                success: true,
                reference,
                donationId: donation.id,
                message: 'Payment request sent to Airtel. Please check your phone to complete payment.'
            };
        } catch (error) {
            console.error('Airtel Payment Error:', error);
            throw new Error('Failed to process Airtel payment');
        }
    }

    // Stripe Card Payment
    async processCardPayment(donationData) {
        try {
            const { amount, token, campaignId, donorName, donorEmail } = donationData;
            
            // Create payment intent with Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'usd',
                payment_method_data: {
                    type: 'card',
                    card: {
                        token: token
                    }
                },
                confirm: true,
                receipt_email: donorEmail,
                metadata: {
                    campaign_id: campaignId,
                    donor_name: donorName
                }
            });
            
            if (paymentIntent.status === 'succeeded') {
                const donation = await Donation.create({
                    campaign_id: campaignId,
                    donor_name: donorName,
                    donor_email: donorEmail,
                    amount,
                    currency: 'USD',
                    payment_method: 'card',
                    transaction_id: paymentIntent.id,
                    status: 'completed'
                });
                
                await this.updateCampaignAmount(campaignId, amount);
                
                return {
                    success: true,
                    donationId: donation.id,
                    transactionId: paymentIntent.id,
                    message: 'Payment completed successfully!'
                };
            } else {
                throw new Error('Payment failed');
            }
        } catch (error) {
            console.error('Card Payment Error:', error);
            throw new Error('Failed to process card payment');
        }
    }

    async updateCampaignAmount(campaignId, amount) {
        const campaign = await Campaign.findById(campaignId);
        const newAmount = parseFloat(campaign.raised_amount) + parseFloat(amount);
        
        await Campaign.update(campaignId, { raised_amount: newAmount });
    }

    formatPhoneNumber(phone, network) {
        let cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.startsWith('256')) {
            cleaned = '0' + cleaned.substring(3);
        } else if (cleaned.startsWith('+256')) {
            cleaned = '0' + cleaned.substring(4);
        }
        
        if (cleaned.length === 10 && cleaned.startsWith('07')) {
            return cleaned;
        }
        
        throw new Error(`Invalid ${network} phone number format`);
    }
}

module.exports = new PaymentService();
