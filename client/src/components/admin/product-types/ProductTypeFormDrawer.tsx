'use client';

import { useEffect, useState } from 'react';
import {
  X,
  Save,
  Shirt,
  Image as ImageIcon,
  Settings,
  Globe,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { ProductType } from '@/lib/product-types/types';
import { generateSlug } from '@/lib/categories/mock-data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProductType>) => void;
  editingProductType: ProductType | null;
  parentCategories: string[];
}

const sampleImages = [
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=400&q=80',
];

export default function ProductTypeFormDrawer({
  isOpen,
  onClose,
  onSave,
  editingProductType,
  parentCategories,
}: Props) {
  const [activeTab, setActiveTab] = useState<'basic' | 'classification' | 'display' | 'defaults' | 'seo'>('basic');

  const [formData, setFormData] = useState<Partial<ProductType>>({
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    parentCategory: 'Tops',
    genderAvailability: ['Men', 'Women', 'Unisex'],
    featured: false,
    status: 'Active',
    sortOrder: 1,
    priority: 5,
    icon: 'Shirt',
    image: '',
    color: '#facc15',
    showInNav: true,
    showOnHomepage: true,
    defaults: {
      sizeChart: 'Outerwear Fleece (S to 3XL)',
      material: '100% Organic Combed Cotton',
      taxClass: 'Standard 12%',
      shippingClass: 'Standard Apparel',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
  });

  useEffect(() => {
    if (editingProductType) {
      setFormData(editingProductType);
    } else {
      setFormData({
        name: '',
        slug: '',
        shortDescription: '',
        fullDescription: '',
        parentCategory: 'Tops',
        genderAvailability: ['Men', 'Women', 'Unisex'],
        featured: false,
        status: 'Active',
        sortOrder: 1,
        priority: 5,
        icon: 'Shirt',
        image: sampleImages[0],
        color: '#facc15',
        showInNav: true,
        showOnHomepage: true,
        defaults: {
          sizeChart: 'Outerwear Fleece (S to 3XL)',
          material: '100% Organic Combed Cotton',
          taxClass: 'Standard 12%',
          shippingClass: 'Standard Apparel',
        },
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: '',
        },
      });
    }
  }, [editingProductType, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingProductType ? generateSlug(name) : prev.slug,
      seo: {
        ...prev.seo!,
        metaTitle: !editingProductType ? `${name} Collection | BatalaBandi` : prev.seo?.metaTitle || '',
      },
    }));
  };

  const handleGenderToggle = (gender: 'Men' | 'Women' | 'Unisex') => {
    setFormData((prev) => {
      const current = prev.genderAvailability || [];
      const exists = current.includes(gender);
      const next = exists ? current.filter((g) => g !== gender) : [...current, gender];
      return { ...prev, genderAvailability: next.length > 0 ? next : ['Unisex'] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
              Catalog Apparel Definition
            </span>
            <h2 className="text-lg font-extrabold text-stone-900">
              {editingProductType ? `Edit "${editingProductType.name}"` : 'Add New Product Type'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 px-5 bg-white text-xs font-bold gap-3 overflow-x-auto">
          {[
            { id: 'basic', label: 'Basic Info', icon: Shirt },
            { id: 'classification', label: 'Classification', icon: Settings },
            { id: 'display', label: 'Display', icon: ImageIcon },
            { id: 'defaults', label: 'Product Defaults', icon: SlidersHorizontal },
            { id: 'seo', label: 'SEO', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
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
        <form id="productTypeForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Product Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Oversized T-Shirt, Hoodie, Kurta"
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
                  placeholder="e.g. oversized-t-shirt"
                  className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief tagline for product type..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Detailed specifications, fabric characteristics, and fit style..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CLASSIFICATION */}
          {activeTab === 'classification' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Parent Catalog Category</label>
                <select
                  value={formData.parentCategory || 'Tops'}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                >
                  {parentCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Gender Availability</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Men', 'Women', 'Unisex'] as const).map((g) => {
                    const active = formData.genderAvailability?.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleGenderToggle(g)}
                        className={`py-2 rounded-xl text-xs font-bold transition border ${
                          active
                            ? 'bg-yellow-400 text-stone-950 border-yellow-500 shadow-xs'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {active ? '✓ ' : ''}{g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DISPLAY */}
          {activeTab === 'display' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Lucide Icon Name</label>
                <input
                  type="text"
                  value={formData.icon || 'Shirt'}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. Shirt, Flame, Sparkles, Layers, Shield"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition mb-2"
                />
                <span className="text-[11px] font-semibold text-stone-400 block mb-2">
                  Sample Apparel Covers:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
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

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Featured Product Type</h4>
                    <p className="text-[11px] text-stone-400">Highlighted on homepage & catalog header.</p>
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
                    <h4 className="text-xs font-bold text-stone-900">Show in Storefront Navigation</h4>
                    <p className="text-[11px] text-stone-400">Appears in header mega menu.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showInNav ?? true}
                    onChange={(e) => setFormData({ ...formData, showInNav: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCT DEFAULTS */}
          {activeTab === 'defaults' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-medium">
                💡 <strong>Automatic Defaults:</strong> Values set here will automatically pre-fill whenever admins create new products under this Product Type.
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Default Size Chart</label>
                <input
                  type="text"
                  value={formData.defaults?.sizeChart || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaults: { ...formData.defaults!, sizeChart: e.target.value },
                    })
                  }
                  placeholder="e.g. Outerwear Fleece (S to 3XL)"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Default Fabric & Material</label>
                <input
                  type="text"
                  value={formData.defaults?.material || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaults: { ...formData.defaults!, material: e.target.value },
                    })
                  }
                  placeholder="e.g. 240 GSM Super Combed Cotton"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Default Tax Class</label>
                  <select
                    value={formData.defaults?.taxClass || 'Standard 12%'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        defaults: { ...formData.defaults!, taxClass: e.target.value },
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none"
                  >
                    <option value="Standard 12%">Standard 12%</option>
                    <option value="Reduced 5%">Reduced 5%</option>
                    <option value="Zero 0%">Zero 0%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Default Shipping Class</label>
                  <select
                    value={formData.defaults?.shippingClass || 'Standard Apparel'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        defaults: { ...formData.defaults!, shippingClass: e.target.value },
                      })
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none"
                  >
                    <option value="Standard Apparel">Standard Apparel</option>
                    <option value="Express Courier">Express Courier</option>
                    <option value="Heavy Freight">Heavy Freight</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SEO */}
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
                  placeholder="Product Type | BatalaBandi"
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
                  placeholder="Summary for search engines..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>
            </div>
          )}
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
            form="productTypeForm"
            className="flex items-center gap-2 px-5 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-sm transition"
          >
            <Save className="w-4 h-4" /> Save Product Type
          </button>
        </div>
      </div>
    </div>
  );
}
