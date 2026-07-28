import React, { useMemo, useState, useRef } from 'react';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import NewArrivalProductCard from '../components/ui/NewArrivalProductCard';
import QuickViewModal from '../components/ui/QuickViewModal';
import { useCombinedProducts } from '../queries/useCombinedProducts';
import { Link } from 'react-router-dom';

export default function NewArrivalsPage() {
  const spotlightRef = useRef(null);
  
  const { combinedProducts, isLoading } = useCombinedProducts();
  
  const newProducts = useMemo(() => {
    return combinedProducts.filter((p) => p.isNew);
  }, [combinedProducts]);

  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const productsPerPage = 16;
  const totalPages = Math.ceil(newProducts.length / productsPerPage) || 1;
  const currentProducts = newProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setTimeout(() => {
        if (spotlightRef.current) {
          const y = spotlightRef.current.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 font-sans">
      
      {/* Inline styles for marquee animation */}
      <style>{`
        @keyframes marquee-fast {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-fast {
          animation: marquee-fast 12s linear infinite;
        }
      `}</style>

      {/* The Remix Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="w-full flex flex-col md:flex-row items-stretch mb-16 min-h-[500px]">
          
          {/* Left: Women's Editorial Vibe + Men's Neon Accent */}
          <div className="w-full md:w-1/2 flex flex-col justify-center pr-8 py-12 md:py-0 relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C2C28] text-[#E5F778] text-xs font-bold tracking-widest uppercase shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" /> Just Dropped
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-black text-black leading-[0.95] tracking-tight mb-6">
              FRESH <br />DROPS.
            </h1>
            
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm mb-10">
              Discover the latest styles across Kids, Men's, and Women's collections. Crafted for modern living.
            </p>
            
            <div>
              {/* Men's Neon Button on Editorial Background */}
              <button 
                onClick={() => {
                  if (spotlightRef.current) {
                    const y = spotlightRef.current.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="bg-[#E5F778] hover:bg-[#D4E85C] text-[#1C2C28] font-extrabold text-sm px-10 py-4 rounded-xl shadow-md transition-all hover:scale-105"
              >
                Shop The Drop
              </button>
            </div>
          </div>

          {/* Right: Kids Mint Green Playful Vibe */}
          <div className="w-full md:w-1/2 relative min-h-[400px]">
            <div className="absolute inset-0 bg-[#A7DEB9] rounded-[3rem] overflow-hidden shadow-sm flex items-center justify-center p-8">
              <img 
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop" 
                alt="New Arrivals" 
                className="w-full h-full object-cover rounded-2xl mix-blend-multiply opacity-90 scale-105"
              />
            </div>
            {/* Floating decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#1C2C28] rounded-full flex items-center justify-center shadow-xl animate-bounce-slow">
              <span className="text-[#E5F778] font-black text-xl text-center leading-tight">NEW<br/>IN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monochrome/Mint Marquee */}
      <div className="w-full overflow-hidden border-y border-slate-100 py-4 mb-20 bg-slate-50">
        <div className="flex space-x-12 animate-marquee-fast whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Sparkles className="w-4 h-4 text-[#A7DEB9]" />
              <span className="text-black font-black text-sm uppercase tracking-[0.2em]">
                Explore The Latest Trends
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hybrid Bento Grid */}
        <div className="mb-24">
          <h2 className="text-2xl font-black text-black tracking-tight mb-8">
            Shop By Department
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[400px]">
            
            {/* Block 1: Kids (Vibrant Sky) */}
            <Link to="/kids" className="md:col-span-5 relative group overflow-hidden rounded-[2rem] bg-slate-100 cursor-pointer block h-full">
              <img src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop" alt="Kids" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-sky-500/70 group-hover:bg-sky-400/50 mix-blend-multiply transition-colors"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h4 className="text-white text-3xl font-black flex items-center gap-2">
                  Kids <ArrowRight className="w-8 h-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </h4>
              </div>
            </Link>

            <div className="md:col-span-7 grid grid-rows-2 gap-6 h-full">
              {/* Block 2: Men (Vibrant Indigo) */}
              <Link to="/men" className="relative group overflow-hidden rounded-[2rem] bg-slate-100 cursor-pointer block h-full">
                <img src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop" alt="Men" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-indigo-600/70 group-hover:bg-indigo-500/50 mix-blend-multiply transition-colors"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h4 className="text-white text-3xl font-black flex items-center gap-2">
                    Men's <ArrowRight className="w-8 h-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                  </h4>
                </div>
              </Link>

              {/* Block 3: Women (Vibrant Rose) */}
              <Link to="/women" className="relative group overflow-hidden rounded-[2rem] bg-slate-100 cursor-pointer block h-full">
                <img src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop" alt="Women" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-rose-500/70 group-hover:bg-rose-400/50 mix-blend-multiply transition-colors"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h4 className="text-white text-3xl font-black flex items-center gap-2">
                    Women's <ArrowRight className="w-8 h-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                  </h4>
                </div>
              </Link>
            </div>

          </div>
        </div>

        {/* Product Grid Header */}
        <div ref={spotlightRef} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-black tracking-tight mb-4 sm:mb-0">
            The Latest Drops
          </h2>
          <div className="text-slate-500 font-bold text-sm">
            Showing {newProducts.length} Products
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400 font-bold">Loading newest drops...</div>
        ) : newProducts.length > 0 ? (
          <div className="mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {currentProducts.map((product) => (
                <NewArrivalProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16 pb-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                    currentPage === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-200'
                  }`}
                >
                  &lt;
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all shadow-sm ${
                      currentPage === num
                        ? 'bg-[#1C2C28] text-[#E5F778] shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                    currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-200'
                  }`}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-bold text-slate-800">Check back soon for new arrivals!</h3>
          </div>
        )}

      </div>
      
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
