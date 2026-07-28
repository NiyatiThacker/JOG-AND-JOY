import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Menu, X, ShoppingBag, ArrowRight, Home, Info, HelpCircle, Briefcase, Phone } from 'lucide-react';
import { AnimeNavBar } from '../ui/anime-navbar';

export const productCategories = [
  { name: 'Kids T-Shirt', slug: 'kids-t-shirt', category: 'Kids' },
  { name: 'Kids Joggers & Tracks', slug: 'kids-joggers-tracks', category: 'Kids' },
  { name: 'Kids Shorts & Bermudas', slug: 'kids-shorts-bermudas', category: 'Kids' },
  { name: 'Kids Night Suits', slug: 'kids-night-suits', category: 'Kids' },
  { name: 'Kids Pajama Suits', slug: 'kids-pajama-suits', category: 'Kids' },
  { name: 'Girl Frocks', slug: 'girl-frocks', category: 'Kids' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "About", url: "/about-us", icon: Info },
    { name: "Why Us", url: "/why-us", icon: HelpCircle },
    { name: "Career", url: "/career", icon: Briefcase },
    { name: "Contact", url: "/contact-us", icon: Phone },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'glass-header py-3 shadow-xl' : 'bg-slate-950/80 backdrop-blur-md py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative overflow-hidden rounded-xl bg-[#ccff00] p-1.5 transition-transform group-hover:scale-105">
                <img 
                  src="/images/logo.png" 
                  alt="Jog & Joy Logo" 
                  className="h-7 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center font-black text-slate-950 text-base px-2 py-0.5 tracking-tighter">
                  JOG&JOY
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-[#ccff00] transition-colors">
                  JOG&JOY
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                  Love Is In The Wear
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4">
              <AnimeNavBar items={navItems} defaultActive="Home" />

              {/* Products Mega Dropdown (Kept separate from the AnimeNavBar as it's a dropdown) */}
              <div 
                className="relative"
                onMouseEnter={() => setIsProductsDropdownOpen(true)}
                onMouseLeave={() => setIsProductsDropdownOpen(false)}
              >
                <button 
                  onClick={() => navigate('/products')}
                  className={`flex items-center gap-1 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    location.pathname.startsWith('/products') ? 'text-[#ccff00] bg-white/5' : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180 text-[#ccff00]' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProductsDropdownOpen && (
                  <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
                        Category Catalog
                      </div>
                      <div className="space-y-1">
                        {productCategories.map((cat) => (
                          <Link
                            key={cat.slug}
                            to={`/products?category=${cat.slug}`}
                            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-200 hover:text-[#ccff00] hover:bg-white/5 rounded-xl transition-all group"
                          >
                            <span>{cat.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-[#ccff00]/10 group-hover:text-[#ccff00]">
                              {cat.category}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <Link 
                          to="/products"
                          className="flex items-center justify-center gap-2 text-xs font-semibold text-[#ccff00] hover:underline py-1"
                        >
                          View All Categories <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/products"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-[#ccff00] text-slate-950 hover:bg-[#b8e600] transition-all transform hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4" />
                Explore Shop
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 p-4 bg-slate-900/95 border-b border-slate-700/80 backdrop-blur-xl shadow-2xl z-50 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search activewear, kids t-shirts, joggers, boxers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-24 py-3 bg-slate-800/80 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-[#ccff00]"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 text-xs font-bold uppercase bg-[#ccff00] text-slate-950 rounded-xl hover:bg-[#b8e600]"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-slate-950/95 backdrop-blur-2xl pt-24 px-6 overflow-y-auto pb-12">
          <nav className="flex flex-col space-y-2">
            <Link to="/" className="py-3 text-lg font-bold border-b border-slate-800 text-white">Home</Link>
            <Link to="/about-us" className="py-3 text-lg font-bold border-b border-slate-800 text-white">About Us</Link>
            
            <div className="py-3 border-b border-slate-800">
              <div className="flex items-center justify-between text-lg font-bold text-white mb-2">
                <span>Products Catalog</span>
                <ChevronDown className="w-5 h-5 text-[#ccff00]" />
              </div>
              <div className="pl-4 space-y-2 text-sm text-slate-300">
                {productCategories.map((cat) => (
                  <Link 
                    key={cat.slug} 
                    to={`/products?category=${cat.slug}`}
                    className="block py-1.5 hover:text-[#ccff00]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/collections" className="py-3 text-lg font-bold border-b border-slate-800 text-white">Collections</Link>
            <Link to="/why-us" className="py-3 text-lg font-bold border-b border-slate-800 text-white">Why Us</Link>
            <Link to="/distributors" className="py-3 text-lg font-bold border-b border-slate-800 text-white">Distributor Network</Link>
            <Link to="/career" className="py-3 text-lg font-bold border-b border-slate-800 text-white">Career</Link>
            <Link to="/contact-us" className="py-3 text-lg font-bold border-b border-slate-800 text-white">Contact Us</Link>
            <Link to="/admin" className="py-3 text-lg font-bold text-[#ccff00]">Admin Dashboard</Link>
          </nav>
        </div>
      )}
    </>
  );
}
