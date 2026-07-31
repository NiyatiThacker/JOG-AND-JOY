import React from 'react';
import { Network, Globe, TrendingUp, ArrowRight, MapPin, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import LiquidEther from '../components/ui/LiquidEther';

export default function DistributorNetworkPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-16 pb-24 font-sans overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* TrendZone-Inspired Distributor Network Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 relative z-10">

          {/* TOP BANNER: Headline + Spinning Badge + Avatar Stack */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            
            {/* Left: Spinning Badge */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative w-24 h-24 flex items-center justify-center select-none">
                <svg className="w-full h-full animate-[spin_12s_linear_infinite] text-slate-800" viewBox="0 0 100 100">
                  <path id="distributorCirclePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                  <text className="text-[9.5px] font-black uppercase tracking-[0.2em] fill-current">
                    <textPath href="#distributorCirclePath">
                      ★ WHOLESALE NETWORK ★ 500+ PARTNERS ★
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#FF7A59] text-white flex items-center justify-center shadow-md">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
            </div>

            {/* Center Headline */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#FFF3EE] border border-[#FFE0D6] text-[#FF7A59] font-extrabold text-xs uppercase tracking-wider mb-4 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" /> Join over 500+ happy distributors
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] mb-4">
                Join Our Growing <br />
                <span className="text-[#FF7A59]">Distributor Network</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-bold leading-relaxed max-w-xl mx-auto">
                Partner with JOG & JOY to bring premium, sustainable fashion to your local market. Benefit from our exclusive wholesale pricing and dedicated support.
              </p>
            </div>

            {/* Right: Distributor Avatar Stack */}
            <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-full border border-slate-100 shadow-sm select-none">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="Retailer 1" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Retailer 2" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" alt="Retailer 3" />
                <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center ring-2 ring-white">
                  500+
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900 leading-tight">Active Retailers</div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  ✓ Verified Network <span className="text-slate-400 font-medium">India & Global</span>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC STAGGERED DISTRIBUTOR GALLERY GRID (5 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center mb-12">
            
            {/* Card 1 & 2 Column (Left Stack) */}
            <div className="space-y-4 flex flex-col justify-between h-full">
              <div className="relative aspect-4/5 w-full rounded-[28px] overflow-hidden bg-[#FF7A59] p-3 shadow-md group">
                <img 
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format&fit=crop" 
                  alt="Retail Showroom" 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"; }}
                />
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/50 text-left">
                  <span className="text-[10px] font-black text-[#FF7A59] uppercase tracking-wider block">Showroom Partner</span>
                  <span className="text-xs font-extrabold text-slate-900">Exclusive Outlets</span>
                </div>
              </div>

              <div className="relative aspect-16/10 w-full rounded-[28px] overflow-hidden bg-[#FFD5A1] p-3 shadow-sm group">
                <img 
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop" 
                  alt="High Quality Fabrics" 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format&fit=crop"; }}
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Bio-Washed Cotton
                </div>
              </div>
            </div>

            {/* Card 3 (Center Left - Tall Pastel Mint Card) */}
            <div className="relative aspect-3/4 sm:aspect-4/5 lg:h-[400px] w-full rounded-[28px] overflow-hidden bg-[#CFFFE5] p-3 shadow-md group">
              <img 
                src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=600&auto=format&fit=crop" 
                alt="Kids Fashion Stock" 
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?q=80&w=600&auto=format&fit=crop"; }}
              />
              <div className="absolute bottom-5 left-5 bg-[#CFFFE5]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-emerald-950 border border-emerald-300">
                Bulk Active Stock 📦
              </div>
            </div>

            {/* Card 4 (Center - Featured Wholesale Spotlight Card with CTA Button) */}
            <div className="relative aspect-4/5 lg:h-[400px] w-full rounded-[28px] overflow-hidden bg-[#FFF3EE] border-2 border-[#FFE0D6] p-4 shadow-xl flex flex-col justify-between text-center group">
              <div className="relative h-[270px] w-full rounded-2xl overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?q=80&w=600&auto=format&fit=crop" 
                  alt="Wholesale Partnership" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=600&auto=format&fit=crop"; }}
                />
                <div className="absolute top-3 left-3 bg-[#FF7A59] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  High Margins
                </div>
              </div>

              <Link 
                to="/contact-us"
                className="w-full py-3.5 bg-slate-900 hover:bg-[#FF7A59] text-white font-extrabold text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Become A Partner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 5 (Center Right - Tall Pastel Sky Blue Card) */}
            <div className="relative aspect-3/4 sm:aspect-4/5 lg:h-[400px] w-full rounded-[28px] overflow-hidden bg-[#AEE6FF] p-3 shadow-md group">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop" 
                alt="Retail Display Store" 
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600&auto=format&fit=crop"; }}
              />
              <div className="absolute bottom-5 left-5 bg-[#AEE6FF]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-slate-900 border border-sky-300">
                Pan-India Shipping 🚚
              </div>
            </div>

            {/* Card 6 & 7 Column (Right Stack) */}
            <div className="space-y-4 flex flex-col justify-between h-full">
              <div className="relative aspect-4/5 w-full rounded-[28px] overflow-hidden bg-[#E6D6FF] p-3 shadow-md group">
                <img 
                  src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600&auto=format&fit=crop" 
                  alt="Retail Support Team" 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop"; }}
                />
                <div className="absolute top-4 right-4 bg-purple-900/80 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Dedicated Support
                </div>
              </div>

              <div className="relative aspect-16/10 w-full rounded-[28px] overflow-hidden bg-[#FFE0D6] p-3 shadow-sm group">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0a674e2d45a0?q=80&w=600&auto=format&fit=crop" 
                  alt="Wholesale Dispatch" 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600&auto=format&fit=crop"; }}
                />
              </div>
            </div>

          </div>

          {/* BOTTOM FEATURE BAR: Partner Testimonial + Business Growth Badge */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100 text-left">
            
            {/* Left Partner Testimonial */}
            <div className="flex items-start gap-3 max-w-md">
              <span className="text-4xl leading-none text-[#FF7A59] font-serif font-black">“</span>
              <div>
                <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
                  Partnering with JOG & JOY expanded our retail sales by 140% in just 6 months. Unbeatable quality & wholesale margins!
                </p>
                <span className="text-[11px] font-extrabold text-[#FF7A59] font-serif italic mt-1 block">
                  ~ Master Distributor (Kalupur Market)
                </span>
              </div>
            </div>

            {/* Right Business Growth Badge */}
            <div className="flex items-center gap-4 bg-[#FFF8EC] px-6 py-3.5 rounded-2xl border border-[#FFE0D6]">
              <div className="text-3xl font-black text-slate-900 font-serif leading-none">01</div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#FF7A59]">Wholesale Growth</div>
                <div className="text-xs font-extrabold text-slate-900">Elevate Your Business With Premium Kids Wear</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-800 ml-2 shrink-0" />
            </div>

          </div>

        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-[#AEE6FF]/30 flex items-center justify-center text-blue-600 mb-6">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Global Reach</h3>
            <p className="text-slate-500 font-medium text-sm">Distribute our highly sought-after collections anywhere in the world with our streamlined logistics.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD6BA]/30 flex items-center justify-center text-orange-600 mb-6">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">High Margins</h3>
            <p className="text-slate-500 font-medium text-sm">Enjoy competitive wholesale pricing tiers designed to maximize your retail profit margins.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-[#CFFFE5]/30 flex items-center justify-center text-green-600 mb-6">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Exclusive Territories</h3>
            <p className="text-slate-500 font-medium text-sm">Secure exclusive distribution rights in your region and grow without direct brand competition.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
