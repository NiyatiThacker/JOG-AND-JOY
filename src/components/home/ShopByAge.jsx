import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowRight, Sparkles } from 'lucide-react';

const AGE_GROUPS = [
  { label: '0–2 Years', sub: 'Infants & Toddlers', badge: 'Soft & Safe', color: '#E8F5E9' },
  { label: '3–5 Years', sub: 'Preschoolers', badge: 'Play Ready', color: '#E3F2FD' },
  { label: '6–8 Years', sub: 'Kids', badge: 'Active Wear', color: '#FFF3E0' },
  { label: '9–12 Years', sub: 'Pre-teens', badge: 'Trendy', color: '#F3E5F5' }
];

export default function ShopByAge() {
  return (
    <section className="py-6 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="px-4 py-1.5 rounded-full bg-[#E6D6FF]/40 text-purple-800 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Perfect Fit Guarantee
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Shop By <span className="text-[#EF4A45]">Age Group</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Find clothing tailored specifically to your child's age, growth stage, and play habits.
          </p>
        </div>

        {/* Age Group Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGE_GROUPS.map((item, index) => (
            <Link
              key={index}
              to={`/products?age=${encodeURIComponent(item.label)}`}
              className="group relative p-6 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-slate-100 flex flex-col justify-between overflow-hidden"
              style={{ backgroundColor: item.color }} // 100% opacity background
            >
              {/* Card Badge */}
              <div className="flex justify-between items-start mb-6">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-black text-slate-800 bg-white shadow-xs"
                >
                  {item.badge}
                </span>
                <div className="w-9 h-9 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-sm group-hover:bg-[#EF4A45] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#EF4A45] transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-600 font-bold">{item.sub}</p>
              </div>

              {/* Bottom Decorative Circle */}
              <div
                className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-300"
                style={{ backgroundColor: '#ffffff' }}
              />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
