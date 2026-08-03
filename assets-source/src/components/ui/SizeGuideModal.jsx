import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState('cm'); // 'cm' | 'inches'

  if (!isOpen) return null;

  const sizeChart = [
    { age: '0–3 Months', size: '0-3M', chestCm: '40–42', heightCm: '55–61', chestIn: '15.7–16.5', heightIn: '21.6–24' },
    { age: '3–6 Months', size: '3-6M', chestCm: '42–44', heightCm: '61–67', chestIn: '16.5–17.3', heightIn: '24–26.3' },
    { age: '6–12 Months', size: '6-12M', chestCm: '44–46', heightCm: '67–74', chestIn: '17.3–18.1', heightIn: '26.3–29.1' },
    { age: '2–3 Years', size: '2Y-3Y', chestCm: '52–54', heightCm: '88–96', chestIn: '20.5–21.2', heightIn: '34.6–37.7' },
    { age: '4–5 Years', size: '4Y-5Y', chestCm: '56–58', heightCm: '104–110', chestIn: '22–22.8', heightIn: '40.9–43.3' },
    { age: '6–7 Years', size: '6Y-7Y', chestCm: '60–62', heightCm: '116–122', chestIn: '23.6–24.4', heightIn: '45.6–48' },
    { age: '8–9 Years', size: '8Y-9Y', chestCm: '64–66', heightCm: '128–134', chestIn: '25.2–26', heightIn: '50.3–52.7' },
    { age: '10–12 Years', size: '10Y-12Y', chestCm: '70–74', heightCm: '140–152', chestIn: '27.5–29.1', heightIn: '55.1–59.8' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#AEE6FF] text-slate-900 flex items-center justify-center shrink-0">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Kids Official Size Guide 📐
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Standardized measurements for bio-washed combed cotton activewear.
              </p>
            </div>
          </div>

          {/* Unit Toggle Switch */}
          <div className="flex items-center justify-between mb-4 bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" /> Measure comfortably over light clothing
            </span>
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs font-extrabold">
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  unit === 'cm' ? 'bg-[#EF4A45] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  unit === 'inches' ? 'bg-[#EF4A45] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                INCHES
              </button>
            </div>
          </div>

          {/* Size Chart Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFF8EC] text-slate-800 font-black border-b border-amber-100">
                <tr>
                  <th className="p-3">Age Group</th>
                  <th className="p-3">Tag Size</th>
                  <th className="p-3">Chest ({unit.toUpperCase()})</th>
                  <th className="p-3">Height ({unit.toUpperCase()})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                {sizeChart.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-extrabold text-slate-900">{row.age}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#AEE6FF]/40 text-slate-800 text-[11px] font-black">
                        {row.size}
                      </span>
                    </td>
                    <td className="p-3">{unit === 'cm' ? row.chestCm : row.chestIn}</td>
                    <td className="p-3">{unit === 'cm' ? row.heightCm : row.heightIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fit Guarantee Tip */}
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Fit Guarantee:</strong> If the apparel doesn't fit your little one perfectly, enjoy easy 15-day hassle-free size exchanges!
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
