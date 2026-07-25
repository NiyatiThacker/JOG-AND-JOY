import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo({ className = 'h-10', showTagline = true }) {
  return (
    <Link to="/" className="flex flex-col items-start group">
      <img
        src="/images/official_logo.png"
        alt="JOG&JOY® - Love is in the wear"
        className={`${className} w-auto object-contain transition-transform group-hover:scale-105`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="hidden font-black text-xl text-[#2D2D2D]">
        JOG<span className="text-[#00A3E0]">&</span>JOY<sup className="text-xs text-[#EF4A45]">®</sup>
        {showTagline && <span className="block text-[10px] text-[#9DA3A8] font-bold">Love is in the wear</span>}
      </div>
    </Link>
  );
}
