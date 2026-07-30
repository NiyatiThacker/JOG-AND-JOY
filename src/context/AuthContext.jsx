import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (userId) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        console.warn('Could not fetch from public.users, using session data fallback.', error);
        // Fallback: Use data from the auth session if public.users is missing/unavailable
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && session.user.id === userId) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            role: session.user.user_metadata?.role || 'CUSTOMER',
            phone: '',
            address: ''
          });
        }
      } else {
        setUser(data);
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user;

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    return true;
  };

  const register = async (name, email, password, role = 'CUSTOMER', phone = '', address = '') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (error) {
      console.error('Registration error:', error.message);
      return false;
    }

    if (data.user && (phone || address)) {
        // slight delay to allow postgres trigger to insert into public.users
        await new Promise(resolve => setTimeout(resolve, 500));
        await supabase
          .from('users')
          .update({ phone, address })
          .eq('id', data.user.id);
    }

    return true;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    }
  };

  const updateUser = async (updates) => {
    if (!user?.id) return false;
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error || !data) {
      console.error('Update user error:', error?.message);
      return false;
    }

    setUser(data);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

