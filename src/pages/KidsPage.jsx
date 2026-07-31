import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import KidsProductCard from '../components/ui/KidsProductCard';
import QuickViewModal from '../components/ui/QuickViewModal';
import CustomDropdown from '../components/ui/CustomDropdown';
import ClothDoodlesBackground from '../components/ui/ClothDoodlesBackground';
import { useCombinedProducts } from '../queries/useCombinedProducts';
import ShopByAge from '../components/home/ShopByAge';
import ImageTrail from '../components/home/ImageTrail';
import denimBg from "../assets/hero-bg-denim.jpg";
import denimBgMobile from "../assets/hero-bg-denim-mobile.jpg";
import tshirt from "../assets/cutout-tshirt.png";
import shorts from "../assets/cutout-shorts.png";
import sun from "../assets/cutout-sun.png";
import cloud from "../assets/cutout-cloud.png";
import star from "../assets/cutout-star.png";

const cutouts = [
  { src: sun, className: "top-[6%] left-[4%] w-16 sm:w-20 md:w-36 z-2", rotDeg: -10, fromX: "-80px", fromY: "-60px", delay: "0s", label: "Smiling sun" },
  { src: cloud, className: "top-[10%] right-[6%] w-16 sm:w-24 md:w-44 z-2", rotDeg: 8, fromX: "90px", fromY: "-70px", delay: "0.15s", label: "Happy cloud" },
  { src: tshirt, className: "bottom-[14%] sm:bottom-[10%] left-[4%] sm:left-[6%] w-20 sm:w-24 md:w-40 z-2", rotDeg: -14, fromX: "-90px", fromY: "90px", delay: "0.30s", label: "Striped t-shirt" },
  { src: shorts, className: "bottom-[14%] sm:bottom-[10%] right-[4%] sm:right-[6%] w-20 sm:w-24 md:w-40 z-2", rotDeg: 12, fromX: "90px", fromY: "90px", delay: "0.45s", label: "Yellow shorts" },
  { src: star, className: "top-[38%] sm:top-[44%] right-[4%] w-12 sm:w-14 md:w-24 z-2", rotDeg: 18, fromX: "100px", fromY: "0px", delay: "0.60s", label: "Cheerful star" },
];

const trailImages = [
  "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1471286174574-e9627710ee7e?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502224562085-639556652f33?w=400&h=400&fit=crop&q=80",
];
const kidsSortOptions = [
  { label: 'Recommended', value: 'Recommended' },
  { label: 'Price: Low to High', value: 'Price: Low to High' },
  { label: 'Price: High to Low', value: 'Price: High to Low' },
  { label: 'Rating: High to Low', value: 'Rating: High to Low' },
  { label: 'Newest Arrivals', value: 'Newest Arrivals' }
];

export default function KidsPage() {
  const [searchParams] = useSearchParams();
  const initialGender = searchParams.get('gender');
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
    genders: initialGender ? [initialGender] : [],
    sizes: [],
    colors: [],
    fabrics: [],
    patterns: []
  });

  useEffect(() => {
    const gender = searchParams.get('gender');
    setFilters(prev => ({ ...prev, genders: gender ? [gender] : [] }));
    setCurrentPage(1);
  }, [searchParams]);

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
    <div className="min-h-screen bg-[#FFF8EC] relative overflow-hidden pb-20">
      {/* Animated Cloth Doodles Background Swapped from Home */}
      <ClothDoodlesBackground />

      {/* Full-Screen Video Hero Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 70px)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0'
      }}>
        {/* Desktop Background */}
        <div className="absolute inset-0 max-md:hidden z-0" style={{
          backgroundImage: `url(${denimBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />

        {/* Mobile Background */}
        <div className="absolute inset-0 md:hidden z-0" style={{
          backgroundImage: `url(${denimBgMobile})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />
        
        {/* Background Subtle Grid Pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage: "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none"
        }} />

        {/* Image Trail interactive overlay */}
        <div className="max-md:hidden" style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "auto"
        }}>
          <ImageTrail items={trailImages} variant={1} />
        </div>

        {/* Floating Animated Cutouts */}
        {cutouts.map((c, i) => (
          <div
            key={i}
            className={`absolute ${c.className} group cursor-pointer transition-transform duration-200 ease-out hover:scale-110 hover:-translate-y-1 focus-visible:scale-110 focus-visible:-translate-y-1 focus-visible:outline-none`}
            tabIndex={0}
            role="img"
            aria-label={c.label}
          >
            <img
              src={c.src}
              alt=""
              className="animate-cutout-shake drop-shadow-xl group-hover:drop-shadow-2xl transition-[filter] duration-200 pointer-events-none select-none w-full h-full"
              style={
                {
                  "--rot-deg": c.rotDeg,
                  "--from-x": c.fromX,
                  "--from-y": c.fromY,
                  animationDelay: c.delay,
                  transformOrigin: "center",
                }
              }
            />
          </div>
        ))}

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 20px',
          maxWidth: '800px'
        }}>
          <span style={{
            display: 'inline-block',
            backgroundColor: '#FFD800',
            color: '#1a1a1a',
            fontWeight: 800,
            fontSize: '0.78rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '6px 18px',
            borderRadius: '30px',
            border: '1.5px solid #222222',
            boxShadow: '0 3px 0 #222222',
            marginBottom: '20px'
          }}>
            🎨 Kids Collection
          </span>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: 900,
            color: '#2F1B2B',
            lineHeight: 1.2,
            margin: '0 0 20px'
          }}>
            Little Ones,{' '}
            <span style={{ color: '#FFD800' }}>Big Style</span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
            color: '#555555',
            marginBottom: '36px',
            fontWeight: 500,
            lineHeight: 1.6
          }}>
            Premium kids wear — comfortable, colourful & built to play.
          </p>

          <a
            href="#kids-products"
            style={{
              display: 'inline-block',
              backgroundColor: '#EF4A45',
              color: '#ffffff',
              padding: '14px 38px',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              border: '1.5px solid #222222',
              boxShadow: '0 4px 0 #222222',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 0 #222222';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 0 #222222';
            }}
          >
            Shop Kids Wear →
          </a>
        </div>

        {/* Interactive mouse trail hint in corner */}
        <div className="max-md:hidden" style={{
          position: "absolute",
          bottom: "30px",
          right: "30px",
          fontSize: "0.85rem",
          fontWeight: 500,
          color: "#475569",
          pointerEvents: "none",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "var(--color-accent)",
            display: "inline-block"
          }} />
          Move mouse to reveal trail
        </div>
      </div>

      {/* Products Section Anchor */}
      <div id="kids-products" className="max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-8 pt-8">

        {/* Shop By Age Filter Section */}
        <div className="mb-6">
          <ShopByAge />
        </div>

        {/* Top Controls */}
        <div ref={topControlsRef} className="relative z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div className="text-slate-700 font-black text-sm mb-4 sm:mb-0">
            Showing {filteredProducts.length} Products
          </div>
          <div className="flex items-center gap-2">
            <CustomDropdown
              options={kidsSortOptions}
              value={sortBy}
              onChange={setSortBy}
              icon={SlidersHorizontal}
            />
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
