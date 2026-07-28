import React from 'react';

export function Input({ label, error, required, variant = 'dark', className = '', ...props }) {
  const baseInputStyles = "w-full px-4 py-3 rounded-2xl transition-all duration-200 focus:outline-none";
  
  const variants = {
    dark: "bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00]",
    light: "bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 shadow-xs",
    playful: "bg-white border-2 border-orange-200 text-slate-900 placeholder-slate-400 focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/20 shadow-sm font-medium"
  };

  const labelVariants = {
    dark: "text-gray-300",
    light: "text-slate-700 font-bold",
    playful: "text-slate-800 font-extrabold"
  };

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-xs uppercase tracking-wider mb-2 ${labelVariants[variant] || labelVariants.dark}`}>
          {label} {required && <span className="text-[#FF5500] font-black">*</span>}
        </label>
      )}
      <input
        className={`${baseInputStyles} ${variants[variant] || variants.dark} ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1">⚠️ {error}</p>}
    </div>
  );
}

export function Textarea({ label, error, required, variant = 'dark', rows = 4, className = '', ...props }) {
  const baseInputStyles = "w-full px-4 py-3 rounded-2xl transition-all duration-200 focus:outline-none";

  const variants = {
    dark: "bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00]",
    light: "bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/10 shadow-xs",
    playful: "bg-white border-2 border-orange-200 text-slate-900 placeholder-slate-400 focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/20 shadow-sm font-medium"
  };

  const labelVariants = {
    dark: "text-gray-300",
    light: "text-slate-700 font-bold",
    playful: "text-slate-800 font-extrabold"
  };

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-xs uppercase tracking-wider mb-2 ${labelVariants[variant] || labelVariants.dark}`}>
          {label} {required && <span className="text-[#FF5500] font-black">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={`${baseInputStyles} ${variants[variant] || variants.dark} ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1">⚠️ {error}</p>}
    </div>
  );
}
