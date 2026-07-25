import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, Star, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection({ onOpenSizeGuide }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#FFF8EC] via-[#FFF8EC] to-white">
      {/* Decorative Pastel Bubbles */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#AEE6FF]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#FFD6BA]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-[#E6D6FF]/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-amber-200/80 shadow-xs text-xs font-black text-slate-800"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#EF4A45] animate-ping" />
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>New Summer Sunshine Collection ’26</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight"
            >
              Discover <span className="brush-underline text-[#EF4A45]">Adorable</span> Styles for Every Little Adventure
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Ultra-soft, 100% bio-washed combed cotton activewear designed for growing kids. Vibrant non-toxic dyes, tagless comfort, and playground-proof durability.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#EF4A45] to-orange-500 text-white font-extrabold text-base shadow-xl shadow-red-500/20 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Shop New Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/collections"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border-2 border-slate-200 hover:border-slate-800 text-slate-800 font-extrabold text-base shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Categories</span>
              </Link>
            </motion.div>

            {/* Guarantees Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200/60 text-slate-600 text-xs font-bold"
            >
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Bio Cotton</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Truck className="w-4 h-4 text-[#00A3E0] shrink-0" />
                <span>Free Ship &gt; ₹999</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span>4.9★ (12k+ Reviews)</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Hero Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Frame with Pastel Accent */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative rounded-3xl overflow-hidden bg-[#AEE6FF] p-3 shadow-2xl rotate-1"
              >
                <img
                  src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop"
                  alt="Kids Fashion Hero"
                  className="w-full h-[420px] object-cover rounded-2xl"
                />

                {/* Floating Badge Card 1 */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFD6BA] flex items-center justify-center text-slate-900 font-black">
                    🐣
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Soft & Hypoallergenic</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">Zero harsh chemicals</p>
                  </div>
                </motion.div>

                {/* Floating Rating Card 2 */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-white/60 flex items-center gap-2"
                >
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-900">4.9/5</span>
                </motion.div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
