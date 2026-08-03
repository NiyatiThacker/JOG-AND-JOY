import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import QuickViewModal from '../components/ui/QuickViewModal';
import CategoryHero from '../components/ui/CategoryHero';
import { useCombinedProducts } from '../queries/useCombinedProducts';
import { Filter, Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import CustomDropdown from '../components/ui/CustomDropdown';

export default function Products({ pageCategory = null }) {
  const [searchParams] = useSearchParams();
  const categoryFilterParam = pageCategory || searchParams.get('category') || '';
  const ageFilterParam = searchParams.get('age') || '';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryFilterParam);
  const [selectedAge, setSelectedAge] = useState(ageFilterParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'low' | 'high'
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedItemFilter, setSelectedItemFilter] = useState(searchParams.get('item') || '');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Kids', 'Male', 'Female'];
  const ageGroups = ['All', '0–2 Years', '3–5 Years', '6–8 Years', '9–12 Years'];

  React.useEffect(() => {
    setSelectedCategory(pageCategory || searchParams.get('category') || '');
    setSelectedItemFilter(searchParams.get('item') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [pageCategory, searchParams]);

  const { combinedProducts, isLoading } = useCombinedProducts();

  const filteredProducts = useMemo(() => {
    return combinedProducts.filter((p) => {
      let matchCat = false;
      if (!selectedCategory || selectedCategory === 'All') {
        matchCat = true;
      } else if (selectedCategory === 'Kids') {
        matchCat = ['Boys', 'Girls', 'Newborn', 'Unisex'].includes(p.category);
      } else if (selectedCategory === 'Male') {
        matchCat = p.category === "Men's Collection" || p.category === 'Men';
      } else if (selectedCategory === 'Female') {
        matchCat = p.category === 'Girls' || p.category === "Women's Collection" || p.category === 'Women';
      }

      // Item Filter Keyword Logic
      let matchItem = true;
      if (selectedItemFilter) {
        const nameLower = (p.name || '').toLowerCase();

        if (selectedItemFilter === 'Kids T-Shirt') {
          matchItem = nameLower.includes('tee') || nameLower.includes('t-shirt');
        } else if (selectedItemFilter.includes('Joggers') || selectedItemFilter.includes('Tracks')) {
          matchItem = nameLower.includes('track') || nameLower.includes('jogger');
        } else if (selectedItemFilter.includes('Shorts') || selectedItemFilter.includes('Bermuda')) {
          matchItem = nameLower.includes('short') || nameLower.includes('bermuda') || nameLower.includes('dungaree');
        } else if (selectedItemFilter.includes('Night Suits') || selectedItemFilter.includes('Pajama')) {
          matchItem = nameLower.includes('suit') || nameLower.includes('pajama') || nameLower.includes('kurta');
        } else if (selectedItemFilter.includes('Boxers')) {
          matchItem = nameLower.includes('boxer');
        } else if (selectedItemFilter === 'Girl Frocks') {
          matchItem = nameLower.includes('frock');
        }
      }

      const matchAge = !selectedAge || selectedAge === 'All' || p.ageGroup === selectedAge;
      const matchSearch =
        !searchQuery ||
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchAge && matchSearch && matchItem;
    }).sort((a, b) => {
      if (sortBy === 'low') return a.price - b.price;
      if (sortBy === 'high') return b.price - a.price;
      return b.rating - a.rating;
    });
  }, [selectedCategory, selectedAge, searchQuery, sortBy, selectedItemFilter]);

  return (
    <div className="min-h-screen bg-[#FFF8EC] pb-20">
      
      {/* Kids Hero Section */}
      {pageCategory === 'Kids' && <CategoryHero />}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${pageCategory === 'Kids' ? 'pt-4' : 'pt-10'}`}>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2.5">
          <span className="px-4 py-1.5 rounded-full bg-[#AEE6FF]/50 text-sky-900 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Explore Collection
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight capitalize pt-1">
            {pageCategory === 'Kids' ? 'Kids Fashion' : pageCategory === 'Male' ? "Men's Fashion" : pageCategory === 'Female' ? "Women's Fashion" : "All Products"} <span className="text-[#EF4A45]">Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed px-2">
            Browse our premium collection of bio-washed cotton apparel, ethnic wear, and activewear.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-slate-100 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Filters Button & Sort Select Row for Mobile Alignment */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              {/* Filters Button (Hidden on Dedicated Pages) */}
              {!pageCategory && (
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-colors shadow-xs ${
                    showFilters 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
                </button>
              )}

            {/* Sort Select */}
            <div className="flex-1 min-w-0 flex items-center justify-end">
              <CustomDropdown
                options={[
                  { label: 'Sort: Most Popular', value: 'popular' },
                  { label: 'Price: Low to High', value: 'low' },
                  { label: 'Price: High to Low', value: 'high' }
                ]}
                value={sortBy}
                onChange={setSortBy}
                icon={SlidersHorizontal}
                className="w-full max-w-50 sm:max-w-none sm:w-auto"
                buttonClassName="px-3! sm:px-4!"
              />
            </div>
            </div>

          </div>

          {/* Expandable Filter Menu */}
          {showFilters && !pageCategory && (
            <div className="p-4 mt-2 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              
              {/* Main Categories */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedItemFilter(''); // Reset sub-filters on category change
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        selectedCategory === cat || (!selectedCategory && cat === 'All')
                          ? 'bg-[#EF4A45] text-white shadow-md'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Groups (Only show if Kids is selected or All is selected) */}
              {(selectedCategory === 'Kids' || selectedCategory === 'All' || !selectedCategory) && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Kids Age Group</h4>
                  <div className="flex flex-wrap gap-2">
                    {ageGroups.map((age) => (
                      <button
                        key={age}
                        onClick={() => setSelectedAge(age)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          selectedAge === age || (!selectedAge && age === 'All')
                            ? 'bg-[#AEE6FF] text-sky-900 border-[#AEE6FF]'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-Item Filters */}
          {(selectedCategory === 'Kids' || selectedCategory === 'Male' || selectedCategory === 'Female') && (
            <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-100 no-scrollbar">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider shrink-0 mr-2">Filters:</span>

              {selectedCategory === 'Kids' && ['Kids T-Shirt', 'Kids Joggers & Tracks', 'Kids Shorts & Bermudas', 'Kids Night Suits', 'Kids Pajama Suits'].map(item => (
                <button
                  key={item}
                  onClick={() => setSelectedItemFilter(selectedItemFilter === item ? '' : item)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all shrink-0 border ${selectedItemFilter === item
                      ? 'bg-[#AEE6FF] text-sky-900 border-[#AEE6FF] shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                  {item}
                </button>
              ))}

              {selectedCategory === 'Male' && ['Men Tracks & Joggers', 'Men Shorts & Bermuda', 'Men Boxers'].map(item => (
                <button
                  key={item}
                  onClick={() => setSelectedItemFilter(selectedItemFilter === item ? '' : item)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all shrink-0 border ${selectedItemFilter === item
                      ? 'bg-[#AEE6FF] text-sky-900 border-[#AEE6FF] shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                  {item}
                </button>
              ))}

              {selectedCategory === 'Female' && ['Girl Frocks'].map(item => (
                <button
                  key={item}
                  onClick={() => setSelectedItemFilter(selectedItemFilter === item ? '' : item)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all shrink-0 border ${selectedItemFilter === item
                      ? 'bg-[#AEE6FF] text-sky-900 border-[#AEE6FF] shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="text-center py-20 bg-white rounded-3xl p-8 shadow-md border border-slate-100 space-y-3">
             <div className="text-slate-400 font-bold">Loading products...</div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl p-8 shadow-md border border-slate-100 space-y-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-xl font-black text-slate-800">No matching products found</h3>
            <p className="text-xs text-slate-500 font-semibold">Try resetting filters or searching with different keywords.</p>
            <button
              onClick={() => {
                setSelectedCategory(pageCategory || '');
                setSelectedAge('');
                setSearchQuery('');
                setSelectedItemFilter('');
              }}
              className="px-6 py-2.5 rounded-full bg-[#EF4A45] text-white font-extrabold text-xs shadow-sm hover:bg-red-600"
            >
              Reset Filters
            </button>
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
