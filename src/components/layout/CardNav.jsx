import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import BrandLogo from '../ui/BrandLogo';
import './CardNav.css';

const CardNav = ({
  logo = '/images/official_logo.png',
  logoAlt = 'JOG&JOY® - Love is in the wear',
  className = '',
  baseColor = '#FFF8EC',
  menuColor = '#2D2D2D',
  buttonBgColor = '#EF4A45',
  buttonTextColor = '#ffffff',
  onOpenProfile
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [navHeight, setNavHeight] = useState(60);
  const [isMobile, setIsMobile] = useState(false);

  const { cartTotalCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      if (isMobile && contentRef.current) {
        // Temporarily make it visible to measure height
        const el = contentRef.current;
        const prevVis = el.style.visibility;
        el.style.visibility = 'hidden';
        el.style.display = 'flex';
        const height = el.scrollHeight;
        el.style.display = '';
        el.style.visibility = prevVis;
        setNavHeight(60 + height + 16); // 60 top bar + content + padding
      } else {
        setNavHeight(280); // Desktop height
      }
    } else {
      setNavHeight(60);
    }
  }, [isExpanded, isMobile]);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const items = [
    {
      label: "Shop",
      bgColor: "#EF4A45",
      textColor: "#ffffff",
      links: [
        { label: "Products", href: "/products", ariaLabel: "Products" },
        { label: "New Arrivals", href: "/new-arrivals", ariaLabel: "New Arrivals" },
        { label: "Kids Wear", href: "/kids", ariaLabel: "Kids Collection" },
        { label: "Men Wear", href: "/men", ariaLabel: "Men Collection" }
      ]
    },
    {
      label: "Explore",
      bgColor: "#AEE6FF",
      textColor: "#2D2D2D",
      links: [
        { label: "About Us", href: "/about-us", ariaLabel: "About JOG & JOY" },
        { label: "Why Choose Us", href: "/why-us", ariaLabel: "Why Choose JOG & JOY" },
        { label: "Home Page", href: "/", ariaLabel: "Home" }
      ]
    },
    {
      label: "Connect",
      bgColor: "#FFD800",
      textColor: "#2D2D2D",
      links: [
        { label: "Contact Us", href: "/contact-us", ariaLabel: "Contact Us" },
        { label: "Distributors", href: "/distributor-network", ariaLabel: "Distributor Network" },
        { label: "My Profile", action: onOpenProfile, ariaLabel: "Open My Profile" }
      ]
    }
  ];

  // Calculate circular fan parameters based on index
  const getCardAnimation = (idx, total) => {
    if (isMobile) {
      return {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0, rotate: 0, x: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { delay: idx * 0.08, duration: 0.4, ease: [0.25, 1, 0.5, 1] }
      };
    }
    
    // Desktop circular fan effect
    const mid = (total - 1) / 2;
    const offset = idx - mid; // e.g., for 3 items: -1, 0, 1
    const rotate = offset * 12; // -12deg, 0deg, 12deg
    const yOffset = Math.abs(offset) * 15; // 15px for outer cards, 0px for middle
    const xOffset = offset * 15; // spread them out slightly more horizontally

    return {
      initial: { opacity: 0, y: -40, rotate: 0, x: 0, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: yOffset, 
        rotate: rotate, 
        x: xOffset,
        scale: 1 
      },
      exit: { opacity: 0, y: -40, rotate: 0, x: 0, scale: 0.95 },
      transition: { 
        delay: idx * 0.06, 
        type: 'spring', 
        stiffness: 150, 
        damping: 15, 
        mass: 1 
      }
    };
  };

  return (
    <div className={`card-nav-container ${isScrolled ? 'scrolled' : ''} ${className}`}>
      <motion.nav 
        className={`card-nav ${isExpanded ? 'open' : ''}`} 
        style={{ backgroundColor: baseColor }}
        animate={{ height: navHeight }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isExpanded ? 'open' : ''}`}
            onClick={toggleMenu}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">
            <BrandLogo className="h-7 md:h-9" showTagline={false} />
          </div>

          <div className="card-nav-actions-right">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="action-btn"
              title="Search"
            >
              <Search className="w-5 h-5 text-slate-700" />
            </button>

            <button
              onClick={onOpenProfile}
              className="action-btn hidden-mobile"
              title="Profile"
            >
              <User className="w-5 h-5 text-slate-700" />
            </button>

            <Link
              to="/wishlist"
              className="action-btn relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 text-slate-700" />
              {wishlistCount > 0 && (
                <span className="badge">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="card-nav-cta-button"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              <div className="cta-content">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden-mobile">Bag</span>
                {cartTotalCount > 0 && (
                  <span className="cta-badge">
                    {cartTotalCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        <div 
          className="card-nav-content" 
          aria-hidden={!isExpanded}
          ref={contentRef}
          style={{
            visibility: isExpanded ? 'visible' : 'hidden',
            pointerEvents: isExpanded ? 'auto' : 'none'
          }}
        >
          <AnimatePresence>
            {isExpanded && items.slice(0, 3).map((item, idx) => {
              const animation = getCardAnimation(idx, Math.min(items.length, 3));
              return (
                <motion.div
                  key={`${item.label}-${idx}`}
                  className="nav-card shadow-xl"
                  style={{ backgroundColor: item.bgColor, color: item.textColor, transformOrigin: 'bottom center' }}
                  initial={animation.initial}
                  animate={animation.animate}
                  exit={animation.exit}
                  transition={animation.transition}
                >
                  <div className="nav-card-label">{item.label}</div>
                  <div className="nav-card-links">
                    {item.links?.map((lnk, i) => {
                      if (lnk.action) {
                        return (
                          <button
                            key={`${lnk.label}-${i}`}
                            className="nav-card-link text-left"
                            onClick={() => {
                              lnk.action();
                              toggleMenu();
                            }}
                            aria-label={lnk.ariaLabel}
                            style={{ background: 'transparent', border: 'none', padding: 0, color: 'inherit' }}
                          >
                            <ArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                            {lnk.label}
                          </button>
                        );
                      }
                      return (
                        <Link
                          key={`${lnk.label}-${i}`}
                          className="nav-card-link"
                          to={lnk.href}
                          onClick={toggleMenu}
                          aria-label={lnk.ariaLabel}
                        >
                          <ArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                          {lnk.label}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Floating Search Bar Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className="card-nav-search-overlay"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSearchSubmit} className="search-form">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search t-shirts, frocks, onesies, hoodies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="search-input"
              />
              <button
                type="submit"
                className="search-submit"
              >
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardNav;
