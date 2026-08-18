import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUserId = localStorage.getItem('jog_joy_user_id');
        if (storedUserId) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', storedUserId)
            .single();
          
          if (!error && data) {
            setUser(data);
          } else {
            localStorage.removeItem('jog_joy_user_id');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const isAuthenticated = !!user;

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !data) {
        console.error('Login error: User not found');
        return false;
      }
      
      // Plain text password comparison as requested
      if (data.password === password) {
        setUser(data);
        localStorage.setItem('jog_joy_user_id', data.id);
        return true;
      } else {
        console.error('Login error: Incorrect password');
        return false;
      }
    } catch (err) {
      console.error('Login exception:', err);
      return false;
    }
  };

  const register = async (name, email, password, role = 'CUSTOMER', phone = '', address = '') => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          name, 
          email, 
          password, 
          role, 
          phone, 
          address 
        }])
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error.message);
        return false;
      }
      
      if (data) {
        setUser(data);
        localStorage.setItem('jog_joy_user_id', data.id);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Registration exception:', err);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('jog_joy_user_id');
  };

  const resetPassword = async (email) => {
    console.error('Reset password is not supported with plain table authentication without a backend.');
    return { success: false, message: 'Password reset is disabled for custom table auth.' };
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
        resetPassword,
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
