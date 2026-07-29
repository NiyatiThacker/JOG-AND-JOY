import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, User, Play, ChevronRight, ChevronLeft, Star, MessageSquare, Clock, Sparkles, X, Building2, Globe, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import CustomDropdown from '../components/ui/CustomDropdown';

const inquiryOptions = [
  { label: '🎈 General Inquiry', value: 'general' },
  { label: '🛍️ Wholesale / Dealership', value: 'wholesale' },
  { label: '📦 Order Support & Tracking', value: 'support' },
  { label: '📏 Size & Fit Consultation', value: 'size' }
];

// --- PLAYFUL SVG DOODLE COMPONENTS ---
const SparkleDoodle = ({ className = "w-6 h-6 text-amber-400" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
  </svg>
);

const SquiggleDoodle = ({ className = "w-16 h-4 text-orange-400" }) => (
  <svg className={className} viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
    <path d="M5 10 Q 25 2, 45 10 T 85 10 T 95 10" />
  </svg>
);

const CloudDoodle = ({ className = "w-12 h-8 text-sky-400" }) => (
  <svg className={className} viewBox="0 0 64 40" fill="currentColor" opacity="0.9">
    <path d="M18 36h30a14 14 0 002-27.8 18 18 0 00-34.6-2.2A12 12 0 0018 36z" />
  </svg>
);

const SmileyDoodle = ({ className = "w-8 h-8 text-[#FF5500]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" fill="#FFE5D9" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#FF5500" strokeWidth="2.5" />
    <circle cx="9" cy="9" r="1.5" fill="#FF5500" />
    <circle cx="15" cy="9" r="1.5" fill="#FF5500" />
  </svg>
);

const CrownDoodle = ({ className = "w-8 h-6 text-amber-400" }) => (
  <svg className={className} viewBox="0 0 24 16" fill="currentColor">
    <path d="M2 14L0 3L6.5 8L12 0L17.5 8L24 3L22 14H2Z" />
  </svg>
);

const RocketDoodle = ({ className = "w-10 h-10 text-[#FF5500]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.5 1.76-2.34L4.5 16.5z" fill="#FFD800" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" fill="#FF5500" stroke="currentColor" />
    <circle cx="15" cy="9" r="2" fill="#fff" />
  </svg>
);

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    inquiryType: 'general',
    comment: ''
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Super fast delivery, great material, and I am simply loving it! Looking forward to making my next wholesale order for our sports academy!",
      name: "Karen Tan",
      role: "Sports Academy Director",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      stars: 5
    },
    {
      quote: "I love this tracksuit! I have zero regrets buying it for my kids. Quality is outstanding and Jog&Joy customer support helped resolve fit questions instantly.",
      name: "Ana Gomez",
      role: "Verified Parent Customer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      stars: 5
    },
    {
      quote: "As a retail distributor, working with Jog&Joy has been seamless. High margin activewear, top notch stitching, and reliable delivery every single time.",
      name: "Rajesh Sharma",
      role: "Retail Chain Owner, Delhi",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      stars: 5
    },
    {
      quote: "The fabric is incredibly soft and breathable for active kids. After multiple washes, colors stay vibrant and shapes remain perfect!",
      name: "Priya Mehta",
      role: "Parent & Kids Blogger",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
      stars: 5
    },
    {
      quote: "Our sports club ordered custom athletic sets for 120 kids. Every single set fitted perfectly. Will definitely reorder next season!",
      name: "David Miller",
      role: "Youth Athletics Coordinator",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
      stars: 5
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Your Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile Number is required';
    if (!formData.email.trim()) newErrors.email = 'Email Address is required';
    if (!formData.comment.trim()) newErrors.comment = 'Comment/Inquiry is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsModalOpen(true);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen font-sans text-slate-900 overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative w-full pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF9F5] to-[#F3F1E9]">
        
        {/* Subtle geometric floaters */}
        <div className="absolute top-12 left-10 w-16 h-16 bg-[#FF5500]/10 rounded-2xl rotate-12 blur-sm pointer-events-none"></div>
        <div className="absolute top-1/3 right-12 w-24 h-24 bg-[#FF5500]/20 rounded-3xl -rotate-12 blur-md pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column (Headline + CTA) */}
            <div className="lg:col-span-6 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/90 border border-slate-200/80 px-4 py-2 rounded-full shadow-xs"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700 tracking-wide">New Spring 2026 Collection • 24/7 Support</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-[4.2rem] font-black tracking-tight text-slate-900 leading-[1.08]"
              >
                Reflect Who<br />
                You Are with<br />
                Our <span className="text-[#FF5500]">Style</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-600 font-medium text-base sm:text-lg leading-relaxed max-w-lg"
              >
                The season of growth has arrived. Reflect who you are with our premium kids activewear collection and dedicated support team.
              </motion.p>

              {/* Email Subscribe / Quick Message bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch gap-2 max-w-md bg-white rounded-2xl sm:rounded-full border border-slate-200/80 p-1.5 shadow-md"
              >
                <input
                  type="email"
                  placeholder="Try typing your email..."
                  className="flex-1 px-5 py-3 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button 
                  onClick={() => {
                    const el = document.getElementById('contact-form');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#FF5500] text-white px-6 py-3 rounded-xl sm:rounded-full font-bold text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/30 cursor-pointer"
                >
                  Quick Contact
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </motion.div>

              {/* Brand Logos Row */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="pt-6 border-t border-slate-200/60"
              >
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Featured Brands & Partners</p>
                <div className="flex flex-wrap items-center gap-6 sm:gap-10 opacity-75 font-black text-slate-800 text-sm tracking-tighter">
                  <span className="hover:text-[#FF5500] transition-colors cursor-pointer">adidas</span>
                  <span className="hover:text-[#FF5500] transition-colors cursor-pointer">Jordan</span>
                  <span className="hover:text-[#FF5500] transition-colors cursor-pointer">Levi's</span>
                  <span className="text-[#FF5500] font-black cursor-pointer">JOG & JOY</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column (Floating Photo Grid Matrix - 4F WEARS Style) */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              
              {/* Main Model Showcase Box with Orange Accents */}
              <div className="relative w-full max-w-[500px]">
                
                {/* Floating Orange Block (Background accent) */}
                <div className="absolute -top-4 -right-4 w-28 h-28 bg-[#FF5500] rounded-3xl z-0"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#FF5500]/80 rounded-2xl z-0"></div>

                {/* Main Hero Card Grid */}
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  
                  {/* Card 1: Top Left Big Image */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="relative col-span-2 sm:col-span-1 rounded-3xl overflow-hidden shadow-xl border-4 border-white h-[280px]"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" 
                      alt="Jog & Joy Vibrant Activewear" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-950/70 via-transparent to-transparent p-4 flex flex-col justify-end">
                      <span className="bg-[#FF5500] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider w-max mb-1">
                        Orange Series
                      </span>
                      <p className="text-white font-bold text-sm">Pink Soda Tracksuit</p>
                    </div>
                  </motion.div>

                  {/* Card 2: Right Top Image */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="relative hidden sm:block rounded-3xl overflow-hidden shadow-xl border-4 border-white h-[280px]"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1483721074892-4a85d909158a?q=80&w=800&auto=format&fit=crop" 
                      alt="Adidas Hoodie Style" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-transparent to-transparent p-4 flex flex-col justify-end">
                      <span className="bg-[#00A3E0] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider w-max mb-1">
                        Best Fit
                      </span>
                      <p className="text-white font-bold text-sm">Hoodie Collection</p>
                    </div>
                  </motion.div>
                </div>

                {/* Floating Response Speed Widget Overlay */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-4 right-4 sm:-right-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-[240px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Response Time</p>
                    <p className="text-sm font-black text-slate-900">&lt; 5 Minutes</p>
                  </div>
                </motion.div>

                {/* Floating 24/7 Agent Badge (Top Left) */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -top-6 left-4 z-20 bg-[#FF5500] text-white p-3 px-4 rounded-2xl shadow-xl flex items-center gap-3"
                >
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-amber-300"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-300 absolute inset-0 animate-ping opacity-75"></div>
                  </div>
                  <span className="text-xs font-bold tracking-wide">Live Support Online</span>
                </motion.div>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* --- IDENTITY BANNER SECTION (4F WEARS Style) --- */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5500]">Our Core Purpose</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                We Provide The Best Outfit to Help You <span className="text-[#FF5500]">Express</span> Your Identity
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed max-w-xl text-base">
                From vibrant kids activewear to high-durability school sports kits, Jog & Joy empowers active youngsters across India with maximum comfort, dynamic stretch, and bold style.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-slate-200/80 flex flex-col justify-between hover:border-[#FF5500]/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5500] text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-orange-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">100% Quality</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Breathable anti-microbial active fabrics.</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#00A3E0] text-white flex flex-col justify-between hover:bg-sky-600 transition-colors shadow-md shadow-sky-500/20">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold mb-6">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">15+ States</h3>
                  <p className="text-xs text-sky-100 mt-1 font-medium">Nationwide distributor network delivery.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- INQUIRY CHANNELS / SUPPORT COLLECTIONS SECTION --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5500]">Support Collections</span>
            <h2 className="text-4xl font-black text-slate-900 mt-1">Choose Your Channel</h2>
            <p className="text-slate-500 font-medium text-sm mt-2 max-w-md">Select how you'd like to get in touch with our specialized support team.</p>
          </div>

          <a 
            href="#contact-form" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#FF5500] transition-colors"
          >
            See form details <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="relative h-60 rounded-2xl overflow-hidden mb-6">
              <img 
                src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop" 
                alt="Sweatshirt Collections" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-slate-900 shadow-xs">
                Bulk Orders
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Wholesale & Distributor</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 mb-6">Inquire about bulk pricing, catalog requests, and dealership inquiries.</p>
              
              <a 
                href="#contact-form"
                onClick={() => setFormData(prev => ({ ...prev, inquiryType: 'wholesale' }))}
                className="flex items-center justify-between p-3 px-4 bg-orange-50/80 rounded-xl hover:bg-[#FF5500] hover:text-white transition-all text-slate-900 font-bold text-sm group"
              >
                <span>Wholesale Inquiry</span>
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#FF5500] shadow-xs group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="relative h-60 rounded-2xl overflow-hidden mb-6">
              <img 
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop" 
                alt="Adidas Hoodie Collections" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#FF5500] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-xs">
                Fast Help
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Customer Support</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 mb-6">Assistance with existing orders, size exchanges, or shipment tracking.</p>
              
              <a 
                href="#contact-form"
                onClick={() => setFormData(prev => ({ ...prev, inquiryType: 'support' }))}
                className="flex items-center justify-between p-3 px-4 bg-orange-50/80 rounded-xl hover:bg-[#FF5500] hover:text-white transition-all text-slate-900 font-bold text-sm group"
              >
                <span>Order Support</span>
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#FF5500] shadow-xs group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between md:col-span-2 lg:col-span-1"
          >
            <div className="relative h-60 rounded-2xl overflow-hidden mb-6">
              <img 
                src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop" 
                alt="Active Wear Fitting" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#00A3E0] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-xs">
                Head Office
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Store & Head Office</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 mb-6">Visit our head office in Ahmedabad or schedule a showroom walkthrough.</p>
              
              <a 
                href="tel:917922139665"
                className="flex items-center justify-between p-3 px-4 bg-orange-50/80 rounded-xl hover:bg-[#FF5500] hover:text-white transition-all text-slate-900 font-bold text-sm group"
              >
                <span>Call +91-79-2213 9665</span>
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#FF5500] shadow-xs group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </span>
              </a>
            </div>
          </motion.div>

        </div>
      </section>


      {/* --- MAIN CONTACT FORM & DIRECT CARDS SECTION --- */}
      <section id="contact-form" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Direct Info Cards */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5500]">Direct Connect</span>
                <h2 className="text-4xl font-black text-slate-900 mt-1">Get In Touch With Us</h2>
                <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
                  Have questions about our kids activewear line or want to place a custom order? Fill out the form or reach out directly.
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Phone Card */}
                <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-slate-200/80 hover:border-[#FF5500]/40 transition-colors flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5500] text-white flex items-center justify-center shrink-0 font-bold shadow-md shadow-orange-500/20">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Call Us Directly</h4>
                    <p className="text-lg font-black text-slate-900 mt-0.5">+91 79-2213 9665</p>
                    <p className="text-xs text-slate-500 font-medium">Mon - Sat: 10:00 AM - 7:00 PM IST</p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-slate-200/80 hover:border-[#FF5500]/40 transition-colors flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#00A3E0] text-white flex items-center justify-center shrink-0 font-bold shadow-md shadow-sky-500/20">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Email Support</h4>
                    <p className="text-lg font-black text-slate-900 mt-0.5">info@jognjoy.com</p>
                    <p className="text-xs text-slate-500 font-medium">Fast response within 24 business hours</p>
                  </div>
                </div>

                {/* Location Card */}
                <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-slate-200/80 hover:border-[#FF5500]/40 transition-colors flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold shadow-md shadow-emerald-500/20">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Head Office Location</h4>
                    <p className="text-sm font-black text-slate-900 mt-0.5 leading-snug">
                      488, Navo Vas, Swaminarayan Mandir, Kalupur, Ahmedabad 380001, Gujarat, India.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Playful Childish Registration / Contact Form */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-7 relative bg-gradient-to-br from-[#FFF9F2] via-[#FFF3EA] to-[#FFEBE0] p-8 sm:p-12 rounded-[2.5rem] border-4 border-dashed border-[#FF7A00]/30 shadow-2xl overflow-hidden"
            >
              {/* Floating Background SVG Doodles */}
              <div className="absolute top-4 right-6 pointer-events-none animate-bounce">
                <SparkleDoodle className="w-8 h-8 text-amber-400" />
              </div>
              <div className="absolute top-12 left-8 pointer-events-none">
                <CloudDoodle className="w-14 h-9 text-sky-300" />
              </div>
              <div className="absolute bottom-6 right-10 pointer-events-none hidden sm:block">
                <RocketDoodle className="w-12 h-12 text-[#FF5500]" />
              </div>
              <div className="absolute bottom-20 left-4 pointer-events-none opacity-80">
                <SquiggleDoodle className="w-20 h-5 text-orange-400" />
              </div>
              <div className="absolute top-1/2 -right-4 pointer-events-none opacity-40 rotate-45">
                <SparkleDoodle className="w-12 h-12 text-[#00A3E0]" />
              </div>

              {/* Form Header with Playful Crown & Smiley */}
              <div className="mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 bg-amber-200/70 text-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
                  <CrownDoodle className="w-4 h-3 text-amber-600" />
                  <span>Kid-Friendly Fast Support 🚀</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Send Us a Message
                  </h3>
                  <SmileyDoodle className="w-9 h-9 shrink-0" />
                </div>

                <p className="text-sm font-bold text-slate-600 mt-2 flex items-center gap-2">
                  <span>Fill out this fun form and our activewear team will zoom back to you!</span>
                  <SparkleDoodle className="w-4 h-4 text-amber-500 inline" />
                </p>
              </div>

              {/* Form Input Grid */}
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <span>Your Name</span>
                      <span className="text-[#FF5500] font-black">*</span>
                    </label>
                    <Input
                      variant="playful"
                      name="name"
                      placeholder="e.g. Anand Shah"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      className="bg-white border-2 border-orange-200/80 rounded-2xl text-slate-900 font-bold placeholder-slate-400 focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/15 shadow-sm text-sm py-3.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <span>Mobile Number</span>
                      <span className="text-[#FF5500] font-black">*</span>
                    </label>
                    <Input
                      variant="playful"
                      name="mobile"
                      placeholder="+91 98765 43210"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      error={errors.mobile}
                      className="bg-white border-2 border-orange-200/80 rounded-2xl text-slate-900 font-bold placeholder-slate-400 focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/15 shadow-sm text-sm py-3.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <span>E-mail Address</span>
                      <span className="text-[#FF5500] font-black">*</span>
                    </label>
                    <Input
                      variant="playful"
                      name="email"
                      type="email"
                      placeholder="anand@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      className="bg-white border-2 border-orange-200/80 rounded-2xl text-slate-900 font-bold placeholder-slate-400 focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/15 shadow-sm text-sm py-3.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <span>Inquiry Type</span>
                    </label>
                    <CustomDropdown
                      options={inquiryOptions}
                      value={formData.inquiryType}
                      onChange={(val) => setFormData(prev => ({ ...prev, inquiryType: val }))}
                      className="w-full"
                      buttonClassName="w-full py-3.5 px-4 bg-white border-2 border-[#FFE0D6] rounded-2xl text-slate-900 font-extrabold text-sm hover:border-[#FF7A59]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <span>Comment / Inquiry</span>
                    <span className="text-[#FF5500] font-black">*</span>
                  </label>
                  <Textarea
                    variant="playful"
                    name="comment"
                    placeholder="How can we help your store or kids activewear order today?"
                    required
                    value={formData.comment}
                    onChange={handleChange}
                    error={errors.comment}
                    className="bg-white border-2 border-orange-200/80 rounded-2xl text-slate-900 font-bold placeholder-slate-400 focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/15 shadow-sm text-sm py-3.5"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <motion.button 
                    type="submit" 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-[#FF5500] via-[#FF6B00] to-[#FF4500] text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-3 cursor-pointer group border-2 border-white/40"
                  >
                    <span>Submit Message</span>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                  </motion.button>
                </div>

              </form>
            </motion.div>

          </div>

        </div>
      </section>


      {/* --- ASYMMETRIC FEATURED GRID --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5500]">Featured Locations & Network</span>
          <h2 className="text-4xl font-black text-slate-900 mt-1">Our Nationwide Footprint</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Tall Card: Head Office Flagship */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden min-h-[420px] bg-slate-900 group shadow-xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop" 
              alt="Hoodie Collection Flagship Store" 
              className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-8 flex flex-col justify-end">
              <span className="bg-[#FF7A59] text-white text-xs font-black px-3.5 py-1.5 rounded-full w-max uppercase tracking-wider mb-3 shadow-md">
                Flagship Office
              </span>
              <h3 className="text-3xl font-black text-white">Ahmedabad HQ & Showroom</h3>
              <p className="text-slate-200 text-sm font-medium mt-2 max-w-md">
                Visit our experience center in Kalupur to feel the fabric quality, check color options, and consult with our production team.
              </p>
              <div className="mt-6 flex items-center gap-2 text-white text-sm font-bold group-hover:translate-x-2 transition-transform">
                <span>View Directions</span>
                <ArrowRight className="w-4 h-4 text-[#FF7A59]" />
              </div>
            </div>
          </div>

          {/* Right Column: 2 Stacked Cards */}
          <div className="lg:col-span-6 grid grid-rows-2 gap-8">
            
            {/* Top Wide Card: Distributor Network */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 p-8 flex flex-col justify-between shadow-xl text-white group">
              <img 
                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop" 
                alt="Pants Collections" 
                className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-0"></div>
              <div className="relative z-10">
                <span className="bg-[#AEE6FF] text-slate-900 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  Distributor Network
                </span>
                <h3 className="text-2xl font-black text-white mt-4">100+ Authorized Retail Partners</h3>
                <p className="text-slate-200 text-xs sm:text-sm font-medium mt-1">Available across leading apparel stores in Gujarat, Maharashtra, Rajasthan, and MP.</p>
              </div>
              <div className="relative z-10 pt-4">
                <span className="text-xs font-extrabold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Partnership <ChevronRight className="w-4 h-4 text-[#AEE6FF]" />
                </span>
              </div>
            </div>

            {/* Bottom Wide Card: Fit Guarantee */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FF6B00] to-[#FF4500] p-8 text-white flex flex-col justify-between shadow-xl">
              <div>
                <span className="bg-white text-[#FF5500] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  Jog & Joy Guarantee
                </span>
                <h3 className="text-2xl font-black text-white mt-4">Hassle-Free Size Exchanges</h3>
                <p className="text-orange-100 text-xs sm:text-sm font-medium mt-1">We ensure your kids get the exact comfortable fit every single time.</p>
              </div>
              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-extrabold tracking-wider uppercase text-white/90">Activewear Tested for Motion</span>
                <div className="w-8 h-8 rounded-full bg-white text-[#FF5500] flex items-center justify-center font-bold shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* --- CUSTOMER TESTIMONIALS SECTION (Infinite Marquee Carousel) --- */}
      <section className="py-20 bg-gradient-to-b from-[#FFF5EC] via-[#FFEFE4] to-[#FFF8F2] border-y border-orange-200/60 overflow-hidden">
        
        {/* Inline CSS animation for smooth infinite marquee */}
        <style>{`
          @keyframes testimonial-marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-testimonial-marquee {
            animation: testimonial-marquee 35s linear infinite;
          }
          .animate-testimonial-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5500]">Our Testimonials</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">Our Satisfied Customer Reviews</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Real feedback from parents, academies, and retail partners.</p>
            </div>

            {/* Marquee Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-200 shadow-xs text-xs font-bold text-slate-700 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Reviews • Hover to Pause</span>
            </div>
          </div>
        </div>

        {/* Infinite Marquee Track */}
        <div className="w-full overflow-hidden py-4 select-none">
          <div className="flex space-x-6 w-max animate-testimonial-marquee">
            {[...testimonials, ...testimonials, ...testimonials].map((item, idx) => (
              <div 
                key={idx}
                className="w-[340px] sm:w-[440px] bg-white p-8 rounded-[2.5rem] border-2 border-orange-200/80 shadow-md hover:shadow-2xl hover:border-[#FF5500] transition-all duration-300 flex flex-col justify-between space-y-6 shrink-0 group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-serif text-[#FF5500] opacity-80 leading-none group-hover:scale-110 transition-transform">“</div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                
                <p className="text-slate-800 text-base sm:text-lg font-bold leading-relaxed">
                  "{item.quote}"
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-orange-100">
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF5500] shadow-sm group-hover:scale-105 transition-transform"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"; }}
                  />
                  <div className="text-left">
                    <h4 className="text-base font-black text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-bold">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>


      {/* --- GET TO KNOW MORE ABOUT US (Video Banner & Modal) --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5500]">Our Story</span>
            <h2 className="text-4xl font-black text-slate-900 mt-1">Get to Know More About Us</h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Founded with a passion for vibrant children's sportswear, Jog & Joy combines premium quality fabrics, ergonomic active design, and vibrant color palettes so every child feels confident.
            </p>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative w-full h-[400px] sm:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white">
          <img 
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop" 
            alt="Jog and Joy Brand Story" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center">
            
            {/* Pulsing Play Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoOpen(true)}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-[#FF5500] flex items-center justify-center shadow-2xl cursor-pointer"
            >
              <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-30"></div>
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-[#FF5500] translate-x-0.5" />
            </motion.button>

          </div>
        </div>

      </section>


      {/* --- INFINITE TICKER / NEWSLETTER MARQUEE BANNER --- */}
      <section className="bg-gradient-to-r from-[#FF5500] via-[#FF6B00] to-[#FF4500] text-white py-5 overflow-hidden shadow-inner">
        <div className="flex whitespace-nowrap animate-marquee font-black text-xl sm:text-2xl uppercase tracking-wider gap-8 items-center">
          <span>+ Join Our Newsletter</span>
          <span>+ Fast Nationwide Delivery</span>
          <span>+ Premium Kids Activewear</span>
          <span>+ 24/7 Support Service</span>
          <span>+ Join Our Newsletter</span>
          <span>+ Fast Nationwide Delivery</span>
          <span>+ Premium Kids Activewear</span>
          <span>+ 24/7 Support Service</span>
        </div>
      </section>


      {/* --- MODALS --- */}
      {/* 1. Form Success Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({ name: '', mobile: '', email: '', inquiryType: 'general', comment: '' });
        }}
        title="Message Received!"
        message={`Thank you, ${formData.name}! Your inquiry has been logged with Jog&Joy support. We will get back to you shortly at ${formData.email}.`}
      />

      {/* 2. Brand Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FF5500]">
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 text-slate-800 bg-orange-100 hover:bg-[#FF5500] hover:text-white p-2 rounded-full transition-colors z-10 cursor-pointer shadow-md"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="aspect-video w-full flex items-center justify-center bg-gradient-to-br from-[#FFF9F2] to-[#FFEBE0] p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FF5500] flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/30">
                    <Play className="w-8 h-8 fill-white translate-x-0.5" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Jog & Joy Brand Film</h3>
                  <p className="text-slate-600 font-semibold text-sm max-w-md mx-auto">
                    Take a behind-the-scenes look at our activewear manufacturing process and craftsmanship in Ahmedabad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
