import React from 'react';

const partners = [
  { name: 'BODEN', font: 'font-serif font-black tracking-widest' },
  { name: "carter's", font: 'font-sans font-bold lowercase tracking-tight' },
  { name: 'NikeKids', font: 'font-sans font-black italic tracking-tighter' },
  { name: 'OLD NAVY', font: 'font-mono font-extrabold tracking-wider' },
  { name: 'hanna andersson', font: 'font-cursive text-xl font-bold' }
];

export default function BrandStrip() {
  return (
    <section className="py-6 sm:py-10 bg-[#F5EFE6] border-y border-[#3D1035]/10 overflow-hidden">
      <style>{`
        @keyframes brandScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-brand-scroll {
          animation: brandScroll 20s linear infinite;
        }
        .animate-brand-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="w-full relative">
        <div className="flex w-max animate-brand-scroll opacity-40 hover:opacity-100 transition-opacity duration-300">
          {[...partners, ...partners, ...partners, ...partners, ...partners, ...partners].map((p, idx) => (
            <div key={idx} className="flex items-center justify-center px-8 sm:px-12">
              <span className={`text-2xl sm:text-3xl text-[#3D1035] ${p.font} hover:scale-110 transition-transform duration-300`}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
