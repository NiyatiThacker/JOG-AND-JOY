import React from 'react';

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Coral Banner Card Container (#EF4A45) */}
        <div className="rounded-[40px] bg-[#EF4A45] p-8 sm:p-12 text-white overflow-hidden relative shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Photo Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-[#F7B633] p-3 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=1000&auto=format&fit=crop"
                  alt="Mother and Child wearing stylish sunglasses"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop';
                  }}
                />
              </div>
            </div>

            {/* Right Features Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Why Choose <span className="font-cursive text-[#FFD800] text-4xl sm:text-6xl">JOG&JOY®</span>
              </h2>

              <div className="space-y-4 text-sm sm:text-base font-bold">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white text-[#EF4A45] flex items-center justify-center font-black shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">Inclusive & Ergonomic Sizing</h4>
                    <p className="text-xs sm:text-sm text-white/80 font-medium">Standardized fit calibrated for growing active kids and men.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white text-[#EF4A45] flex items-center justify-center font-black shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">Trendy and Modern Styles</h4>
                    <p className="text-xs sm:text-sm text-white/80 font-medium">Vibrant colorways and street fashion activewear designed to empower confidence.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white text-[#EF4A45] flex items-center justify-center font-black shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">High-Quality Non-Toxic Fabrics</h4>
                    <p className="text-xs sm:text-sm text-white/80 font-medium">100% bio-washed combed cotton with zero fabric shrinkage and multi-needle flatlock stitching.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white text-[#EF4A45] flex items-center justify-center font-black shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">Supporting Active Play</h4>
                    <p className="text-xs sm:text-sm text-white/80 font-medium">Built to withstand non-stop playground activity, sports, and daily washing.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
