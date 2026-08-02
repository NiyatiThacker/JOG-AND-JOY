import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '4Y-5Y');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.hex || '#AEE6FF');

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="kids-card group relative flex flex-col justify-between overflow-hidden border border-slate-100/80 bg-white">
      
      {/* Product Image Container */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#FFF8EC] rounded-t-2xl">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount && (
            <span className="px-2.5 py-1 rounded-full bg-[#EF4A45] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              {product.discount}
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-1 rounded-full bg-[#AEE6FF] text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
            isFavorited ? 'bg-[#EF4A45] text-white scale-110' : 'bg-white/80 text-slate-700 hover:bg-white hover:scale-105'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
        </button>

        {/* Hover Action Overlay (Quick View) */}
        <div className="absolute inset-x-0 bottom-3 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="w-full py-2.5 bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 font-extrabold text-xs rounded-full shadow-lg flex items-center justify-center gap-1.5 transition-all hover:scale-102"
          >
            <Eye className="w-4 h-4 text-[#EF4A45]" /> Quick View
          </button>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-5 grow flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-extrabold text-purple-700 uppercase tracking-wider text-[10px] bg-[#E6D6FF]/40 px-2 py-0.5 rounded-full">
              {product.category}
            </span>

            <div className="flex items-center gap-1 text-amber-500 font-black">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-[#EF4A45] transition-colors mt-1">
              {product.name}
            </h3>
          </Link>

          {/* Price & Savings */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-black text-slate-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs font-bold text-slate-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Available Colors & Sizes Preview */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          
          {/* Color Swatches */}
          <div className="flex items-center gap-1">
            {product.colors?.slice(0, 3).map((col, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(col.hex)}
                className={`w-4 h-4 rounded-full border border-white shadow-xs transition-transform ${
                  selectedColor === col.hex ? 'scale-125 ring-2 ring-[#EF4A45]' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>

          {/* Quick Size Chips */}
          <div className="flex items-center gap-1">
            {product.sizes?.slice(0, 2).map((sz, idx) => (
              <span key={idx} className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                {sz}
              </span>
            ))}
          </div>
        </div>

        {/* Add to Bag Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product, selectedSize, selectedColor, e);
          }}
          className="w-full py-2.5 rounded-full bg-slate-900 hover:bg-[#EF4A45] text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add To Bag</span>
        </button>

      </div>

    </div>
  );
}
