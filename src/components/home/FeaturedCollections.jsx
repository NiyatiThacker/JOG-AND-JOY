import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/productsData';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function FeaturedCollections() {
  return (
    <section className="py-16 bg-[#FFF8EC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="px-4 py-1.5 rounded-full bg-[#AEE6FF]/50 text-sky-900 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Handpicked Fashion
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-2">
              Featured <span className="text-[#EF4A45]">Collections</span>
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-black text-[#EF4A45] hover:underline"
          >
            <span>View All Products</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.filter(cat => cat.id !== 'mens').map((cat) => {
            let path = '/products';
            if (cat.id === 'boys') path = '/kids?gender=Boys';
            else if (cat.id === 'girls') path = '/kids?gender=Girls';
            else if (cat.id === 'newborn') path = '/kids?gender=Newborn';
            else if (cat.id === 'mens') path = '/products?category=Male';
            
            return (
            <Link
              key={cat.id}
              to={path}
              className="group relative h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Brand Favicon Watermark / Authenticity Seal */}
              <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/95 rounded-full p-1.5 border border-slate-200/40 shadow-md group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="Jog & Joy Seal"
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

              {/* Card Footer Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-black text-slate-900 inline-block mb-1 shadow-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.count}
                </span>
                <h3 className="text-2xl font-black tracking-tight">{cat.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-white/90 group-hover:text-[#AEE6FF] transition-colors">
                  Explore Wardrobe →
                </span>
              </div>
            </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
