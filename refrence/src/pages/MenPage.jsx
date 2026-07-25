import React, { useMemo, useState, useRef } from 'react';
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import MenProductCard from '../components/ui/MenProductCard';
import { PRODUCTS } from '../data/productsData';

export default function MenPage() {
  const [activeCategory, setActiveCategory] = useState("Men's Collection");

  const menProducts = useMemo(() => {
    const allMens = PRODUCTS.filter((p) => p.category === "Men's Collection"); 
    if (activeCategory === "Men's Collection") return allMens;

    return allMens.filter(p => {
      const name = p.name.toLowerCase();
      if (activeCategory === 'Streetwear') {
        return name.includes('hoodie') || name.includes('sweatshirt') || name.includes('sneaker') || name.includes('cargo') || name.includes('shorts') || name.includes('sunglasses');
      }
      if (activeCategory === 'Suits & Blazers') {
        return name.includes('suit') || name.includes('blazer') || name.includes('oxford') || name.includes('chinos') || name.includes('polo');
      }
      if (activeCategory === 'Outerwear') {
        return name.includes('jacket') || name.includes('overcoat') || name.includes('flannel') || name.includes('sweater') || name.includes('overshirt') || name.includes('vest');
      }
      return false;
    });
  }, [activeCategory]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const spotlightRef = useRef(null);

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

  const totalPages = Math.ceil(menProducts.length / productsPerPage) || 1;
  const currentProducts = menProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => {
      if (spotlightRef.current) {
        const y = spotlightRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const getPageNumbers = () => {
    let pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      if (start === 1) end = maxVisible;
      if (end === totalPages) start = totalPages - maxVisible + 1;
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const scrollToSpotlight = () => {
    if (spotlightRef.current) {
      const y = spotlightRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 font-sans">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-8 pt-8">
        
        {/* Vibrant Peach Hero Section */}
        <div className="w-full bg-[#FFD8C9] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row items-center justify-between mb-8 shadow-sm min-h-[350px]">
          <div className="p-8 md:p-12 lg:p-16 max-w-2xl text-left z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
              Soft on Skin.<br />Strong on Style.
            </h1>
            <p className="text-slate-800 font-medium text-sm md:text-base opacity-80 leading-relaxed max-w-md mb-8">
              Discover modern menswear crafted for confidence, movement, and real-life adventure. Uncompromised quality for everyday wear.
            </p>
            <button 
              onClick={scrollToSpotlight}
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-colors shadow-md"
            >
              Shop now
            </button>
          </div>
          
          {/* Hero Image */}
          <div className="hidden md:block w-full max-w-lg relative h-full min-h-[350px]">
            <img 
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop" 
              alt="Men's Collection Hero" 
              className="absolute inset-0 w-full h-full object-cover rounded-l-[4rem] mix-blend-multiply opacity-90"
              style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
            />
          </div>
        </div>

        {/* Free Shipping Marquee */}
        <div className="w-full overflow-hidden border-b border-slate-100 pb-8 mb-16 relative flex items-center">
          <div className="flex space-x-12 animate-marquee whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-[#EF4A45] fill-[#EF4A45]" />
                <span className="text-slate-800 font-extrabold text-xs uppercase tracking-widest">
                  Free shipping on all orders over ₹999
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Category Grid ("Actual") - Modeled after Women's Page */}
        <div className="mb-24">
          <h3 className="text-xl text-slate-400 font-light mb-8">Men's Fashion Categories</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[200px]">
            
            {/* Block 1: Men Collection */}
            <div 
              onClick={() => handleCategoryClick("Men's Collection")}
              className="md:col-span-5 row-span-2 relative group overflow-hidden rounded-3xl bg-slate-100 cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=800&auto=format&fit=crop" alt="Men's Collection" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-start">
                <h4 className="text-white text-xl font-bold flex items-center gap-2">
                  Men's Collection <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </h4>
              </div>
            </div>

            {/* Block 2: Streetwear */}
            <div 
              onClick={() => handleCategoryClick("Streetwear")}
              className="md:col-span-4 row-span-1 relative group overflow-hidden rounded-3xl bg-slate-100 cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop" alt="Streetwear" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <h4 className="text-white text-lg font-bold flex items-center gap-2">
                  Streetwear <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </h4>
              </div>
            </div>

            {/* Block 3: Suits & Blazers */}
            <div 
              onClick={() => handleCategoryClick("Suits & Blazers")}
              className="md:col-span-4 row-span-1 relative group overflow-hidden rounded-3xl bg-slate-100 cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop" alt="Suits" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <h4 className="text-white text-lg font-bold flex items-center gap-2">
                  Suits & Blazers <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </h4>
              </div>
            </div>

            {/* Block 4: Outerwear */}
            <div 
              onClick={() => handleCategoryClick("Outerwear")}
              className="md:col-span-3 row-span-2 relative group overflow-hidden rounded-3xl bg-slate-100 cursor-pointer hidden md:block"
            >
              <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop" alt="Outerwear" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
            {activeCategory === "Men's Collection" ? "In the spotlight" : activeCategory}
          </h2>
          <div className="text-slate-700 font-bold text-sm">
            Showing {menProducts.length} Products
          </div>
        </div>

        {/* Product Grid (4x4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {currentProducts.map((product) => (
            <MenProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-16 pb-8">
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none text-slate-600 transition-all border border-slate-100"
            >
              <ChevronLeft className="w-5 h-5 pointer-events-none" />
            </button>
            
            <div className="flex items-center gap-2">
              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all flex items-center justify-center border border-slate-100 ${
                    currentPage === pageNum 
                      ? 'bg-emerald-800 text-white shadow-md' 
                      : 'bg-white text-slate-600 hover:shadow-md shadow-sm'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none text-slate-600 transition-all border border-slate-100"
            >
              <ChevronRight className="w-5 h-5 pointer-events-none" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
