'use client';

import { useEffect, useState } from 'react';
import { X, Save, Palette, Tag } from 'lucide-react';
import { AttributeGroup, AttributeValueItem } from '@/lib/attributes/types';
import { generateSlug } from '@/lib/categories/mock-data';
import ImageUploadPicker from '@/components/admin/common/ImageUploadPicker';

interface Props {
  isOpen: boolean;
  group: AttributeGroup | null;
  editingValue: AttributeValueItem | null;
  onClose: () => void;
  onSave: (val: Partial<AttributeValueItem>) => void;
}

export default function AttributeValueModal({
  isOpen,
  group,
  editingValue,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<Partial<AttributeValueItem>>({
    name: '',
    slug: '',
    displayLabel: '',
    colorHex: '#000000',
    image: '',
    sortOrder: 1,
    status: 'Active',
  });

  useEffect(() => {
    if (editingValue) {
      setFormData(editingValue);
    } else {
      setFormData({
        name: '',
        slug: '',
        displayLabel: '',
        colorHex: '#000000',
        image: '',
        sortOrder: group ? group.values.length + 1 : 1,
        status: 'Active',
      });
    }
  }, [editingValue, group, isOpen]);

  if (!isOpen || !group) return null;

  const handleNameChange = (name: string) => {
    const slug = generateSlug(name);
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingValue ? slug : prev.slug,
      displayLabel: !editingValue ? name : prev.displayLabel,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
              {group.name} Option Value
            </span>
            <h3 className="text-base font-extrabold text-stone-900">
              {editingValue ? `Edit "${editingValue.name}"` : `Add New ${group.name} Value`}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form id="valueForm" onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Option Value Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Black, XL, 100% Cotton, Oversized"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Display Label</label>
            <input
              type="text"
              value={formData.displayLabel || ''}
              onChange={(e) => setFormData({ ...formData, displayLabel: e.target.value })}
              placeholder="e.g. Midnight Black, Extra Large (44&quot;)"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
            />
          </div>

          {/* Color Picker Swatch */}
          {group.type === 'Color Picker' && (
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Color Hex & Swatch</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.colorHex || '#000000'}
                  onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-stone-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={formData.colorHex || '#000000'}
                  onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                  className="flex-1 font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>
            </div>
          )}

          {/* Image Swatch Upload */}
          {group.type === 'Image Swatch' && (
            <ImageUploadPicker
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="Upload Pattern Texture Swatch (Multer)"
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder || 1}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Status</label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="valueForm"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 font-extrabold rounded-xl shadow-xs text-xs"
          >
            <Save className="w-4 h-4" /> Save Value
          </button>
        </div>
      </div>
    </div>
  );
}
