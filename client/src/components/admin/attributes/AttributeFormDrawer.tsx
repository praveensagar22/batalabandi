'use client';

import { useEffect, useState } from 'react';
import { X, Save, Tag, Settings, Layers } from 'lucide-react';
import { AttributeGroup } from '@/lib/attributes/types';
import { generateSlug } from '@/lib/categories/mock-data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<AttributeGroup>) => void;
  editingGroup: AttributeGroup | null;
}

export default function AttributeFormDrawer({
  isOpen,
  onClose,
  onSave,
  editingGroup,
}: Props) {
  const [formData, setFormData] = useState<Partial<AttributeGroup>>({
    name: '',
    slug: '',
    description: '',
    type: 'Text',
    enableFilter: true,
    visibleOnProductPage: true,
    required: false,
    sortingMode: 'Manual',
    status: 'Active',
    icon: 'Tag',
  });

  useEffect(() => {
    if (editingGroup) {
      setFormData(editingGroup);
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        type: 'Text',
        enableFilter: true,
        visibleOnProductPage: true,
        required: false,
        sortingMode: 'Manual',
        status: 'Active',
        icon: 'Tag',
      });
    }
  }, [editingGroup, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (name: string) => {
    const slug = generateSlug(name);
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingGroup ? slug : prev.slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
              Attribute Group Configuration
            </span>
            <h2 className="text-lg font-extrabold text-stone-900">
              {editingGroup ? `Edit "${editingGroup.name}"` : 'Create Attribute Group'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="groupForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Attribute Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Colors, Sizes, Materials, Fit Types"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Slug</label>
            <input
              type="text"
              required
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 outline-none focus:border-yellow-400 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Purpose of this attribute group..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Attribute Input Type</label>
            <select
              value={formData.type || 'Text'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400 transition"
            >
              <option value="Text">Text Label (XS, S, M, XL)</option>
              <option value="Color Picker">Color Picker & Hex Swatch</option>
              <option value="Image Swatch">Image Pattern Swatch</option>
              <option value="Number">Number (GSM, Thread Count)</option>
              <option value="Multi Select">Multi Select Options</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Sorting Mode</label>
            <select
              value={formData.sortingMode || 'Manual'}
              onChange={(e) => setFormData({ ...formData, sortingMode: e.target.value as any })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 outline-none focus:border-yellow-400 transition"
            >
              <option value="Manual">Manual Drag & Drop Order</option>
              <option value="Alphabetical">Alphabetical (A-Z)</option>
              <option value="Custom">Custom Priority List</option>
            </select>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900">Enable Storefront Filter</h4>
                <p className="text-[11px] text-stone-400">Appears on collection sidebar filters.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableFilter ?? true}
                onChange={(e) => setFormData({ ...formData, enableFilter: e.target.checked })}
                className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
              />
            </div>

            <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900">Visible on Product Detail Page</h4>
                <p className="text-[11px] text-stone-400">Shown in product specs table.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.visibleOnProductPage ?? true}
                onChange={(e) => setFormData({ ...formData, visibleOnProductPage: e.target.checked })}
                className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
              />
            </div>

            <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900">Required During Product Creation</h4>
                <p className="text-[11px] text-stone-400">Mandatory option when creating products.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.required ?? false}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="groupForm"
            className="flex items-center gap-2 px-5 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-xs transition"
          >
            <Save className="w-4 h-4" /> Save Group
          </button>
        </div>
      </div>
    </div>
  );
}
