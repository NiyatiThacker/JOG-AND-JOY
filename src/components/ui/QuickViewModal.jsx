import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck } from 'lucide-react';
import SizeSelector from './SizeSelector';
import ColorSwatches from './ColorSwatches';
import Button from './Button';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState('4Y-5Y');
  const [selectedColor, setSelectedColor] = useState('#A7D8FF');

  if (!product) return null;

  const isFavorited = isInWishlist(product.id, selectedSize, selectedColor);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100/80 backdrop-blur-md hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row w-full h-full p-4 sm:p-6 md:p-8 gap-5 md:gap-8 mt-6 sm:mt-0">
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex gap-3 sm:gap-4 shrink-0">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2 sm:gap-3 w-12 sm:w-16 shrink-0 hidden sm:flex">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-full aspect-square bg-[#F5F5F5] rounded-xl sm:rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${i === 1 ? 'border-slate-300' : 'border-transparent hover:border-slate-200'}`}>
                    <img src={product.image} alt="thumb" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                  </div>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="flex-1 bg-[#F5F5F5] rounded-[2rem] overflow-hidden relative min-h-[300px] h-[40vh] md:h-auto border border-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-multiply"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = product.fallback || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop';
                  }}
                />
                <button
                  onClick={() => toggleWishlist(product.id, selectedSize, selectedColor)}
                  className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm z-10 ${
                    isFavorited ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="w-full md:w-1/2 space-y-4 sm:space-y-5 flex flex-col justify-start">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#D8C7FF]/40 text-purple-800 text-[11px] font-extrabold uppercase tracking-wider">
                  {product.category}
                </span>

                <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-2">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-1 text-sm">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-extrabold text-slate-700">{product.rating} (48 reviews)</span>
                </div>
              </div>

              <div className="text-3xl font-black text-slate-900">{product.price}</div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.desc || 'Crafted with premium bio-washed combed cotton, multi-needle flatlock stitching, and non-toxic dyes for active kids.'}
              </p>

              {/* Interactive Selectors */}
              <SizeSelector selectedSize={selectedSize} onSelectSize={setSelectedSize} />
              <ColorSwatches selectedColor={selectedColor} onSelectColor={setSelectedColor} />

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button variant="sky" size="lg" icon={ShoppingBag} onClick={handleAddToCart} className="w-full">
                  Add To Bag
                </Button>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Non-Toxic Cotton
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-sky-600" /> Fast Wholesale Delivery
                </span>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
