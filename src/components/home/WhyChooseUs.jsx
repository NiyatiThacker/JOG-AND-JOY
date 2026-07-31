import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Card Container using #A5B890 Sage Green */}
        <div className="rounded-[40px] bg-[#A5B890] p-8 sm:p-14 text-slate-900 overflow-hidden relative shadow-2xl border-4 border-white/50">
          
          {/* Subtle Ambient Glow Effects */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#062019]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Photo Column */}
            <div className="lg:col-span-5 relative">
              <motion.div 
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="relative rounded-3xl overflow-hidden bg-white/40 p-3 shadow-xl border-2 border-white/80 backdrop-blur-md"
              >
                <img
                  src="https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=1000&auto=format&fit=crop"
                  alt="Mother and Child wearing stylish sunglasses"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop';
                  }}
                />

                {/* Floating Badge on Photo */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 border border-slate-100 font-extrabold text-xs uppercase tracking-wider">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Loved By 50,000+ Kids</span>
                </div>
              </motion.div>
            </div>

            {/* Right Features Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Animated Header with Original Logo & Glowing Aura */}
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#062019] leading-tight">
                  Why Choose
                </h2>

                {/* Logo Container with Animated Background Effects */}
                <div className="relative inline-flex items-center justify-center p-2 group cursor-pointer">
                  
                  {/* 1. Outer Pulsing Ring */}
                  <div className="absolute -inset-3 bg-linear-to-r from-[#FFD800] via-white to-[#AEE6FF] rounded-3xl blur-xl opacity-75 animate-pulse pointer-events-none"></div>

                  {/* 2. Rotating Gradient Aura Glow */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute -inset-2 bg-linear-to-r from-[#FFD800] via-[#FF5500] to-[#00A3E0] rounded-2xl blur-md opacity-90 pointer-events-none"
                  ></motion.div>

                  {/* Logo Image & Sparkles Wrapper */}
                  <div className="relative flex items-center justify-center p-1">
                    
                    {/* Floating Sparkles around Logo */}
                    <motion.div 
                      animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 45, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="absolute -top-4 -right-4 text-amber-300 z-20 pointer-events-none"
                    >
                      <Sparkles className="w-7 h-7 fill-amber-300" />
                    </motion.div>

                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], rotate: [0, -30, 0] }}
                      transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                      className="absolute -bottom-4 -left-4 text-amber-300 z-20 pointer-events-none"
                    >
                      <Sparkles className="w-6 h-6 fill-amber-300" />
                    </motion.div>

                    {/* Original JOG & JOY Logo Image with Floating & Tilt Animation */}
                    <motion.img
                      src="/images/official_logo.png"
                      alt="JOG & JOY®"
                      className="h-12 sm:h-16 md:h-20 object-contain relative z-10 filter drop-shadow-md"
                      animate={{ 
                        y: [0, -6, 0],
                        scale: [1, 1.04, 1],
                        rotate: [0, 1.5, -1.5, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3.5, 
                        ease: "easeInOut" 
                      }}
                      whileHover={{ scale: 1.12, rotate: 3 }}
                    />
                  </div>

                </div>
              </div>

              {/* Feature Points */}
              <div className="space-y-4 text-sm sm:text-base font-bold pt-2">
                
                <motion.div 
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-3 bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/80 shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#062019] text-white flex items-center justify-center font-black shrink-0 mt-0.5 shadow-md">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[#062019]">Inclusive & Ergonomic Sizing</h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">Standardized fit calibrated for growing active kids and men.</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-3 bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/80 shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#062019] text-white flex items-center justify-center font-black shrink-0 mt-0.5 shadow-md">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[#062019]">Trendy and Modern Styles</h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">Vibrant colorways and street fashion activewear designed to empower confidence.</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-3 bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/80 shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#062019] text-white flex items-center justify-center font-black shrink-0 mt-0.5 shadow-md">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[#062019]">High-Quality Non-Toxic Fabrics</h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">100% bio-washed combed cotton with zero fabric shrinkage and multi-needle flatlock stitching.</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-3 bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/80 shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#062019] text-white flex items-center justify-center font-black shrink-0 mt-0.5 shadow-md">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[#062019]">Supporting Active Play</h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">Built to withstand non-stop playground activity, sports, and daily washing.</p>
                  </div>
                </motion.div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
