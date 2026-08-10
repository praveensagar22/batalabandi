'use client';

import { X, Ruler } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SizeGuideModal({ isOpen, onClose, category = 'Tops' }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-stone-200 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-xl text-stone-950 font-black">
              <Ruler className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
                Garment Measurement Guide
              </span>
              <h3 className="text-base font-black text-stone-900">{category} Size Chart (Inches)</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="py-4 space-y-3">
          <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-center">
              <thead className="bg-stone-950 text-white text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-2.5 text-left pl-4">Size</th>
                  <th className="p-2.5">Chest (in)</th>
                  <th className="p-2.5">Length (in)</th>
                  <th className="p-2.5">Shoulder (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-stone-800">
                <tr className="hover:bg-yellow-50/50 transition">
                  <td className="p-2.5 font-bold text-left pl-4 font-sans text-stone-950">S (Small)</td>
                  <td className="p-2.5">42"</td>
                  <td className="p-2.5">28"</td>
                  <td className="p-2.5">20"</td>
                </tr>
                <tr className="bg-stone-50/60 hover:bg-yellow-50/50 transition">
                  <td className="p-2.5 font-bold text-left pl-4 font-sans text-stone-950">M (Medium)</td>
                  <td className="p-2.5">44"</td>
                  <td className="p-2.5">29"</td>
                  <td className="p-2.5">21"</td>
                </tr>
                <tr className="hover:bg-yellow-50/50 transition">
                  <td className="p-2.5 font-bold text-left pl-4 font-sans text-stone-950">L (Large)</td>
                  <td className="p-2.5">46"</td>
                  <td className="p-2.5">30"</td>
                  <td className="p-2.5">22"</td>
                </tr>
                <tr className="bg-stone-50/60 hover:bg-yellow-50/50 transition">
                  <td className="p-2.5 font-bold text-left pl-4 font-sans text-stone-950">XL (Extra Large)</td>
                  <td className="p-2.5">48"</td>
                  <td className="p-2.5">31"</td>
                  <td className="p-2.5">23"</td>
                </tr>
                <tr className="hover:bg-yellow-50/50 transition">
                  <td className="p-2.5 font-bold text-left pl-4 font-sans text-stone-950">XXL (Double XL)</td>
                  <td className="p-2.5">50"</td>
                  <td className="p-2.5">32"</td>
                  <td className="p-2.5">24"</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200/80 italic leading-snug">
            💡 <strong>Fit Tip:</strong> Our streetwear tees feature a relaxed drop-shoulder oversized fit. If you prefer a regular tailored fit, choose 1 size smaller.
          </p>
        </div>

        {/* Footer Action */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-950 text-white font-extrabold text-xs rounded-xl hover:bg-stone-800 transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
