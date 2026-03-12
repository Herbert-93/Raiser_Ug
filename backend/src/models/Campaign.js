const { supabase, supabaseAdmin } = require('../config/supabase');

class Campaign {
    static async create(campaignData) {
        const { data, error } = await supabaseAdmin
            .from('campaigns')
            .insert([campaignData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    static async findAll(filters = {}, page = 1, limit = 10) {
        let query = supabase
            .from('campaigns')
            .select(`
                *,
                users!inner (
                    id,
                    full_name,
                    profile_image,
                    is_verified
                ),
                donations:donations (
                    amount,
                    donor_name,
                    created_at
                )
            `, { count: 'exact' });

        // Apply filters
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.search) {
            query = query.ilike('title', `%${filters.search}%`);
        }

        // Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        
        query = query.range(from, to).order('created_at', { ascending: false });

        const { data, error, count } = await query;
        
        if (error) throw error;
        
        return {
            campaigns: data,
            total: count,
            page,
            totalPages: Math.ceil(count / limit)
        };
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('campaigns')
            .select(`
                *,
                users!inner (
                    id,
                    full_name,
                    profile_image,
                    bio,
                    location,
                    is_verified,
                    created_at
                ),
                donations:donations (
                    id,
                    amount,
                    donor_name,
                    donor_email,
                    is_anonymous,
                    message,
                    created_at
                ),
                comments:comments (
                    id,
                    content,
                    created_at,
                    users!inner (
                        full_name,
                        profile_image,
                        is_verified
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
            .from('campaigns')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    static async delete(id) {
        const { error } = await supabaseAdmin
            .from('campaigns')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }

    static async incrementViews(id) {
        const { error } = await supabaseAdmin.rpc('increment_campaign_views', {
            campaign_id: id
        });
        
        if (error) throw error;
        return true;
    }

    static async getUserCampaigns(userId) {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    static async getFeatured() {
        const { data, error } = await supabase
            .from('campaigns')
            .select(`
                *,
                users!inner (
                    full_name,
                    profile_image
                )
            `)
            .eq('is_featured', true)
            .eq('status', 'active')
            .limit(6);
        
        if (error) throw error;
        return data;
    }

    static async getTrending() {
        const { data, error } = await supabase
            .from('campaigns')
            .select(`
                *,
                users!inner (
                    full_name,
                    profile_image
                )
            `)
            .eq('status', 'active')
            .order('views', { ascending: false })
            .limit(10);
        
        if (error) throw error;
        return data;
    }
}

module.exports = Campaign;
