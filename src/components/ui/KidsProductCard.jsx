import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { flyToCart } from '../../utils/animations';

export default function KidsProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <div className="flex flex-col group w-full bg-white transition-all duration-300 rounded-2xl hover:shadow-xl border border-transparent hover:border-slate-100 p-2 sm:p-4 pb-6">
      {/* Image Block */}
      <div
        className="relative aspect-square w-full bg-slate-50 rounded-xl overflow-hidden mb-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`} className="absolute inset-0">
          <img
            src={isHovered && product.gallery?.[1] ? product.gallery[1] : product.image}
            alt={product.name}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Heart Icon */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-[#EF4A45] hover:scale-110 transition-all z-10 cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#EF4A45] text-[#EF4A45]' : ''}`} />
        </button>
      </div>

      {/* Content Block */}
      <div className="flex flex-col items-center text-center space-y-2 flex-grow">
        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-black text-slate-900 tracking-tight line-clamp-1 hover:underline">
            {product.name}
          </h3>
        </Link>

        {/* Star Rating */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-[#FF8A00] text-[#FF8A00]' : 'fill-slate-200 text-slate-200'}`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="text-base font-black text-slate-900 pt-1">
          ₹{product.price.toLocaleString('en-IN')}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            flyToCart(e, product.image);
            addToCart(product, product.sizes?.[0] || 'One Size', product.colors?.[0]?.hex || '#000');
          }}
          className="w-full mt-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-xs hover:border-[#EF4A45] hover:text-[#EF4A45] hover:bg-red-50/50 transition-all active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
