'use client';

import { useEffect, useState } from 'react';
import { X, Save, Ticket } from 'lucide-react';
import { CouponItem } from '@/lib/marketing/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<CouponItem>) => void;
}

export default function CouponFormModal({ isOpen, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<Partial<CouponItem>>({
    code: '',
    description: '',
    discountType: 'Percentage',
    discountValue: 20,
    minPurchaseAmount: 499,
    maxDiscountAmount: 500,
    usageLimit: 100,
    status: 'Active',
  });

  useEffect(() => {
    setFormData({
      code: '',
      description: '',
      discountType: 'Percentage',
      discountValue: 20,
      minPurchaseAmount: 499,
      maxDiscountAmount: 500,
      usageLimit: 100,
      status: 'Active',
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;
    onSave({ ...formData, code: formData.code.toUpperCase() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl font-black">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest">
                Promo Discount Code
              </span>
              <h3 className="text-base font-extrabold text-stone-900">Create New Coupon</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form id="couponForm" onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Coupon Code (Uppercase)</label>
            <input
              type="text"
              required
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. WELCOME20 or FESTIVE500"
              className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-black text-stone-950 outline-none focus:border-yellow-400 uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Description / Customer Terms</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. 20% Off for first time store shoppers"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Discount Type</label>
              <select
                value={formData.discountType || 'Percentage'}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400"
              >
                <option value="Percentage">Percentage % Off</option>
                <option value="Flat">Flat ₹ Off</option>
                <option value="Free Shipping">Free Shipping</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                {formData.discountType === 'Percentage' ? 'Discount %' : 'Discount ₹ Amount'}
              </label>
              <input
                type="number"
                required
                value={formData.discountValue || 0}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Min Purchase Order (₹)</label>
              <input
                type="number"
                value={formData.minPurchaseAmount || 0}
                onChange={(e) => setFormData({ ...formData, minPurchaseAmount: Number(e.target.value) })}
                className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Max Total Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit || 100}
                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button onClick={onClose} className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-200">
            Cancel
          </button>
          <button
            type="submit"
            form="couponForm"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-black rounded-xl shadow-xs"
          >
            <Save className="w-4 h-4" /> Save Coupon
          </button>
        </div>
      </div>
    </div>
  );
}
