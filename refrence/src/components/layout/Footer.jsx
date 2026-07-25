import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, Phone, Mail } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-[#FAF8F5] border-t border-[#2D2D2D]/10 pt-16 pb-12 text-[#2D2D2D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2D2D2D]/10">
        
        {/* Brand Summary */}
        <div className="lg:col-span-2 space-y-4">
          <BrandLogo className="h-12" showTagline={true} />
          
          <p className="text-xs sm:text-sm text-[#2D2D2D]/80 font-bold leading-relaxed max-w-sm">
            JOG&JOY® offers a curated collection of children's fashion, activewear, and men's loungewear engineered for non-stop comfort and vibrant confidence.
          </p>
          <div className="pt-2 text-xs font-bold text-[#2D2D2D]/70 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#EF4A45]" /> 488, Navo Vas, Kalupur, Ahmedabad 380001. Gujarat.
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#EF4A45]" /> 91-79-2213 9665
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#EF4A45]" /> info@jognjoy.com
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#EF4A45]">Quick Link</h4>
          <ul className="space-y-2 text-xs font-bold text-[#2D2D2D]">
            <li><Link to="/products?tab=new" className="hover:text-[#EF4A45]">New Arrival</Link></li>
            <li><Link to="/products" className="hover:text-[#EF4A45]">Shop</Link></li>
            <li><Link to="/collections" className="hover:text-[#EF4A45]">Category</Link></li>
            <li><Link to="/contact-us" className="hover:text-[#EF4A45]">Contact</Link></li>
            <li><Link to="/about-us" className="hover:text-[#EF4A45]">About Us</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#EF4A45]">Help</h4>
          <ul className="space-y-2 text-xs font-bold text-[#2D2D2D]">
            <li><Link to="/why-us" className="hover:text-[#EF4A45]">Size Guide</Link></li>
            <li><Link to="/distributors" className="hover:text-[#EF4A45]">Distributor Network</Link></li>
            <li><Link to="/career" className="hover:text-[#EF4A45]">Career</Link></li>
            <li><Link to="/contact-us" className="hover:text-[#EF4A45]">FAQ</Link></li>
          </ul>
        </div>

        {/* Company Verticals & Social */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#EF4A45]">Company Verticals</h4>
          <ul className="space-y-2 text-xs font-bold text-[#2D2D2D]">
            <li>
              <a href="https://kamalclothing.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#EF4A45]">
                Kamal Clothing <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://dharmanath.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#EF4A45]">
                Dharmanath Products <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>

          <div className="pt-4 space-y-2 text-xs font-bold text-[#2D2D2D]">
            <span className="block text-[10px] uppercase text-slate-400">Social</span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block hover:text-[#EF4A45]">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="block hover:text-[#EF4A45]">Facebook</a>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-center text-xs font-bold text-[#2D2D2D]/70 space-y-3">
        <p>© {new Date().getFullYear()} JOG&JOY®. All rights reserved. Love is in the wear.</p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#2D2D2D]/60">
          <Link to="/contact-us" className="hover:text-[#EF4A45]">Terms & Conditions</Link>
          <Link to="/contact-us" className="hover:text-[#EF4A45]">Privacy Policy</Link>
          <Link to="/contact-us" className="hover:text-[#EF4A45]">Coupon Policy</Link>
          <Link to="/contact-us" className="hover:text-[#EF4A45]">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
