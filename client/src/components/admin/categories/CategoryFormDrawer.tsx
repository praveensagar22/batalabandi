'use client';

import { useEffect, useState } from 'react';
import {
  X,
  Sparkles,
  Save,
  Image as ImageIcon,
  Layers,
  Globe,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { Category } from '@/lib/categories/types';
import { generateSlug } from '@/lib/categories/mock-data';
import ImageUploadPicker from '@/components/admin/common/ImageUploadPicker';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => void;
  editingCategory: Category | null;
  parentCandidateList: Category[];
  initialParentId?: string | null;
}

const sampleImages = [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
];

export default function CategoryFormDrawer({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  parentCandidateList,
  initialParentId,
}: Props) {
  const [activeTab, setActiveTab] = useState<'basic' | 'display' | 'visibility' | 'seo'>('basic');

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    parentId: null,
    gender: 'Unisex',
    status: 'Active',
    sortOrder: 1,
    displayPriority: 5,
    image: '',
    banner: '',
    color: '#facc15',
    icon: 'Tag',
    showOnHomepage: true,
    featured: false,
    showInNav: true,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImage: '',
    },
  });

  useEffect(() => {
    if (editingCategory) {
      setFormData(editingCategory);
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        parentId: initialParentId || null,
        gender: 'Unisex',
        status: 'Active',
        sortOrder: 1,
        displayPriority: 5,
        image: sampleImages[0],
        banner: '',
        color: '#facc15',
        icon: 'Tag',
        showOnHomepage: true,
        featured: false,
        showInNav: true,
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: '',
          ogImage: '',
        },
      });
    }
  }, [editingCategory, initialParentId, isOpen]);

  if (!isOpen) return null;

  // Auto-generate slug when name changes if creating new category
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingCategory ? generateSlug(name) : prev.slug,
      seo: {
        ...prev.seo!,
        metaTitle: !editingCategory ? `${name} | BatalaBandi` : prev.seo?.metaTitle || '',
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    // Calculate level based on parentId
    let level = 0;
    if (formData.parentId) {
      const parent = parentCandidateList.find((p) => p.id === formData.parentId);
      if (parent) {
        level = parent.level + 1;
      }
    }

    onSave({
      ...formData,
      level,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
              Catalog Management
            </span>
            <h2 className="text-lg font-extrabold text-stone-900">
              {editingCategory ? `Edit "${editingCategory.name}"` : 'Add New Category'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-5 bg-white text-xs font-bold gap-4">
          {[
            { id: 'basic', label: 'Basic Info', icon: Layers },
            { id: 'display', label: 'Display & Images', icon: ImageIcon },
            { id: 'visibility', label: 'Visibility & Sort', icon: Settings },
            { id: 'seo', label: 'SEO Settings', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
                  active
                    ? 'border-yellow-400 text-stone-950 font-extrabold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form id="categoryForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Oversized T-Shirts"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Category Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. oversized-tshirts"
                  className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  URL path segment for this category. Auto-generated from name.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Parent Category</label>
                <select
                  value={formData.parentId || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, parentId: e.target.value ? e.target.value : null })
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                >
                  <option value="">No Parent (Root Category Level 0)</option>
                  {parentCandidateList
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.level === 0 ? '📁 ' : '└─ '}
                        {cat.name} ({cat.gender || 'Unisex'})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Target Gender / Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Men', 'Women', 'Unisex'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        formData.gender === g
                          ? 'bg-yellow-400 text-stone-950 border-yellow-500 shadow-xs'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a brief summary of items in this category..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          {/* TAB 2: DISPLAY & IMAGES */}
          {activeTab === 'display' && (
            <div className="space-y-4">
              {/* Multer File Upload Picker */}
              <ImageUploadPicker
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Upload Category Image (Saved via Multer Backend)"
              />

              <div className="pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-800 mb-1">Image URL (Optional Manual Link)</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />

                <span className="text-[11px] font-semibold text-stone-400 block mt-3 mb-2">
                  Or pick a sample catalog thumbnail:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {sampleImages.map((imgUrl, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormData({ ...formData, image: imgUrl })}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                        formData.image === imgUrl ? 'border-yellow-500 ring-2 ring-yellow-400/50' : 'border-stone-200'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Banner Image URL (Optional)</label>
                <input
                  type="text"
                  value={formData.banner || ''}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Accent Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color || '#facc15'}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-stone-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.color || '#facc15'}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={formData.icon || 'Tag'}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g. Shirt, Flame, Sparkles"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISIBILITY & SORT */}
          {activeTab === 'visibility' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Category Status</h4>
                    <p className="text-[11px] text-stone-400">Controls whether customers can view this category.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active',
                      })
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition ${
                      formData.status === 'Active'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-300 text-stone-700'
                    }`}
                  >
                    {formData.status}
                  </button>
                </div>

                <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Show on Homepage</h4>
                    <p className="text-[11px] text-stone-400">Featured in homepage category grid.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showOnHomepage ?? true}
                    onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
                  />
                </div>

                <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Featured Category</h4>
                    <p className="text-[11px] text-stone-400">Highlighted in navigation banners.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.featured ?? false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
                  />
                </div>

                <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Show in Main Nav Menu</h4>
                    <p className="text-[11px] text-stone-400">Include in header dropdowns.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showInNav ?? true}
                    onChange={(e) => setFormData({ ...formData, showInNav: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder || 1}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Display Priority</label>
                  <input
                    type="number"
                    value={formData.displayPriority || 5}
                    onChange={(e) => setFormData({ ...formData, displayPriority: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={formData.seo?.metaTitle || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo!, metaTitle: e.target.value },
                    })
                  }
                  placeholder="Category Name | BatalaBandi"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={formData.seo?.metaDescription || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo!, metaDescription: e.target.value },
                    })
                  }
                  placeholder="Summarize this category for Google search engines..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">SEO Keywords</label>
                <input
                  type="text"
                  value={formData.seo?.keywords || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo!, keywords: e.target.value },
                    })
                  }
                  placeholder="e.g. streetwear, oversized t-shirts, cotton shirts"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
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
            form="categoryForm"
            className="flex items-center gap-2 px-5 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-sm transition"
          >
            <Save className="w-4 h-4" /> Save Category
          </button>
        </div>
      </div>
    </div>
  );
}
