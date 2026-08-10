'use client';

import { useEffect, useState } from 'react';
import { X, Save, Image as ImageIcon, Sparkles } from 'lucide-react';
import { BannerItem } from '@/lib/marketing/types';
import ImageUploadPicker from '@/components/admin/common/ImageUploadPicker';

interface Props {
  isOpen: boolean;
  editingBanner: BannerItem | null;
  onClose: () => void;
  onSave: (data: Partial<BannerItem>) => void;
}

export default function BannerFormDrawer({
  isOpen,
  editingBanner,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<Partial<BannerItem>>({
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Shop Collection',
    targetLink: '/categories',
    position: 'Hero Carousel',
    sortOrder: 1,
    status: 'Active',
  });

  useEffect(() => {
    if (editingBanner) {
      setFormData(editingBanner);
    } else {
      setFormData({
        title: '',
        subtitle: '',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Shop New Drop',
        targetLink: '/categories',
        position: 'Hero Carousel',
        sortOrder: 1,
        status: 'Active',
      });
    }
  }, [editingBanner, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end font-sans">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-400 text-stone-950 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-950">
                {editingBanner ? 'Edit Banner Asset' : 'Add New Hero Banner'}
              </h3>
              <p className="text-xs text-stone-500">Configure promotional campaign graphic & link target.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form id="bannerForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Banner Title</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Cyberpunk Anime Drop 2026"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:border-yellow-400 transition font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Subtitle / Tagline</label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Hand-painted oversized heavyweight tees & anime graphic hoodies"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
            />
          </div>

          {/* Banner Graphic Uploader */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Banner Graphic Image (Multer Uploader)</label>
            <ImageUploadPicker
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Button CTA Text</label>
              <input
                type="text"
                value={formData.ctaText || ''}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="e.g. Shop Collection"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Target Link URL</label>
              <input
                type="text"
                value={formData.targetLink || ''}
                onChange={(e) => setFormData({ ...formData, targetLink: e.target.value })}
                placeholder="e.g. /categories or /product/123"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 outline-none focus:border-yellow-400 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Display Position</label>
              <select
                value={formData.position || 'Hero Carousel'}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400 transition"
              >
                <option value="Hero Carousel">Hero Carousel (Homepage)</option>
                <option value="Category Top">Category Header Banner</option>
                <option value="Homepage Popup">Homepage Promo Popup</option>
                <option value="Promo Strip">Top Promo Announcement Strip</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Campaign Status</label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400 transition"
              >
                <option value="Active">Active (Live)</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 flex items-center justify-end gap-2 bg-stone-50">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-stone-200 text-stone-700 font-bold rounded-xl hover:bg-stone-100">
            Cancel
          </button>
          <button
            type="submit"
            form="bannerForm"
            className="px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 font-black rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Banner
          </button>
        </div>
      </div>
    </div>
  );
}
