import React, { useState } from 'react';
import { Mail, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-[#FFF8EC] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] bg-gradient-to-r from-[#AEE6FF] via-[#E6D6FF] to-[#FFD6BA] p-8 sm:p-12 text-slate-900 shadow-2xl relative overflow-hidden border border-white/60">
          
          <div className="relative z-10 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#EF4A45] flex items-center justify-center mx-auto shadow-md">
              <Mail className="w-6 h-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Get <span className="text-[#EF4A45]">₹200 OFF</span> Your First Order!
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
              Subscribe to our fun newsletter for exclusive drop alerts, secret flash sales, and parenting tips.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs flex items-center justify-center gap-2 animate-in fade-in shadow-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>🎉 Hurray! You're subscribed. Use code <strong>WELCOME200</strong> on checkout!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 rounded-full bg-white text-slate-900 font-bold text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EF4A45] shadow-sm"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-[#EF4A45] text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-all shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            <p className="text-[11px] text-slate-500 font-bold">
              🔒 No spam ever. Unsubscribe anytime with 1 click.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
