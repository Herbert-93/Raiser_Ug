const { supabase, supabaseAdmin } = require('../config/supabase');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const { email, phone, full_name, password } = userData;
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        const { data, error } = await supabaseAdmin
            .from('users')
            .insert([
                {
                    email,
                    phone,
                    full_name,
                    password_hash
                }
            ])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    static async findByPhone(phone) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('phone', phone)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }

    static async update(id, updates) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User;
