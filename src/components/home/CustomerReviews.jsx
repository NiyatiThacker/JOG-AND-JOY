import React from 'react';

import { Star, CheckCircle2, Quote, Sparkles } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';

const REVIEWS = [
  { id: 1, name: "Priya S.", rating: 5, date: "2 days ago", comment: "The material is so soft, my son refuses to take off his dinosaur tee!", product: "Dino Print T-Shirt", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
  { id: 2, name: "Rahul M.", rating: 5, date: "1 week ago", comment: "Finally found joggers that survive playground slides. Excellent quality.", product: "Active Joggers", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" },
  { id: 3, name: "Sneha R.", rating: 4, date: "3 weeks ago", comment: "Vibrant colors that don't fade after washing. Very impressed.", product: "Floral Summer Frock", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" },
  { id: 4, name: "Vikram K.", rating: 5, date: "1 month ago", comment: "The night suit is incredibly comfortable. Will buy more soon.", product: "Starry Night Suit", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" }
];

export default function CustomerReviews() {
  return (
    <section className="py-16 bg-[#FFF8EC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="px-4 py-1.5 rounded-full bg-[#CFFFE5]/50 text-emerald-900 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Verified Parent Reviews
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Loved By <span className="text-[#EF4A45]">10,000+ Happy Parents</span>
          </h2>
        </div>

        {/* Testimonials Marquee */}
        <style>{`
          @keyframes scrollReviews {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); } /* 12px is half the gap */
          }
          .animate-scroll-reviews {
            animation: scrollReviews 30s linear infinite;
          }
          .animate-scroll-reviews:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="flex overflow-hidden relative w-full pb-8">
          <div className="flex gap-6 animate-scroll-reviews w-max">
            {[...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS].map((review, index) => {
              const spotlightColors = [
                'rgba(174, 230, 255, 0.4)', // Soft Blue
                'rgba(239, 74, 69, 0.25)',  // Soft Red
                'rgba(255, 216, 0, 0.35)'   // Soft Yellow
              ];
              return (
                <SpotlightCard
                  key={index}
                  className="kids-card p-6 border border-slate-100 flex flex-col justify-between space-y-4 bg-white w-87.5 shrink-0 transform hover:-translate-y-2 hover:shadow-2xl hover:border-slate-200 transition-all duration-300"
                  spotlightColor={spotlightColors[index % spotlightColors.length]}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-400">{review.date}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold italic whitespace-normal">
                      "{review.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#AEE6FF]"
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                        {review.name} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                      </h4>
                      <p className="text-[10px] text-slate-500 font-extrabold whitespace-normal">Verified Buyer • {review.product}</p>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
