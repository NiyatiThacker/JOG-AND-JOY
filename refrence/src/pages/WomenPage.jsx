import React, { useMemo, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import WomenProductCard from '../components/ui/WomenProductCard';
import { PRODUCTS } from '../data/productsData';

export default function WomenPage() {
  const [activeCategory, setActiveCategory] = useState("Woman Collection");
  const spotlightRef = useRef(null);

  const womenProducts = useMemo(() => {
    const allWomens = PRODUCTS.filter((p) => p.category === "Women's Collection"); 
    if (activeCategory === "Woman Collection") return allWomens;

    return allWomens.filter(p => {
      const name = p.name.toLowerCase();
      if (activeCategory === 'Accessories') {
        return name.includes('bag') || name.includes('earrings') || name.includes('scarf');
      }
      if (activeCategory === 'Dresses & Skirts') {
        return name.includes('dress') || name.includes('skirt');
      }
      if (activeCategory === 'Outerwear') {
        return name.includes('coat') || name.includes('jacket') || name.includes('cardigan') || name.includes('blazer');
      }
      return false;
    });
  }, [activeCategory]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const totalPages = Math.ceil(womenProducts.length / productsPerPage) || 1;
  const currentProducts = womenProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

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

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    setCurrentPage(1);
    setTimeout(() => {
      if (spotlightRef.current) {
        const y = spotlightRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-4">
        
        {/* Minimalist Editorial Hero */}
        <div className="w-full flex flex-col md:flex-row items-stretch mb-20 min-h-[80vh]">
          
          {/* Left Content Area */}
          <div className="w-full md:w-5/12 flex flex-col justify-center relative py-12 md:py-0 z-10">
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-black leading-[1.05] tracking-tight mb-4">
              WOMEN FASHION<br />COLLECTION
            </h1>
            <h2 className="text-3xl md:text-4xl text-gray-500 font-light mb-8">
              30% OFF 2026
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm mb-10">
              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum.
            </p>
            <div>
              <button 
                onClick={() => handleCategoryClick("Woman Collection")}
                className="bg-black hover:bg-gray-800 text-white font-semibold text-sm px-10 py-3.5 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="w-full md:w-7/12 relative h-[50vh] md:h-auto overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1200&auto=format&fit=crop" 
              alt="Women's Summer Collection" 
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            {/* Slider Indicator (Right edge) */}
            <div className="hidden lg:flex flex-col items-end gap-2 absolute top-1/2 right-0 -translate-y-1/2 pr-8">
              <span className="text-[10px] text-black font-semibold mb-2">01/04</span>
              <div className="w-8 h-[2px] bg-black"></div>
              <div className="w-6 h-[1px] bg-gray-400"></div>
              <div className="w-6 h-[1px] bg-gray-400"></div>
              <div className="w-6 h-[1px] bg-gray-400"></div>
            </div>
          </div>

        </div>

        {/* Bento Category Grid ("Actual") */}
        <div className="mb-24">
          <h3 className="text-xl text-slate-400 font-light mb-8">Women's Fashion Categories</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[200px]">
            
            {/* Block 1: Woman Collection */}
            <div 
              onClick={() => handleCategoryClick("Woman Collection")}
              className="md:col-span-5 row-span-2 relative group overflow-hidden rounded-3xl bg-slate-100 cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" alt="Woman" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-start">
                <h4 className="text-white text-xl font-bold flex items-center gap-2">
                  Woman Collection <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </h4>
              </div>
            </div>

            {/* Block 2: Accessories */}
            <div 
              onClick={() => handleCategoryClick("Accessories")}
              className="md:col-span-4 row-span-1 relative group overflow-hidden rounded-3xl bg-slate-100 cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop" alt="Accessories" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <h4 className="text-white text-lg font-bold flex items-center gap-2">
                  Accessories Collection <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </h4>
              </div>
            </div>

            {/* Block 3: Dresses & Skirts */}
            <div 
              onClick={() => handleCategoryClick("Dresses & Skirts")}
              className="md:col-span-4 row-span-1 relative group overflow-hidden rounded-3xl bg-slate-100 cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" alt="Dresses" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <h4 className="text-white text-lg font-bold flex items-center gap-2">
                  Dresses & Skirts <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </h4>
              </div>
            </div>

            {/* Block 4: Outerwear */}
            <div 
              onClick={() => handleCategoryClick("Outerwear")}
              className="md:col-span-3 row-span-2 relative group overflow-hidden rounded-3xl bg-slate-100 cursor-pointer hidden md:block"
            >
              <img src="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop" alt="Outerwear" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <h4 className="text-white text-lg font-bold flex items-center gap-2">
                  Outerwear <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </h4>
              </div>
            </div>

          </div>
        </div>

        {/* Product Section Header */}
        <div ref={spotlightRef} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-4 border-b border-slate-100">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 sm:mb-0">
            {activeCategory === "Woman Collection" ? "In the spotlight" : activeCategory}
          </h2>
          <div className="text-slate-700 font-bold text-sm">
            Showing {womenProducts.length} Products
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {currentProducts.map((product) => (
            <WomenProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pb-12">
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
                    ? 'bg-[#147B74] text-white shadow-md'
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
    </div>
  );
}
