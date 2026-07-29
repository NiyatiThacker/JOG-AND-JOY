import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check localStorage for saved session
      const savedUser = localStorage.getItem('jog_n_joy_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        
        // Fetch latest from DB to ensure data like phone/address is up to date
        if (parsed?.id) {
          const { data } = await supabase.from('users').select('*').eq('id', parsed.id).single();
          if (data) {
            setUser(data);
            localStorage.setItem('jog_n_joy_user', JSON.stringify(data));
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const isAuthenticated = !!user;

  const login = async (email, password) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();
    
    if (error || !data) {
      console.error('Login error:', error?.message || 'Invalid credentials');
      return false;
    }
    
    setUser(data);
    localStorage.setItem('jog_n_joy_user', JSON.stringify(data));
    return true;
  };

  const register = async (name, email, password, role = 'CUSTOMER', phone = '', address = '') => {
    // Check if email exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.error('Registration error: Email already exists');
      return false;
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password, role, phone, address }])
      .select()
      .single();

    if (error || !data) {
      console.error('Registration error:', error?.message);
      return false;
    }
    
    setUser(data);
    localStorage.setItem('jog_n_joy_user', JSON.stringify(data));
    return true;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('jog_n_joy_user');
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
    localStorage.setItem('jog_n_joy_user', JSON.stringify(data));
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

