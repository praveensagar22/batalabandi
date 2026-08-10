'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Shirt, Glasses, Sparkles } from 'lucide-react';

const apparelIcons = [
  { icon: '👕', label: 'Shirts' },
  { icon: '👖', label: 'Pants' },
  { icon: '🕶️', label: 'Glasses' },
  { icon: '🧥', label: 'Hoodies' },
];

export default function Loading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % apparelIcons.length);
    }, 450);
    return () => clearInterval(timer);
  }, []);

  const current = apparelIcons[index];

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 bg-[#faf9f6] flex flex-col items-center justify-center p-6 font-sans select-none">
      <div className="bg-white rounded-3xl p-6 px-8 shadow-sm border border-stone-200/90 flex flex-col items-center space-y-4 max-w-xs w-full text-center">
        {/* Animated Icon Box (Zepto Style) */}
        <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-4xl shadow-inner animate-bounce">
          <span className="transition-all duration-300 transform scale-110">
            {current.icon}
          </span>
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-[11px] font-black text-amber-600 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Loading {current.label}...</span>
          </div>
          <h2 className="text-sm font-black text-stone-900">BatalaBandi Apparel</h2>
          <p className="text-[11px] text-stone-400 font-semibold">Fast & Fresh Style Delivery</p>
        </div>

        {/* Zepto Style Minimal Loading Bar */}
        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden relative">
          <div className="w-full h-full bg-[#facc15] rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
}
