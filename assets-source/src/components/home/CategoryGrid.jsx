import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const categories = [
  {
    title: 'Kids T-Shirts',
    slug: 'kids-t-shirt',
    badge: 'Kids Primary',
    color: 'bg-[#EF4A45]/15 border-[#EF4A45]/30 text-[#EF4A45]',
    image: '/images/cat_kids_tshirt.png',
    fallback: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop',
    items: '24+ Bright Tees'
  },
  {
    title: 'Kids Joggers & Tracks',
    slug: 'kids-joggers-tracks',
    badge: 'Kids Primary',
    color: 'bg-[#F7B633]/20 border-[#F7B633]/40 text-amber-800',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop',
    items: '18+ Track Sets'
  },
  {
    title: 'Kids Shorts & Bermudas',
    slug: 'kids-shorts-bermudas',
    badge: 'Kids Primary',
    color: 'bg-[#00A3E0]/15 border-[#00A3E0]/30 text-[#00A3E0]',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop',
    items: '15+ Play Shorts'
  },
  {
    title: 'Kids Night Suits',
    slug: 'kids-night-suits',
    badge: 'Kids Primary',
    color: 'bg-[#F36E21]/15 border-[#F36E21]/30 text-[#F36E21]',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop',
    items: '12+ Bedtime Suits'
  },
  {
    title: 'Kids Pajama Suits',
    slug: 'kids-pajama-suits',
    badge: 'Kids Primary',
    color: 'bg-[#3BB573]/15 border-[#3BB573]/30 text-[#3BB573]',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
    items: '16+ Cozy Sets'
  },
  {
    title: 'Girl Frocks',
    slug: 'girl-frocks',
    badge: 'Kids Primary',
    color: 'bg-[#FFD800]/25 border-[#FFD800]/50 text-amber-900',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop',
    items: '14+ Cute Frocks'
  },
  {
    title: 'Men Tracks & Joggers',
    slug: 'men-tracks-joggers',
    badge: 'Men Secondary',
    color: 'bg-slate-100 border-slate-200 text-[#2D2D2D]',
    image: '/images/cat_men_joggers.png',
    fallback: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    items: '30+ Flex Trackpants'
  },
  {
    title: 'Men Shorts & Bermuda',
    slug: 'men-shorts-bermuda',
    badge: 'Men Secondary',
    color: 'bg-slate-100 border-slate-200 text-[#2D2D2D]',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop',
    items: '20+ Gym Shorts'
  },
  {
    title: 'Men Boxers',
    slug: 'men-boxers',
    badge: 'Men Secondary',
    color: 'bg-slate-100 border-slate-200 text-[#2D2D2D]',
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800&auto=format&fit=crop',
    items: '25+ Cotton Boxers'
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A3E0]/15 text-[#00A3E0] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Explore Categories
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#2D2D2D] tracking-tight">
              Collections That <span className="text-[#EF4A45]">Spark Joy</span>
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-black text-[#EF4A45] hover:underline"
          >
            Browse Full Apparel Spectrum <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <motion.div
              key={cat.slug}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className={`group rounded-3xl p-5 border flex flex-col justify-between h-96 relative overflow-hidden transition-all shadow-xs hover:shadow-xl ${cat.color}`}
              >
                <div className="relative h-60 rounded-2xl overflow-hidden bg-white mb-4">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = cat.fallback;
                    }}
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-[#2D2D2D] uppercase">
                    {cat.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#2D2D2D]/60">{cat.items}</span>
                  <h3 className="text-2xl font-black text-[#2D2D2D] group-hover:text-[#EF4A45] transition-colors">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
