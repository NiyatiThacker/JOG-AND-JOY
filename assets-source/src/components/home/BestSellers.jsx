import React from 'react';
import ProductCard from '../ui/ProductCard';
import { PRODUCTS } from '../../data/productsData';
import { Sparkles, Flame } from 'lucide-react';

export default function BestSellers({ onQuickView }) {
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="px-4 py-1.5 rounded-full bg-[#FFD6BA]/50 text-orange-900 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#EF4A45]" /> Most Loved By Parents
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Best <span className="text-[#EF4A45]">Sellers</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Top-rated kids clothing favorites backed by thousands of happy customer reviews.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>

      </div>
    </section>
  );
}
