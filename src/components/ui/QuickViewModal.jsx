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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            {/* Image Container */}
            <div className="relative h-80 sm:h-full min-h-75 rounded-2xl overflow-hidden bg-[#FFF8F0]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = product.fallback || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <button
                onClick={() => toggleWishlist(product.id, selectedSize, selectedColor)}
                className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
                  isFavorited ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Product Meta */}
            <div className="space-y-5">
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
