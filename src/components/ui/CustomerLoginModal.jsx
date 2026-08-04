import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Loader2, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import emailjs from '@emailjs/browser';

export default function CustomerLoginModal({ isOpen, onClose }) {
  const { login, register, resetPassword } = useAuth();
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'name') value = value.replace(/[^A-Za-z\s]/g, '');
    if (name === 'phone') value = value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict JS Validation
    if (view === 'forgot') {
      if (!formData.email?.trim()) {
        setError('Email is required.');
        return;
      }
      setIsLoading(true);
      
      try {
        const res = await resetPassword(formData.email.trim());
        if (res?.success) {
          setSuccessMsg('If an account exists, a recovery link has been sent to your email.');
        } else {
          setError(res?.message || 'Failed to send recovery link. Please try again later.');
        }
      } catch (err) {
        console.error('Password reset error:', err);
        setError('Failed to send recovery link. Please try again later.');
      }
      
      setIsLoading(false);
      return;
    }

    if (view === 'register') {
      if (!formData.name?.trim()) {
        setError('Full Name is required.');
        return;
      }
      if (!formData.phone?.trim() || formData.phone.length !== 10) {
        setError('Valid 10-digit Phone Number is required.');
        return;
      }
      if (!formData.address?.trim()) {
        setError('Address is required.');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }
    
    setIsLoading(true);
    
    let success = false;
    if (view === 'login') {
      success = await login(formData.email.trim(), formData.password);
      if (!success) setError('Invalid email or password.');
    } else {
      success = await register(
        formData.name.trim(), 
        formData.email.trim(), 
        formData.password, 
        'CUSTOMER', 
        formData.phone.trim(), 
        formData.address.trim()
      );
      if (!success) setError('Registration failed. Please try again.');
    }
    
    setIsLoading(false);
    
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {view === 'login' ? 'Welcome Back!' : view === 'register' ? 'Join Jog & Joy' : 'Reset Password'}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {view === 'login' 
                ? 'Sign in to view your orders and saved items.' 
                : view === 'register' 
                  ? 'Create an account for faster checkout and exclusive deals.'
                  : 'Enter your email to receive a password reset link.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {view === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required={view === 'register'}
                      pattern="^[A-Za-z\s]+$"
                      title="Name can only contain letters and spaces"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>

                  <label className="block text-xs font-bold text-slate-700 mt-4 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required={view === 'register'}
                      pattern="^[0-9]{10}$"
                      maxLength={10}
                      title="Phone number must be exactly 10 digits"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>

                  <label className="block text-xs font-bold text-slate-700 mt-4 mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
                    <textarea
                      name="address"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleChange}
                      required={view === 'register'}
                      rows={2}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {view !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  {view === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => { setView('forgot'); setError(''); setSuccessMsg(''); }}
                      className="text-[10px] font-bold text-[#EF4A45] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required={view !== 'forgot'}
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#EF4A45] text-xs font-bold bg-[#EF4A45]/10 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}
            
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 text-xs font-bold bg-green-50 p-3 rounded-lg border border-green-100"
              >
                {successMsg}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#EF4A45] text-white font-bold py-3.5 rounded-xl hover:bg-[#d33a36] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {view === 'login' ? 'Sign In' : view === 'register' ? 'Create Account' : 'Send Recovery Link'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-medium text-slate-600">
            {view === 'login' ? "Don't have an account? " : view === 'register' ? "Already have an account? " : "Remembered your password? "}
            <button
              type="button"
              onClick={() => {
                setView(view === 'login' ? 'register' : 'login');
                setError('');
                setSuccessMsg('');
                setFormData({ name: '', email: '', password: '', phone: '', address: '' });
              }}
              className="text-[#EF4A45] hover:underline font-bold"
            >
              {view === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
