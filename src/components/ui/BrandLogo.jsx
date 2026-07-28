import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BrandLogo({ className = 'h-9 md:h-11', linkTo = '/' }) {
  return (
    <Link 
      to={linkTo} 
      className="relative inline-flex items-center justify-center group select-none py-1 px-2"
    >
      {/* Subtle Brand Theme Soft Glow Ring on Hover */}
      <div className="absolute -inset-2 bg-[#EF4A45]/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Main Logo Image with Structured, Subtle Floating & Hover Spring */}
      <motion.img
        src="/images/official_logo.png"
        alt="JOG&JOY® - Love is in the wear"
        className={`${className} w-auto object-contain relative z-10 filter drop-shadow-xs transition-all duration-300`}
        animate={{ 
          y: [0, -3, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3.5, 
          ease: "easeInOut" 
        }}
        whileHover={{ 
          scale: 1.08, 
          y: -2,
          transition: { type: "spring", stiffness: 400, damping: 15 }
        }}
        whileTap={{ scale: 0.95 }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />

      {/* Fallback Text if Image fails */}
      <div className="hidden font-black text-xl text-[#2D2D2D]">
        JOG<span className="text-[#00A3E0]">&</span>JOY<sup className="text-xs text-[#EF4A45]">®</sup>
      </div>
    </Link>
  );
}
