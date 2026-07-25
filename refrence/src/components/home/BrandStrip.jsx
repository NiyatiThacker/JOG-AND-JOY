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
    <section className="py-10 bg-[#F5EFE6] border-y border-[#3D1035]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-around gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
          {partners.map((p, idx) => (
            <span key={idx} className={`text-xl sm:text-2xl text-[#3D1035] ${p.font}`}>
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
