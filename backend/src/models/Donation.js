const { supabase, supabaseAdmin } = require('../config/supabase');

class Donation {
    static async create(donationData) {
        const { data, error } = await supabaseAdmin
            .from('donations')
            .insert([donationData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('donations')
            .select(`
                *,
                campaigns!inner (
                    title,
                    user_id,
                    users!inner (
                        full_name,
                        email,
                        phone
                    )
                )
            `)
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }

    static async update(id, updates) {
        const { data, error } = await supabaseAdmin
            .from('donations')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    static async getCampaignDonations(campaignId, page = 1, limit = 20) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
            .from('donations')
            .select('*', { count: 'exact' })
            .eq('campaign_id', campaignId)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .range(from, to);
        
        if (error) throw error;
        
        return {
            donations: data,
            total: count,
            page,
            totalPages: Math.ceil(count / limit)
        };
    }

    static async getUserDonations(userId) {
        const { data, error } = await supabase
            .from('donations')
            .select(`
                *,
                campaigns!inner (
                    id,
                    title,
                    cover_image
                )
            `)
            .eq('donor_id', userId)
            .eq('status', 'completed')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    static async getTotalForCampaign(campaignId) {
        const { data, error } = await supabase
            .from('donations')
            .select('amount')
            .eq('campaign_id', campaignId)
            .eq('status', 'completed');
        
        if (error) throw error;
        
        const total = data.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
        return total;
    }

    static async getRecentDonations(limit = 10) {
        const { data, error } = await supabase
            .from('donations')
            .select(`
                *,
                campaigns!inner (
                    title,
                    users!inner (
                        full_name
                    )
                )
            `)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data;
    }

    static async getDonationStats(campaignId) {
        const { data, error } = await supabase
            .from('donations')
            .select('amount, created_at')
            .eq('campaign_id', campaignId)
            .eq('status', 'completed')
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        const total = data.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        const count = data.length;
        const average = count > 0 ? total / count : 0;
        
        // Group by date for chart
        const byDate = data.reduce((acc, d) => {
            const date = new Date(d.created_at).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += parseFloat(d.amount);
            return acc;
        }, {});
        
        return {
            total,
            count,
            average,
            byDate
        };
    }
}

module.exports = Donation;
