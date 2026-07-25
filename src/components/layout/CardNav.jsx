import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowUpRight, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './CardNav.css';

const CardNav = ({
  logo = '/images/official_logo.png',
  logoAlt = 'JOG&JOY® - Love is in the wear',
  className = '',
  ease = 'power3.out',
  baseColor = '#FFF8EC',
  menuColor = '#2D2D2D',
  buttonBgColor = '#EF4A45',
  buttonTextColor = '#ffffff',
  onOpenProfile
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { cartTotalCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content');
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = i => el => {
    if (el) cardsRef.current[i] = el;
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
        { label: "Men Wear", href: "/men", ariaLabel: "Men Collection" },
        { label: "Women Wear", href: "/women", ariaLabel: "Women Collection" }
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

  return (
    <div className={`card-nav-container ${isScrolled ? 'scrolled' : ''} ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
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
            <Link to="/">
              <img src={logo} alt={logoAlt} className="logo" />
            </Link>
          </div>

          <div className="card-nav-actions-right">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="action-btn"
              title="Search"
            >
              <Search className="w-5 h-5 text-slate-700" />
            </button>

            {/* Profile Icon */}
            <button
              onClick={onOpenProfile}
              className="action-btn hidden-mobile"
              title="Profile"
            >
              <User className="w-5 h-5 text-slate-700" />
            </button>

            {/* Wishlist Icon */}
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

            {/* Cart Bag CTA Button */}
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

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
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
            </div>
          ))}
        </div>
      </nav>

      {/* Floating Search Bar Overlay */}
      {isSearchOpen && (
        <div className="card-nav-search-overlay">
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
        </div>
      )}
    </div>
  );
};

export default CardNav;
