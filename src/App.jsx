import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import FloatingActions from './components/layout/FloatingActions';
import CartPage from './pages/CartPage';
import LiveChatDrawer from './components/ui/LiveChatDrawer';
import UserProfileModal from './components/ui/UserProfileModal';
import CustomerLoginModal from './components/ui/CustomerLoginModal';
import Footer from './components/layout/Footer';
import { useAuth } from './context/AuthContext';

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
import NewArrivalsPage from './pages/NewArrivalsPage';
import DistributorNetworkPage from './pages/DistributorNetworkPage';
import WhyUs from './pages/WhyUs';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminInventory from './pages/admin/AdminInventory';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReviews from './pages/admin/AdminReviews';
import AdminShipping from './pages/admin/AdminShipping';
import AdminMessages from './pages/admin/AdminMessages';
import AdminFinancials from './pages/admin/AdminFinancials';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    const handleSamePageClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          if (url.pathname === window.location.pathname && url.origin === window.location.origin && !url.hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch (err) {
        }
      }
    };
    document.addEventListener('click', handleSamePageClick);
    return () => document.removeEventListener('click', handleSamePageClick);
  }, []);

  return null;
}

function StoreLayout({ isLiveChatOpen, setIsLiveChatOpen, isProfileOpen, setIsProfileOpen }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative bg-[#FFF8EC] text-slate-800 flex flex-col font-sans selection:bg-[#AEE6FF] selection:text-slate-900 pb-16 md:pb-0">
      <AnnouncementBar />
      <Navbar onOpenProfile={() => setIsProfileOpen(true)} />

      <LiveChatDrawer isOpen={isLiveChatOpen} onClose={() => setIsLiveChatOpen(false)} />
      
      {isAuthenticated ? (
        <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      ) : (
        <CustomerLoginModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      )}
      
      <div className="grow">
        <Outlet />
      </div>

      <Footer />
      <BottomNav onOpenProfile={() => setIsProfileOpen(true)} />
      <FloatingActions onOpenLiveChat={() => setIsLiveChatOpen(true)} />
    </div>
  );
}

import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/layout/AdminRoute';
import CartoonCursor from './components/ui/CartoonCursor';

export default function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <CartoonCursor />
            <ScrollToTop />
            <Routes>
              {/* Admin Routes - Completely Isolated */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="promotions" element={<AdminPromotions />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="shipping" element={<AdminShipping />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="financials" element={<AdminFinancials />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>

              {/* Admin Routes - Completely Isolated */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="promotions" element={<AdminPromotions />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="shipping" element={<AdminShipping />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="financials" element={<AdminFinancials />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>

              {/* Storefront Routes */}
              <Route element={<StoreLayout isLiveChatOpen={isLiveChatOpen} setIsLiveChatOpen={setIsLiveChatOpen} isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/kids" element={<KidsPage />} />
                <Route path="/men" element={<Navigate to="/products?category=Male" replace />} />
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/why-us" element={<WhyUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/distributor-network" element={<DistributorNetworkPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
