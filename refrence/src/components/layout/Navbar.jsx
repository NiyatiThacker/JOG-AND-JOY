import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, User, ChevronDown, Sparkles, Shirt, Baby, Sparkle } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar({ onOpenProfile }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { cartTotalCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/products', hasDropdown: true },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact-us' }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
            ? 'bg-white/90 backdrop-blur-lg py-3 shadow-md border-b border-slate-100'
            : 'bg-[#FFF8EC] py-4 border-b border-amber-100/50'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2">
              <BrandLogo className="h-10 sm:h-12" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path && !link.hasDropdown;
                
                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.name}
                      className="relative group"
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center gap-1 text-sm font-extrabold transition-colors ${
                          location.pathname === link.path ? 'text-[#EF4A45]' : 'text-slate-700 group-hover:text-[#EF4A45]'
                        } py-2`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                      </Link>
                      
                      {/* Products Dropdown */}
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <Link to="/kids" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-[#AEE6FF]/20 hover:text-[#EF4A45]">Kids</Link>
                        <Link to="/men" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-[#AEE6FF]/20 hover:text-[#EF4A45]">Male</Link>
                        <Link to="/women" className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-[#AEE6FF]/20 hover:text-[#EF4A45]">Female</Link>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative text-sm font-extrabold transition-colors ${isActive ? 'text-[#EF4A45]' : 'text-slate-700 hover:text-[#EF4A45]'
                      }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-1 rounded-full bg-linear-to-r from-[#AEE6FF] via-[#EF4A45] to-[#FFD800]" />
                    )}
                  </Link>
                );
              })}

              {/* Distributor Network Link */}
              <Link 
                to="/distributor-network" 
                className="flex items-center gap-1 text-sm font-extrabold text-slate-700 hover:text-[#EF4A45] py-2"
              >
                Distributor Network
              </Link>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-full text-slate-700 hover:bg-amber-100/60 transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Profile */}
              <button
                onClick={onOpenProfile}
                className="p-2.5 rounded-full text-slate-700 hover:bg-amber-100/60 transition-colors hidden sm:block"
                title="User Profile"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2.5 rounded-full text-slate-700 hover:bg-amber-100/60 transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4A45] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Page Link */}
              <Link
                id="cart-icon-desktop"
                to="/cart"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#EF4A45] to-orange-500 text-white font-extrabold text-xs shadow-md hover:shadow-lg hover:scale-105 transition-all"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Bag</span>
                {cartTotalCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-[#EF4A45] text-[10px] font-black flex items-center justify-center shadow-sm">
                    {cartTotalCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-slate-700 hover:bg-amber-100/60"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Realtime Search Bar Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xl z-50">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center relative">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search t-shirts, frocks, onesies, hoodies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-800 placeholder-slate-400 font-bold text-sm focus:outline-none focus:border-[#EF4A45] focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2 text-xs font-extrabold bg-[#EF4A45] text-white rounded-full hover:bg-red-600 shadow-sm"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-[#FFF8EC] pt-24 px-6 overflow-y-auto pb-24">
          <nav className="flex flex-col space-y-3 font-extrabold text-slate-800">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div key={link.name} className="py-3 border-b border-amber-100 flex flex-col space-y-3">
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base text-slate-800 hover:text-[#EF4A45]"
                    >
                      {link.name}
                    </Link>
                    <div className="pl-4 flex flex-col space-y-2 border-l-2 border-amber-200">
                      <Link to="/kids" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-slate-600 hover:text-[#EF4A45]">Kids</Link>
                      <Link to="/men" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-slate-600 hover:text-[#EF4A45]">Male</Link>
                      <Link to="/women" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-slate-600 hover:text-[#EF4A45]">Female</Link>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 text-base border-b border-amber-100 hover:text-[#EF4A45]"
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 space-y-2">
              <Link
                to="/distributor-network"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-base text-slate-800 hover:text-[#EF4A45]"
              >
                Distributor Network
              </Link>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full py-3 bg-[#AEE6FF] text-slate-900 rounded-full font-black text-sm text-center flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> My Account
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
