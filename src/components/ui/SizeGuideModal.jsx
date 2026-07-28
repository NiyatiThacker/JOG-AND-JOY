import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState('cm'); // 'cm' | 'inches'

  if (!isOpen) return null;

  const sizeChart = [
    { age: '0–3 M', size: '0-3M', heightCm: '55–61', weightKg: '4–6', chestCm: '40', waistCm: '39', heightIn: '21–24', weightLbs: '9-13', chestIn: '15.7', waistIn: '15.3' },
    { age: '3–6 M', size: '3-6M', heightCm: '61–67', weightKg: '6–8', chestCm: '42', waistCm: '41', heightIn: '24–26', weightLbs: '13-17', chestIn: '16.5', waistIn: '16.1' },
    { age: '6–12 M', size: '6-12M', heightCm: '67–74', weightKg: '8–10', chestCm: '46', waistCm: '45', heightIn: '26–29', weightLbs: '17-22', chestIn: '18.1', waistIn: '17.7' },
    { age: '1–2 Yrs', size: '1Y-2Y', heightCm: '80-86', weightKg: '10-12', chestCm: '50', waistCm: '49', heightIn: '31-34', weightLbs: '22-26', chestIn: '19.6', waistIn: '19.2' },
    { age: '2–3 Yrs', size: '2Y-3Y', heightCm: '88–96', weightKg: '12-14', chestCm: '54', waistCm: '51', heightIn: '34–38', weightLbs: '26-30', chestIn: '21.2', waistIn: '20.0' },
    { age: '4–5 Yrs', size: '4Y-5Y', heightCm: '104–110', weightKg: '15-18', chestCm: '58', waistCm: '54', heightIn: '41–43', weightLbs: '33-39', chestIn: '22.8', waistIn: '21.2' },
    { age: '6–7 Yrs', size: '6Y-7Y', heightCm: '116–122', weightKg: '20-23', chestCm: '62', waistCm: '57', heightIn: '45–48', weightLbs: '44-50', chestIn: '24.4', waistIn: '22.4' },
    { age: '8–9 Yrs', size: '8Y-9Y', heightCm: '128–134', weightKg: '25-30', chestCm: '66', waistCm: '60', heightIn: '50–53', weightLbs: '55-66', chestIn: '26.0', waistIn: '23.6' },
    { age: '10–12 Yrs', size: '10-12Y', heightCm: '140–152', weightKg: '32-40', chestCm: '74', waistCm: '64', heightIn: '55–60', weightLbs: '70-88', chestIn: '29.1', waistIn: '25.2' }
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
                  <th className="p-3">Age</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Height</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">Chest</th>
                  <th className="p-3">Waist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                {sizeChart.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors whitespace-nowrap">
                    <td className="p-3 font-extrabold text-slate-900">{row.age}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#AEE6FF]/40 text-slate-800 text-[11px] font-black">
                        {row.size}
                      </span>
                    </td>
                    <td className="p-3">{unit === 'cm' ? row.heightCm + ' cm' : row.heightIn + ' in'}</td>
                    <td className="p-3">{unit === 'cm' ? row.weightKg + ' kg' : row.weightLbs + ' lbs'}</td>
                    <td className="p-3">{unit === 'cm' ? row.chestCm + ' cm' : row.chestIn + ' in'}</td>
                    <td className="p-3">{unit === 'cm' ? row.waistCm + ' cm' : row.waistIn + ' in'}</td>
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
