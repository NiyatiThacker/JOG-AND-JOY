import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import FloatingActions from './components/layout/FloatingActions';
import CartPage from './pages/CartPage';
import LiveChatDrawer from './components/ui/LiveChatDrawer';
import UserProfileModal from './components/ui/UserProfileModal';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Collections from './pages/Collections';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';
import KidsPage from './pages/KidsPage';
import MenPage from './pages/MenPage';
import WomenPage from './pages/WomenPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import DistributorNetworkPage from './pages/DistributorNetworkPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  // Global click handler to scroll to top when clicking a link to the current page
  useEffect(() => {
    const handleSamePageClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          // Only scroll if it's the exact same pathname on the same domain, with no hash anchors
          if (url.pathname === window.location.pathname && url.origin === window.location.origin && !url.hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch (err) {
          // ignore invalid URLs
        }
      }
    };
    document.addEventListener('click', handleSamePageClick);
    return () => document.removeEventListener('click', handleSamePageClick);
  }, []);

  return null;
}

export default function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);

  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-[#FFF8EC] text-slate-800 flex flex-col font-sans selection:bg-[#AEE6FF] selection:text-slate-900 pb-16 md:pb-0">
            
            {/* Top Announcement Bar */}
            <AnnouncementBar />

            {/* Sticky Top Header Navigation */}
            <Navbar onOpenProfile={() => setIsProfileOpen(true)} />

            {/* Removed Slide-over Shopping Cart Drawer */}

            {/* Support Live Chat Drawer */}
            <LiveChatDrawer isOpen={isLiveChatOpen} onClose={() => setIsLiveChatOpen(false)} />

            {/* User Profile Modal */}
            <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

            {/* Main Page Router */}
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/kids" element={<KidsPage />} />
                <Route path="/men" element={<MenPage />} />
                <Route path="/women" element={<WomenPage />} />
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/distributor-network" element={<DistributorNetworkPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            {/* Footer */}
            <Footer />

            {/* Mobile Bottom Navigation */}
            <BottomNav onOpenProfile={() => setIsProfileOpen(true)} />

            {/* Floating Actions (WhatsApp, Live Chat, Scroll to Top) */}
            <FloatingActions onOpenLiveChat={() => setIsLiveChatOpen(true)} />

          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}
