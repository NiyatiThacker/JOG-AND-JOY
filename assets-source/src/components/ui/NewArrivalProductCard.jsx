import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function NewArrivalProductCard({ product }) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0]?.hex || '#000', e);
  };

  return (
    <div className="flex flex-col group cursor-pointer w-full font-sans">
      {/* Image Block */}
      <div className="relative aspect-4/5 w-full bg-[#f4f4f4] rounded-2xl overflow-hidden mb-4 border border-slate-100">
        <Link to={`/product/${product.id}`} className="absolute inset-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Mint Green 'NEW' Badge (Kids Theme Influence) */}
        <div className="absolute top-3 left-3 bg-[#A7DEB9] text-[#1C2C28] text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider z-10 flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3" /> NEW
        </div>

        {/* Neon Yellow Quick Add Button (Men's Theme Influence) */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 left-3 right-3 bg-[#E5F778] hover:bg-[#D4E85C] text-[#1C2C28] font-bold text-xs py-3 rounded-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 shadow-sm"
        >
          Quick Add
        </button>
      </div>

      {/* Details (Women's Theme Influence: Minimalist) */}
      <div className="px-1 text-left space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {product.category}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 hover:underline">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-black text-slate-900">₹{product.price}</span>
        </div>
      </div>
    </div>
  );
}
