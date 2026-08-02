import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input, Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    comment: ''
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      
      {/* --- p.Bank Style HERO SECTION --- */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
        
        {/* Subtle Background Pattern (Curved lines) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="black" strokeWidth="0.5" />
            <path d="M0,70 Q25,40 50,70 T100,70" fill="none" stroke="black" strokeWidth="0.5" />
            <path d="M0,30 Q25,0 50,30 T100,30" fill="none" stroke="black" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 text-purple-700 font-bold text-sm tracking-wide">
              <span className="text-xl">✦</span> 24/7 Dedicated Support
            </div>
            
            <h1 className="text-5xl lg:text-[4rem] font-black tracking-tight text-slate-900 leading-[1.1]">
              The Best<br />Support<br />Experience
            </h1>
            
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
              Need help with a kids activewear order, wholesale inquiry, or finding the perfect fit? We are here to assist you instantly.
            </p>
            
            {/* Input + Button Row */}
            <div className="flex w-full max-w-md bg-white rounded-full border border-slate-200 p-1 shadow-sm">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 bg-transparent outline-none text-slate-700 placeholder-slate-400"
              />
              <button className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-slate-800 transition-colors">
                Get Started
              </button>
            </div>

            {/* Quick Connect Widget */}
            <div className="pt-6">
              <p className="text-sm font-bold text-slate-800 mb-4">Send Message to</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 rounded-2xl bg-slate-900 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/20 hover:-translate-y-1 transition-transform">
                  <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-white">
                    +
                  </div>
                  <span className="text-[10px] text-white font-bold text-center leading-tight">Add new<br/>contact</span>
                </div>
                
                <div className="w-16 h-20 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    J
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold text-center leading-tight">Sales<br/>Team</span>
                </div>

                <div className="w-16 h-20 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:-translate-y-1 transition-transform shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="Support" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold text-center leading-tight">Kiely<br/>Mae</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column (Visuals - Arch & Person) */}
          <div className="lg:col-span-5 relative flex justify-center items-end h-[600px]">
            {/* The Arch Shape */}
            <div className="absolute bottom-0 w-[320px] h-[480px] bg-[#89A894] rounded-t-[200px] z-0"></div>
            
            {/* The Person (Using an image inside the arch container if cutout isn't available, but we'll use a cutout-style portrait) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 w-full max-w-[400px] flex justify-center pb-0"
            >
              {/* Note: In a real environment we'd use a transparent PNG. We use a high-quality portrait here. */}
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" 
                alt="Support Agent" 
                className="w-[300px] h-[400px] object-cover object-top rounded-t-[150px] rounded-b-2xl shadow-xl border-4 border-white/20"
              />
            </motion.div>

            {/* Floating UI Card 1 (Top Right) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/4 right-0 z-20 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 w-48"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=100&auto=format&fit=crop" alt="Amazon" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Wholesale</p>
                <p className="text-[10px] text-slate-400">Order Confirmed</p>
              </div>
              <div className="ml-auto text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+ 5s</div>
            </motion.div>

            {/* Floating UI Card 2 (Middle Left) */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -left-10 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-slate-100 min-w-[140px]"
            >
              <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Avg Response</p>
              <p className="text-lg font-black text-slate-900">&lt; 5 mins</p>
              <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Stats) */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-12 lg:pl-4">
            <div>
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                World Class<br />Experts
              </h2>
            </div>
            
            <div>
              <h3 className="text-4xl font-black text-slate-900 mb-2">77k+</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Happy customers and activewear partners successfully served.
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-slate-900 mb-2">0%</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Compromise on the quality of support and our response time.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Call Us Directly</h3>
            <p className="text-sm font-bold text-slate-700">91-79-2213 9665</p>
            <p className="text-xs text-slate-400 font-medium">Mon - Sat: 10:00 AM - 7:00 PM IST</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Email Support</h3>
            <p className="text-sm font-bold text-slate-700">info@jognjoy.com</p>
            <p className="text-xs text-slate-400 font-medium">Fast response within 24 business hours</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Head Office</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
              488, Navo Vas, Swaminarayan Mandir, Kalupur, Ahmedabad 380001. Gujarat, India.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md max-w-3xl mx-auto">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-sky-500 w-6 h-6" /> Send Us a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Your Name"
                name="name"
                placeholder="Anand Shah"
                required
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <Input
                label="Mobile Number"
                name="mobile"
                placeholder="+91 98765 43210"
                required
                value={formData.mobile}
                onChange={handleChange}
                error={errors.mobile}
              />
            </div>

            <Input
              label="E-mail Address"
              name="email"
              type="email"
              placeholder="anand@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Textarea
              label="Comment / Inquiry"
              name="comment"
              placeholder="How can we help your store or order today?"
              required
              value={formData.comment}
              onChange={handleChange}
              error={errors.comment}
            />

            <Button type="submit" variant="sky" size="lg" icon={Send} className="w-full shadow-lg shadow-sky-500/20">
              Submit Message
            </Button>
          </form>
        </div>

      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({ name: '', mobile: '', email: '', comment: '' });
        }}
        title="Message Received!"
        message={`Thank you, ${formData.name}! Your inquiry has been logged with Jog&Joy support. We will get back to you shortly.`}
      />
    </div>
  );
}
