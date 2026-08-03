import React, { useState, useEffect } from 'react';
import { Sparkles, Truck, Flame, Tag } from 'lucide-react';

const announcements = [
  { text: '🚚 Free Shipping Above ₹999', link: '/products' },
  { text: '🔥 Limited-Time Offers - Extra 20% OFF with code KIDS20', link: '/products?tab=sale' },
  { text: '🎉 Summer Sunshine Collection Dropped!', link: '/products' }
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-linear-to-r from-[#FFD6BA] via-[#AEE6FF] to-[#E6D6FF] text-slate-900 text-xs font-black py-2 px-4 shadow-sm relative z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="hidden md:flex items-center gap-2 text-slate-800">
          <Truck className="w-4 h-4 text-slate-900" />
          <span>Free Express Shipping Across India</span>
        </div>

        <div className="flex items-center justify-center gap-2 mx-auto transition-all duration-500 transform">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
          <a href={announcements[currentIndex].link} className="hover:underline font-extrabold text-slate-900">
            {announcements[currentIndex].text}
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="flex items-center gap-1 bg-white/70 px-2.5 py-0.5 rounded-full text-[11px]">
            <Tag className="w-3 h-3 text-[#EF4A45]" /> CODE: <strong className="text-[#EF4A45]">KIDS20</strong>
          </span>
        </div>

      </div>
    </div>
  );
}
