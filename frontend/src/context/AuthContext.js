import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── load profile row from public.profiles ── */
  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('loadProfile exception:', err);
      return null;
    }
  };

  /* ── listen to Supabase auth state ── */
  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const p = await loadProfile(s.user.id);
        setProfile(p);
      }
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      setUser(s?.user ?? null);

      if (s?.user) {
        const p = await loadProfile(s.user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── REGISTER ── */
  const register = async ({ full_name, email, password, phone }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, phone },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Insert profile row
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name,
          email,
          phone: phone || null,
          created_at: new Date().toISOString(),
        });
        if (profileError) console.error('Profile creation error:', profileError);
      }

      // Supabase may require email confirmation depending on project settings
      if (data.session) {
        toast.success('Account created! Welcome to Raiser 🎉');
      } else {
        toast.success('Account created! Please check your email to confirm your account.');
      }

      return { success: true, requiresEmailConfirmation: !data.session };
    } catch (error) {
      const msg = error.message || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  /* ── LOGIN ── */
  const login = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success(`Welcome back, ${data.user.user_metadata?.full_name?.split(' ')[0] || 'there'}! 👋`);
      return { success: true };
    } catch (error) {
      const msg = error.message || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  /* ── LOGOUT ── */
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    toast.success('You\'ve been logged out.');
  };

  /* ── FORGOT PASSWORD ── */
  const forgotPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset email sent! Check your inbox.');
      return { success: true };
    } catch (error) {
      const msg = error.message || 'Failed to send reset email';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  /* ── RESET PASSWORD (after email link) ── */
  const resetPassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully!');
      return { success: true };
    } catch (error) {
      const msg = error.message || 'Failed to update password';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  /* ── UPDATE PROFILE ── */
  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('Not authenticated');

      // Update Supabase auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: profileData.full_name, phone: profileData.phone },
      });
      if (authError) throw authError;

      // Update profiles table
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const msg = error.message || 'Failed to update profile';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  /* ── GOOGLE OAUTH ── */
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) toast.error(error.message);
  };

  const value = {
    user,
    profile,
    session,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    loginWithGoogle,
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin || false,
    displayName: profile?.full_name || user?.user_metadata?.full_name || user?.email,
    avatarInitials: (
      profile?.full_name || user?.user_metadata?.full_name || user?.email || 'U'
    ).charAt(0).toUpperCase(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};