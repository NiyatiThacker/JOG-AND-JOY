import React from 'react';
import { Network, Globe, TrendingUp, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DistributorNetworkPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-16 pb-24 font-sans overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-12 relative">
          
          {/* Decorative left annotation */}
          <div className="hidden lg:flex absolute -left-10 top-24 text-slate-800 -rotate-12 flex-col items-end">
            <span className="font-serif italic text-xl">Grow your</span>
            <span className="font-serif italic text-xl">business</span>
          </div>

          {/* Decorative right annotation */}
          <div className="hidden lg:flex absolute -right-4 top-16 text-slate-800 rotate-12 flex-col items-center">
            <span className="font-serif italic text-xl mb-1">Elevate</span>
            <span className="font-serif italic text-xl">your brand</span>
            <svg className="w-12 h-12 mt-2 opacity-70 rotate-140 -ml-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 5l7 7-7 7"/><path d="M17 12H3"/>
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#FFE7C8] text-[#D88941] font-bold text-sm mb-8 shadow-sm">
             Join over 500+ happy distributors
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-black tracking-tight leading-[1.05] mb-8">
            Join Our Growing <br /> Distributor Network
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Partner with Joy Krima to bring premium, sustainable fashion to your local market. Benefit from our exclusive wholesale pricing and dedicated support.
          </p>
        </div>

        {/* Curved Image Gallery */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-5 mb-12 px-2">
          {[
            { img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop", tw: "rotate-[-7deg] h-32 sm:h-48 md:h-64 lg:h-72 w-16 sm:w-24 md:w-32 lg:w-48 rounded-l-3xl rounded-r-lg lg:rounded-l-[3rem] lg:rounded-r-2xl" },
            { img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop", tw: "-rotate-3 h-40 sm:h-56 md:h-72 lg:h-80 w-16 sm:w-24 md:w-32 lg:w-48 rounded-lg lg:rounded-2xl" },
            { img: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=800&auto=format&fit=crop", tw: "rotate-0 h-48 sm:h-64 md:h-80 lg:h-96 w-16 sm:w-24 md:w-32 lg:w-48 rounded-lg lg:rounded-2xl" },
            { img: "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?q=80&w=800&auto=format&fit=crop", tw: "rotate-0 h-48 sm:h-64 md:h-80 lg:h-96 w-16 sm:w-24 md:w-32 lg:w-48 rounded-lg lg:rounded-2xl" },
            { img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop", tw: "rotate-3 h-40 sm:h-56 md:h-72 lg:h-80 w-16 sm:w-24 md:w-32 lg:w-48 rounded-lg lg:rounded-2xl" },
            { img: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=800&auto=format&fit=crop", tw: "rotate-[7deg] h-32 sm:h-48 md:h-64 lg:h-72 w-16 sm:w-24 md:w-32 lg:w-48 rounded-r-3xl rounded-l-lg lg:rounded-r-[3rem] lg:rounded-l-2xl" },
          ].map((item, i) => (
            <div key={i} className={`shrink-0 overflow-hidden shadow-md transition-transform duration-500 hover:scale-105 ${item.tw}`}>
              <img src={item.img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* CTA Button below gallery */}
        <div className="flex flex-col items-center justify-center mb-28 relative">
           <div className="absolute left-[35%] md:left-[42%] lg:left-[44%] -bottom-10 text-slate-800 -rotate-12 flex items-center gap-2">
            <span className="font-serif italic text-xl">It's free</span>
            <svg className="w-8 h-8 opacity-70 -rotate-90 -mt-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 5l7 7-7 7"/><path d="M17 12H3"/>
            </svg>
          </div>
          
          <Link 
            to="/contact-us"
            className="inline-flex items-center justify-center px-12 py-4 rounded-full bg-[#FF7E70] text-white font-bold text-lg shadow-lg shadow-[#FF7E70]/30 hover:shadow-xl hover:bg-[#ff6c5c] hover:-translate-y-1 transition-all"
          >
            Get Started
          </Link>
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
