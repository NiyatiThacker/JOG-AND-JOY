import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, Phone, Mail } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';

// Minimal monochrome social icons matching reference style
const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.5 9h3v10h-3zM6 4a1.75 1.75 0 1 1 0 3.5A1.75 1.75 0 0 1 6 4zm11 15h-3v-5.5c0-1.38-.28-2.5-2-2.5-1.72 0-2 1.25-2 2.5V19H7V9h3v1.5c.43-.8 1.5-1.8 3.5-1.8 3.1 0 3.5 2.1 3.5 4.8V19z" />
  </svg>
);

const YouTubeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.54a29 29 0 0 0 .46 5.12 2.78 2.78 0 0 0 1.95 1.96C5.12 19 12 19 12 19s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.12 29 29 0 0 0-.46-5.12z" />
    <polygon points="9.75 15.02 15.5 11.54 9.75 8.06 9.75 15.02" fill="none" />
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);


export default function Footer() {
  return (
    <footer className="bg-[#FFF8EC] py-10 px-4 sm:px-6 lg:px-8">
      {/* Outer rounded card inset representing the bitesized design container */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] border border-[#E9E0D2] shadow-sm overflow-hidden p-4 sm:p-8 relative">

        {/* UPPER BANNER: Scalloped Red Grid Section */}
        <div
          className="relative w-full h-[280px] sm:h-[220px] rounded-3xl bg-[#EF4A45] flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 py-10 overflow-hidden mb-12"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.1) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
          }}
        >
          {/* Top Scallop Mask */}
          <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden z-10 select-none pointer-events-none">
            <svg className="w-full h-full text-white fill-current" viewBox="0 0 1440 24" preserveAspectRatio="none">
              <path d="M0,0 C30,20 60,20 90,0 C120,20 150,20 180,0 C210,20 240,20 270,0 C300,20 330,20 360,0 C390,20 420,20 450,0 C480,20 510,20 540,0 C570,20 600,20 630,0 C660,20 690,20 720,0 C750,20 780,20 810,0 C840,20 870,20 900,0 C930,20 960,20 990,0 C1020,20 1050,20 1080,0 C1110,20 1140,20 1170,0 C1200,20 1230,20 1260,0 C1290,20 1320,20 1350,0 C1380,20 1410,20 1440,0 L1440,24 L0,24 Z" />
            </svg>
          </div>

          {/* Bottom Scallop Mask */}
          <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden z-10 select-none pointer-events-none">
            <svg className="w-full h-full text-white fill-current" viewBox="0 0 1440 24" preserveAspectRatio="none">
              <path d="M0,24 C30,4 60,4 90,24 C120,4 150,4 180,24 C210,4 240,4 270,24 C300,4 330,4 360,24 C390,4 420,4 450,24 C480,4 510,4 540,24 C570,4 600,4 630,24 C660,4 690,4 720,24 C750,4 780,4 810,24 C840,4 870,4 900,24 C930,4 960,4 990,24 C1020,4 1050,4 1080,24 C1110,4 1140,4 1170,24 C1200,4 1230,4 1260,24 C1290,4 1320,4 1350,24 C1380,4 1410,4 1440,24 L1440,0 L0,0 Z" />
            </svg>
          </div>

          {/* Left Element: Coupon Ticket */}
          <div className="relative z-20 transform rotate-[-6deg] hover:rotate-[0deg] transition-all duration-300 select-none cursor-pointer flex items-center justify-center w-40 h-20 max-sm:mb-4">
            <svg viewBox="0 0 120 50" className="absolute inset-0 w-full h-full text-[#CFFFE5] fill-current stroke-slate-900 stroke-[2.5] drop-shadow-md">
              <path d="M 0,0 L 120,0 L 120,15 A 8,8 0 0,0 120,35 L 120,50 L 0,50 L 0,35 A 8,8 0 0,0 0,15 Z" />
              <line x1="30" y1="5" x2="30" y2="45" stroke="rgba(30,41,59,0.4)" strokeDasharray="3,3" />
            </svg>
            <div className="relative z-10 text-center flex flex-col justify-center h-full pl-6 pr-2">
              <span className="text-[10px] font-black text-slate-800 tracking-wider uppercase leading-none">Coupon</span>
              <span className="text-base font-extrabold text-[#EF4A45] tracking-tight leading-tight">PLAY20</span>
            </div>
          </div>

          {/* Center Element: Rounded outline button */}
          <div className="relative z-20 text-center max-sm:mb-4">
            <Link
              to="/products"
              className="inline-block px-8 py-4 rounded-full font-black text-base md:text-lg border-4 border-slate-900 shadow-[4px_4px_0px_#1e293b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1e293b] transition-all duration-150 bg-[#FFD800] text-slate-900 uppercase tracking-wider font-poppins"
            >
              Shop Latest Look
            </Link>
          </div>

          {/* Right Element: Blue Spiky Starburst */}
          <div className="relative z-20 flex items-center justify-center select-none transform rotate-[6deg] hover:rotate-[0deg] transition-all duration-300 w-28 h-28">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#00A3E0] fill-current stroke-slate-900 stroke-[2.5] drop-shadow-md">
              <path d="M50,5 L58,20 L73,12 L75,29 L90,27 L83,42 L95,50 L83,58 L90,73 L75,71 L73,88 L58,80 L50,95 L42,80 L27,88 L25,71 L10,73 L17,58 L5,50 L17,42 L10,27 L25,29 L27,12 L42,20 Z" />
            </svg>
            <span className="relative z-10 text-white font-black text-base uppercase tracking-wider rotate-[-5deg] font-poppins">Sale!</span>
          </div>
        </div>

        {/* LOWER SECTION: Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-[#2D2D2D]/10 px-2 sm:px-4">

          {/* Column 1 & 2: Logo and Address Summary */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-4">
                {/* Unchanged Logo */}
                <BrandLogo className="h-10 sm:h-12" showTagline={true} />

                <p className="text-xs sm:text-sm text-[#2D2D2D]/80 font-bold leading-relaxed max-w-sm font-poppins">
                  From playground-proof kids clothing to comfortable lounge collections, JOG & JOY designs high-quality activewear that brings a little bit of magic to every wardrobe.
                </p>
              </div>
              <img
                src="/images/boy_clothes.png"
                alt="Happy kid holding clothes"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain shrink-0 animate-wiggle-hover max-md:hidden select-none pointer-events-none"
              />
            </div>

            <div className="pt-2 text-xs font-bold text-[#2D2D2D]/70 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#EF4A45]" /> 488, Navo Vas, Kalupur, Ahmedabad 380001, Gujarat
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#EF4A45]" /> 91-79-2213 9665
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#EF4A45]" /> info@jognjoy.com
              </div>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#EF4A45]">Explore</h4>
            <ul className="space-y-2.5 text-xs font-bold text-[#2D2D2D]/90">
              <li><Link to="/" className="hover:text-[#EF4A45] uppercase">Home</Link></li>
              <li><Link to="/products" className="hover:text-[#EF4A45] uppercase">Products</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-[#EF4A45] uppercase">New Arrivals</Link></li>
              <li><Link to="/kids" className="hover:text-[#EF4A45] uppercase">Kids Wear</Link></li>
              <li><Link to="/about-us" className="hover:text-[#EF4A45] uppercase">About Us</Link></li>
              <li><Link to="/why-us" className="hover:text-[#EF4A45] uppercase">Why Choose Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-[#EF4A45] uppercase">Contact Us</Link></li>
              <li><Link to="/distributor-network" className="hover:text-[#EF4A45] uppercase">Distributors</Link></li>
            </ul>
          </div>

          {/* Column 4: Help & Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#EF4A45]">Support</h4>
            <ul className="space-y-2.5 text-xs font-bold text-[#2D2D2D]/90">
              <li><Link to="/why-us" className="hover:text-[#EF4A45]">Size Guide</Link></li>
              <li><Link to="/distributor-network" className="hover:text-[#EF4A45]">Distributor Network</Link></li>
              <li><Link to="/career" className="hover:text-[#EF4A45]">Careers</Link></li>
              <li><Link to="/contact-us" className="hover:text-[#EF4A45]">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 5: Brand Verticals & Social Connect */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#EF4A45]">Our Brands</h4>

            {/* Horizontal Brands block with thin vertical divider inside matching JOG&JOY container design */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E9E0D2] shadow-sm max-w-[260px] select-none">
              <a href="https://kamalclothing.com/" target="_blank" rel="noopener noreferrer" className="block transition-all duration-200 hover:scale-105" title="Kamal Clothing">
                <img src="/images/kamal_logo.png" alt="dp Kamal Kids Wear" className="h-10 w-auto object-contain" />
              </a>
              <div className="w-[1px] h-8 bg-slate-200" />
              <a href="https://dharmanath.com/" target="_blank" rel="noopener noreferrer" className="block transition-all duration-200 hover:scale-105" title="Dharmanath Products">
                <img src="/images/dharmanath_logo.png" alt="DHARMANATH PRODUCTS PVT. LTD." className="h-10 w-auto object-contain" />
              </a>
            </div>

            <div className="pt-2 space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Social Connect</span>
              <div className="flex gap-5 items-center">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-800 hover:text-[#EF4A45] transition-all duration-200 hover:scale-110 cursor-pointer" title="Instagram">
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-800 hover:text-[#EF4A45] transition-all duration-200 hover:scale-110 cursor-pointer" title="LinkedIn">
                  <LinkedInIcon className="w-5 h-5" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-slate-800 hover:text-[#EF4A45] transition-all duration-200 hover:scale-110 cursor-pointer" title="YouTube">
                  <YouTubeIcon className="w-5 h-5" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-800 hover:text-[#EF4A45] transition-all duration-200 hover:scale-110 cursor-pointer" title="Facebook">
                  <FacebookIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="pt-8 text-center text-xs font-bold text-[#2D2D2D]/70 space-y-3 px-2">
          <p>© {new Date().getFullYear()} JOG&JOY®. All rights reserved. Love is in the wear.</p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#2D2D2D]/60">
            <Link to="/contact-us" className="hover:text-[#EF4A45]">Terms & Conditions</Link>
            <Link to="/contact-us" className="hover:text-[#EF4A45]">Privacy Policy</Link>
            <Link to="/contact-us" className="hover:text-[#EF4A45]">Coupon Policy</Link>
            <Link to="/contact-us" className="hover:text-[#EF4A45]">Accessibility</Link>
          </div>
        </div>
        {/* Floating Shopping Kid peeking from the bottom right */}
        <img
          src="/images/boy_shopping.png"
          alt="Jumping shopping kid"
          className="absolute bottom-0 right-4 w-28 h-28 md:w-36 md:h-36 object-contain pointer-events-none select-none animate-bounce-hover opacity-95 z-0 max-sm:hidden"
        />
      </div>
    </footer>
  );
}
