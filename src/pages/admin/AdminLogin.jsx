import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ShieldCheck, Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLogin() {
  const { login, register } = useAdmin();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let success = false;
    if (isLogin) {
      success = login(formData.email, formData.password);
      if (!success) setError('Invalid credentials. Please try again.');
    } else {
      success = register(formData.name, formData.email, formData.password);
      if (!success) setError('Registration failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: '#FAF6F0', color: '#1a1a1a' }}>
      
      {/* Background Grid Pattern */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.05,
        backgroundImage: "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none"
      }} />

      {/* Decorative Stickers */}
      <motion.div 
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: -10 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="absolute top-[10%] left-[10%] hidden lg:flex items-center justify-center w-16 h-16 bg-[#FFD800] border-2 border-[#222222] rounded-2xl shadow-[4px_4px_0px_#222222]"
      >
        <Sparkles className="w-8 h-8 text-[#222222]" />
      </motion.div>

      <motion.div 
        initial={{ scale: 0, rotate: 20 }}
        animate={{ scale: 1, rotate: 15 }}
        transition={{ type: "spring", delay: 0.4 }}
        className="absolute bottom-[15%] right-[12%] hidden lg:flex items-center justify-center w-20 h-20 bg-[#AEE6FF] border-2 border-[#222222] rounded-full shadow-[4px_4px_0px_#222222]"
      >
        <ShieldCheck className="w-10 h-10 text-[#222222]" />
      </motion.div>

      <div className="w-full max-w-[1000px] flex flex-col lg:flex-row bg-white rounded-3xl border-2 border-[#222222] shadow-[8px_8px_0px_#222222] overflow-hidden relative z-10">
        
        {/* Left Side - Branding */}
        <div className="lg:w-5/12 bg-[#FFD800] p-10 flex flex-col justify-center items-center text-center border-b-2 lg:border-b-0 lg:border-r-2 border-[#222222] relative overflow-hidden">
          {/* Abstract circles */}
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#EF4A45] rounded-full border-2 border-[#222222] opacity-50" />
          <div className="absolute bottom-[-30px] left-[-30px] w-24 h-24 bg-[#AEE6FF] rounded-full border-2 border-[#222222] opacity-50" />

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-[#222222] mb-4 tracking-tight leading-tight">
              Jog & Joy<br/>
              <span className="text-[#EF4A45] font-serif italic font-normal">Admin HQ</span>
            </h1>
            <p className="text-[#222222] font-semibold text-lg max-w-[250px] mx-auto opacity-80">
              Manage the storefront with style and confidence!
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-7/12 p-8 md:p-12 bg-white relative">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-[#222222] mb-2">
              {isLogin ? 'Welcome Back 👋' : 'Join the Team 🚀'}
            </h2>
            <p className="text-gray-500 font-medium">
              {isLogin 
                ? 'Enter your admin credentials to continue.' 
                : 'Register a new admin account to get started.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-bold text-[#222222] mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-[#222222] font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#222222] focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-bold text-[#222222] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@jogandjoy.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-[#222222] font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#222222] focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#222222] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-[#222222] font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#222222] focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#EF4A45] font-bold text-sm bg-[#EF4A45]/10 p-3 rounded-lg border-2 border-[#EF4A45]/20"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#EF4A45] text-white font-bold py-4 rounded-xl border-2 border-[#222222] shadow-[0px_4px_0px_#222222] hover:-translate-y-1 hover:shadow-[0px_6px_0px_#222222] active:translate-y-1 active:shadow-[0px_0px_0px_#222222] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[#222222] font-medium">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="text-[#EF4A45] hover:text-[#d33a36] font-bold underline decoration-2 underline-offset-4 transition-colors"
              >
                {isLogin ? 'Register now' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
