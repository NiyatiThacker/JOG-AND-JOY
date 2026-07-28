import React, { useState, useMemo, useRef } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import KidsProductCard from '../components/ui/KidsProductCard';
import QuickViewModal from '../components/ui/QuickViewModal';
import { useCombinedProducts } from '../queries/useCombinedProducts';
import ShopByAge from '../components/home/ShopByAge';

export default function KidsPage() {
  const [expandedSections, setExpandedSections] = useState({
    productType: true,
    price: true,
    gender: true,
    size: true,
    color: true,
    fabric: true,
    pattern: true
  });

  const [filters, setFilters] = useState({
    types: [],
    prices: [],
    genders: [],
    sizes: [],
    colors: [],
    fabrics: [],
    patterns: []
  });

  const [sortBy, setSortBy] = useState('Recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const productsPerPage = 12;
  const topControlsRef = useRef(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => {
      if (topControlsRef.current) {
        const y = topControlsRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const updated = prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updated };
    });
    setCurrentPage(1); // Reset page on filter change
  };

  const { combinedProducts, isLoading } = useCombinedProducts();

  const kidsProducts = useMemo(() => {
    return combinedProducts.filter((p) => ['Boys', 'Girls', 'Newborn', 'Unisex'].includes(p.category));
  }, [combinedProducts]);

  const filteredProducts = useMemo(() => {
    let result = kidsProducts.filter((p) => {
      const nameLower = p.name.toLowerCase();

      // Type Filter
      let matchType = filters.types.length === 0;
      if (!matchType) {
        if (filters.types.includes('T-Shirts') && (nameLower.includes('tee') || nameLower.includes('t-shirt'))) matchType = true;
        if (filters.types.includes('Joggers') && (nameLower.includes('track') || nameLower.includes('jogger'))) matchType = true;
        if (filters.types.includes('Shorts') && (nameLower.includes('short') || nameLower.includes('bermuda') || nameLower.includes('dungaree'))) matchType = true;
        if (filters.types.includes('Suits') && (nameLower.includes('suit') || nameLower.includes('kurta') || nameLower.includes('set'))) matchType = true;
        if (filters.types.includes('Frocks') && (nameLower.includes('frock') || nameLower.includes('dress'))) matchType = true;
      }

      // Price Filter
      let matchPrice = filters.prices.length === 0;
      if (!matchPrice) {
        if (filters.prices.includes('low') && p.price < 500) matchPrice = true;
        if (filters.prices.includes('mid') && p.price >= 500 && p.price <= 999) matchPrice = true;
        if (filters.prices.includes('high') && p.price > 999) matchPrice = true;
      }

      // Gender Filter (maps to category)
      let matchGender = filters.genders.length === 0;
      if (!matchGender) {
        if (filters.genders.includes('Boys') && p.category === 'Boys') matchGender = true;
        if (filters.genders.includes('Girls') && p.category === 'Girls') matchGender = true;
        if (filters.genders.includes('Newborn') && p.category === 'Newborn') matchGender = true;
        if (filters.genders.includes('Unisex') && p.category === 'Unisex') matchGender = true;
      }

      // Size Filter (mock)
      let matchSize = filters.sizes.length === 0;
      if (!matchSize) matchSize = true; // since size isn't in db, simulate pass or do mock matching

      // Color Filter (mock)
      let matchColor = filters.colors.length === 0;
      if (!matchColor) matchColor = true; // simulate pass

      // Fabric Filter (mock)
      let matchFabric = filters.fabrics.length === 0;
      if (!matchFabric) {
        if (filters.fabrics.includes('Cotton') && nameLower.includes('cotton')) matchFabric = true;
        if (filters.fabrics.includes('Denim') && nameLower.includes('denim')) matchFabric = true;
        // else simulate pass for demo
        else matchFabric = true;
      }

      // Pattern Filter (mock)
      let matchPattern = filters.patterns.length === 0;
      if (!matchPattern) {
        if (filters.patterns.includes('Floral') && nameLower.includes('floral')) matchPattern = true;
        else matchPattern = true; // simulate pass
      }

      return matchType && matchPrice && matchGender && matchSize && matchColor && matchFabric && matchPattern;
    });

    // Sort Logic
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Newest Arrivals') {
      result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
    } else if (sortBy === 'Rating: High to Low') {
      // Mock sorting: just reverse the ID or mock rating
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [kidsProducts, filters, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

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

  const productTypes = [
    { id: 'T-Shirts', label: 'T-Shirts', count: kidsProducts.filter(p => p.name.toLowerCase().includes('tee') || p.name.toLowerCase().includes('t-shirt')).length },
    { id: 'Joggers', label: 'Joggers & Tracks', count: kidsProducts.filter(p => p.name.toLowerCase().includes('track') || p.name.toLowerCase().includes('jogger')).length },
    { id: 'Shorts', label: 'Shorts & Bermudas', count: kidsProducts.filter(p => p.name.toLowerCase().includes('short') || p.name.toLowerCase().includes('bermuda') || p.name.toLowerCase().includes('dungaree')).length },
    { id: 'Suits', label: 'Night Suits', count: kidsProducts.filter(p => p.name.toLowerCase().includes('suit') || p.name.toLowerCase().includes('kurta') || p.name.toLowerCase().includes('set')).length },
    { id: 'Frocks', label: 'Frocks & Dresses', count: kidsProducts.filter(p => p.name.toLowerCase().includes('frock') || p.name.toLowerCase().includes('dress')).length },
  ];

  const genderOptions = [
    { id: 'Boys', label: 'Boys' },
    { id: 'Girls', label: 'Girls' },
    { id: 'Newborn', label: 'Newborn' },
    { id: 'Unisex', label: 'Unisex' }
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
  const colorOptions = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];
  const fabricOptions = ['Cotton', 'Denim', 'Fleece', 'Organic'];
  const patternOptions = ['Solid', 'Printed', 'Floral', 'Striped'];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-8 pt-8">

        {/* Video Hero Section */}
        <div className="w-full max-w-5xl mx-auto rounded-[2rem] overflow-hidden mb-8 shadow-sm relative aspect-video bg-slate-100 flex items-center justify-center">
          <video
            src="/videos/kids wear hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

        {/* Shop By Age Filter Section */}
        <div className="mb-6">
          <ShopByAge />
        </div>

        {/* Top Controls */}
        <div ref={topControlsRef} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div className="text-slate-700 font-black text-sm mb-4 sm:mb-0">
            Showing {filteredProducts.length} Products
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-bold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-slate-200 rounded-full px-4 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating: High to Low</option>
              <option>Newest Arrivals</option>
              <option>Recommended</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left Sidebar Filters */}
          <div className="lg:col-span-1 space-y-4">

            {/* Product Type Accordion */}
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection('productType')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-black text-slate-800">Product type</span>
                {expandedSections.productType ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {expandedSections.productType && (
                <div className="p-5 space-y-3">
                  {productTypes.map((type) => (
                    <label key={type.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filters.types.includes(type.id)}
                          onChange={() => handleFilterChange('types', type.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#A7DEB9] focus:ring-[#A7DEB9] cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{type.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-300">{type.count < 10 ? `0${type.count}` : type.count}</span>
                    </label>
                  ))}
                  <button className="text-xs font-black text-slate-800 underline pt-2 hover:text-[#A7DEB9]">
                    See More
                  </button>
                </div>
              )}
            </div>

            {/* Price Accordion */}
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection('price')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-black text-slate-800">Price</span>
                {expandedSections.price ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {expandedSections.price && (
                <div className="p-5 space-y-3">
                  {[
                    { id: 'low', label: 'Under ₹499' },
                    { id: 'mid', label: '₹500 - ₹999' },
                    { id: 'high', label: 'Over ₹1000' }
                  ].map((price) => (
                    <label key={price.id} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.prices.includes(price.id)}
                        onChange={() => handleFilterChange('prices', price.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#A7DEB9] focus:ring-[#A7DEB9] cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{price.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Accordion */}
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection('gender')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-black text-slate-800">Gender</span>
                {expandedSections.gender ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {expandedSections.gender && (
                <div className="p-5 space-y-3">
                  {genderOptions.map((g) => (
                    <label key={g.id} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.genders.includes(g.id)}
                        onChange={() => handleFilterChange('genders', g.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#A7DEB9] focus:ring-[#A7DEB9] cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{g.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Size Accordion */}
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection('size')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-black text-slate-800">Size</span>
                {expandedSections.size ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {expandedSections.size && (
                <div className="p-5 space-y-3">
                  {sizeOptions.map((s) => (
                    <label key={s} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.sizes.includes(s)}
                        onChange={() => handleFilterChange('sizes', s)}
                        className="w-4 h-4 rounded border-slate-300 text-[#A7DEB9] focus:ring-[#A7DEB9] cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{s}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Color Accordion */}
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection('color')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-black text-slate-800">Color</span>
                {expandedSections.color ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {expandedSections.color && (
                <div className="p-5 space-y-3">
                  {colorOptions.map((c) => (
                    <label key={c} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.colors.includes(c)}
                        onChange={() => handleFilterChange('colors', c)}
                        className="w-4 h-4 rounded border-slate-300 text-[#A7DEB9] focus:ring-[#A7DEB9] cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{c}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Fabric Accordion */}
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection('fabric')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-black text-slate-800">Fabric</span>
                {expandedSections.fabric ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {expandedSections.fabric && (
                <div className="p-5 space-y-3">
                  {fabricOptions.map((f) => (
                    <label key={f} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.fabrics.includes(f)}
                        onChange={() => handleFilterChange('fabrics', f)}
                        className="w-4 h-4 rounded border-slate-300 text-[#A7DEB9] focus:ring-[#A7DEB9] cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{f}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Pattern Accordion */}
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleSection('pattern')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-black text-slate-800">Pattern</span>
                {expandedSections.pattern ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {expandedSections.pattern && (
                <div className="p-5 space-y-3">
                  {patternOptions.map((p) => (
                    <label key={p} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.patterns.includes(p)}
                        onChange={() => handleFilterChange('patterns', p)}
                        className="w-4 h-4 rounded border-slate-300 text-[#A7DEB9] focus:ring-[#A7DEB9] cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{p}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-slate-400 font-bold">Loading kids collection...</div>
            ) : currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                  {currentProducts.map((product) => (
                    <KidsProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-3 mt-12 pb-8">
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
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all flex items-center justify-center border border-slate-100 ${currentPage === pageNum
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-4xl">🔍</span>
                <h3 className="text-lg font-black text-slate-800">No products found</h3>
                <p className="text-sm text-slate-500 font-semibold">Try adjusting your filters.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
