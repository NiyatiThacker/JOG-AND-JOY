import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Palette, TrendingUp, Scissors, User, Building, ArrowRight, Sparkles } from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import FloatingElements from '../components/ui/FloatingElements';

const stats = [
  { value: 30, suffix: '+', label: 'Years Experience', color: 'text-purple-600' },
  { value: 1, suffix: 'M+', label: 'Happy Customers', color: 'text-amber-500' },
  { value: 500, suffix: '+', label: 'Retail Partners', color: 'text-sky-500' },
  { value: 100, suffix: '%', label: 'Bio-Washed Cotton', color: 'text-emerald-500' }
];

const teamMembers = [
  { name: 'Ashwin Bhai K Shah', role: 'Founder & Visionary', image: 'https://ui-avatars.com/api/?name=Ashwin+Shah&background=D8C7FF&color=000&size=300' },
  { name: 'Vaishal A Shah', role: 'Managing Director', image: 'https://ui-avatars.com/api/?name=Vaishal+Shah&background=A7D8FF&color=000&size=300' }
];

export default function AboutUs() {
  return (
    <div className="bg-[#FFF8F0] min-h-screen font-sans overflow-x-hidden relative">
      <FloatingElements />

      {/* 1. Video Reference Hero Section */}
      <section className="pt-6 pb-8 px-4 relative z-10 overflow-hidden bg-[#F8F9FA]">

        {/* Main White Container Card */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 w-full max-w-7xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col border border-slate-100">

          {/* Center Text Content */}
          <div className="text-center max-w-3xl mx-auto mb-4 px-4 relative z-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-medium text-slate-900 tracking-tight mb-3 font-serif">
              Our Story of Quality <br />and True Comfort
            </h1>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto">
              Showcase your true self with our distinctive activewear collection that blends vibrant style and everyday durability.
            </p>
          </div>

          {/* Image Slider / Marquee with Curved Masks */}
          <div className="relative w-full overflow-hidden mb-6 flex items-center bg-[#F8F9FA] h-[160px] md:h-[200px]">

            {/* Top Curved Mask (White to match card bg) */}
            <div className="absolute top-[-2px] left-[-10%] w-[120%] h-[20px] md:h-[40px] bg-white rounded-b-[100%] z-10 pointer-events-none" />

            {/* Bottom Curved Mask (White to match card bg) */}
            <div className="absolute bottom-[-2px] left-[-10%] w-[120%] h-[20px] md:h-[40px] bg-white rounded-t-[100%] z-10 pointer-events-none" />

            {/* Scrolling Images */}
            <motion.div
              className="flex gap-4 md:gap-6 min-w-max py-2 px-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            >
              {[
                "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1519238396255-81b670474ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1519238396255-81b670474ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
              ].map((src, idx) => (
                <div key={idx} className="h-[120px] w-[100px] md:h-[160px] md:w-[130px] rounded-xl overflow-hidden shrink-0 group">
                  <img
                    src={src}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={`Jog&Joy Collection ${idx}`}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom Widgets */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 gap-8 mt-auto relative z-20">

            {/* Left: Reviews / Customers */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex -space-x-3">
                <img src="https://ui-avatars.com/api/?name=User+1&background=D8C7FF&color=000" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Customer" />
                <img src="https://ui-avatars.com/api/?name=User+2&background=A7D8FF&color=000" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Customer" />
                <img src="https://ui-avatars.com/api/?name=User+3&background=B8F2D0&color=000" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Customer" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-bold text-slate-900 text-sm">1M+ Happy Customers</p>
                <p className="text-xs text-slate-500 font-medium">Trusted nationwide</p>
              </div>
            </div>

            {/* Center: Explore More */}
            <div
              className="flex flex-col items-center cursor-pointer group flex-1"
              onClick={() => document.getElementById('who-we-are')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="font-bold text-slate-900 text-sm mb-3 group-hover:text-purple-600 transition-colors">Explore More</span>
              <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-slate-300 group-hover:bg-slate-50 transition-colors">
                <ArrowRight className="w-5 h-5 text-slate-600 rotate-90" />
              </div>
            </div>

            {/* Right: Empty div to balance flex-1 */}
            <div className="flex-1 hidden md:block"></div>

          </div>
        </div>
      </section>

      {/* 2. Split Hero & Quote (Playful Edit) */}
      <section id="who-we-are" className="py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

          {/* Left: Image & Quote */}
          <div className="relative pl-4 lg:pl-8">
            {/* Background Blob decoration */}
            <div className="absolute top-4 -left-4 w-full h-full bg-sky-200 rounded-[3rem] rotate-3" />

            <div className="relative rounded-[3rem] overflow-hidden aspect-4/5 sm:aspect-square lg:aspect-4/5 shadow-xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Jog and Joy Manufacturing"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlapping Quote Bubble */}
            <div className="absolute top-1/2 -right-4 lg:-right-12 -translate-y-1/2 bg-white p-6 sm:p-8 shadow-2xl rounded-3xl border-2 border-amber-200 max-w-[280px] transform hover:scale-105 transition-transform">
              <p className="text-slate-900 font-black text-lg sm:text-xl leading-snug mb-3">
                "Quality is non-negotiable. Comfort is our core."
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-purple-600">Ashwin Bhai K Shah</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:pl-12 space-y-6">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-black uppercase tracking-widest">Who We Are</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Activewear is about <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-purple-600">freedom</span>, not just fabric.
            </h2>
            <p className="text-slate-600 text-base font-medium leading-relaxed">
              We started our journey in 1996 with a singular focus on perfect knitting and stitching. Today, Jog&Joy brings vibrant, durable, and extremely comfortable activewear directly to the next generation of kids and men.
            </p>

            <div className="pt-4 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">Bio-Washed Cotton</h4>
                  <p className="text-slate-600 text-sm font-medium mt-1">We use 100% bio-washed combed cotton to ensure zero toxicity, ultimate softness, and zero shrinkage.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">High-Volume Production</h4>
                  <p className="text-slate-600 text-sm font-medium mt-1">State-of-the-art facilities allow us to maintain a massive inventory, ready to supply our network immediately.</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Discover More <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Statistics Bar */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex-1 text-center w-full py-4 md:py-0">
              <div className={`text-5xl md:text-6xl font-black mb-2 flex items-center justify-center ${stat.color}`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Vibrant CTA Section */}
      <section className="relative py-32 md:py-48 mt-12 bg-[url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-fixed bg-cover bg-center rounded-3xl mx-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-purple-900/90 to-sky-900/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 text-white space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-widest backdrop-blur-sm shadow-sm">
            Partner With Us
          </span>
          <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Grow your retail business with our high-demand apparel
          </h2>
          <p className="text-lg text-white/80 font-medium max-w-2xl mx-auto">
            Join our rapidly expanding network of wholesale distributors. Enjoy high margins, dedicated brand support, and a product that sells itself.
          </p>
          <div className="pt-8">
            <Link to="/distributor-network" className="inline-block px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-full shadow-[0_10px_40px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_50px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all">
              Become a Distributor
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Overlapping Feature Cards */}
      <section className="px-4 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 -mt-20">

          <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform border-b-4 border-sky-400">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-500 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mt-2">Kids Focus</h4>
            <p className="text-sm font-medium text-slate-600">Empowering play with bright, non-toxic kids activewear at great wholesale price points.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform border-b-4 border-emerald-400">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-500 flex items-center justify-center">
              <Scissors className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mt-2">Quality Guarantee</h4>
            <p className="text-sm font-medium text-slate-600">Multi-needle flatlock stitching and colorfast dyes guarantee long-lasting durability.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform border-b-4 border-purple-400">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-500 flex items-center justify-center">
              <Building className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mt-2">Distributor First</h4>
            <p className="text-sm font-medium text-slate-600">Building transparent, highly profitable wholesale partnerships backed by fast logistics.</p>
          </div>

        </div>
      </section>

      {/* 6. Meet Our Team */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-black uppercase tracking-widest">Meet Our Founders</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              We serve uniqueness because <br />you are unique to us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-3xl mx-auto">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all group overflow-hidden border border-slate-100 p-4">
                <div className="aspect-square bg-slate-100 rounded-4xl overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-black text-slate-900">{member.name}</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mt-2 mb-4">{member.role}</p>

                  <div className="flex items-center justify-center gap-3">
                    <a href="#" className="w-10 h-10 rounded-full bg-[#FFF8F0] text-purple-500 flex items-center justify-center hover:bg-purple-500 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" /></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-[#FFF8F0] text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Logos Section */}
      <section className="py-16 px-4 bg-white relative z-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-auto text-center md:text-left">
            <h4 className="text-2xl font-black text-slate-900 leading-tight">
              Our Trusted<br /><span className="text-purple-600">Retail Partners</span>
            </h4>
          </div>

          <div className="flex-1 w-full overflow-hidden relative">
            {/* Gradient masks for smooth fading edges on marquee */}
            <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <motion.div
              className="flex items-center gap-16 md:gap-24 min-w-max text-slate-400 opacity-70 hover:opacity-100 transition-opacity duration-500"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 25, repeat: Infinity }}
            >
              {[1, 2].map((_, index) => (
                <React.Fragment key={index}>
                  <span className="text-3xl md:text-4xl font-black tracking-tighter text-blue-600 grayscale hover:grayscale-0 transition-all cursor-pointer">firstcry</span>
                  <span className="text-3xl md:text-4xl font-black italic tracking-widest text-pink-500 grayscale hover:grayscale-0 transition-all cursor-pointer">Myntra</span>
                  <span className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-amber-500 grayscale hover:grayscale-0 transition-all cursor-pointer">amazon</span>
                  <span className="text-3xl md:text-4xl font-black tracking-tight text-yellow-500 grayscale hover:grayscale-0 transition-all cursor-pointer">flipkart</span>
                  <span className="text-3xl md:text-4xl font-bold uppercase tracking-[0.2em] text-slate-800 grayscale hover:grayscale-0 transition-all cursor-pointer">AJIO</span>
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
