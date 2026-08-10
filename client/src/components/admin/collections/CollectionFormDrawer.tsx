'use client';

import { useEffect, useState } from 'react';
import {
  X,
  Save,
  Layers,
  Image as ImageIcon,
  Home,
  Megaphone,
  Globe,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Collection } from '@/lib/collections/types';
import { generateSlug } from '@/lib/categories/mock-data';
import ImageUploadPicker from '@/components/admin/common/ImageUploadPicker';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Collection>) => void;
  editingCollection: Collection | null;
}

const sampleCovers = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&q=80',
];

export default function CollectionFormDrawer({
  isOpen,
  onClose,
  onSave,
  editingCollection,
}: Props) {
  const [activeTab, setActiveTab] = useState<'basic' | 'display' | 'homepage' | 'marketing' | 'seo'>('basic');

  const [formData, setFormData] = useState<Partial<Collection>>({
    name: '',
    slug: '',
    shortDescription: '',
    detailedDescription: '',
    status: 'Active',
    featured: true,
    showOnHomepage: true,
    homepagePriority: 1,
    displayOrder: 1,
    displayStyle: 'Card',
    icon: 'Palette',
    coverImage: '',
    bannerImage: '',
    themeColor: '#facc15',
    marketing: {
      buttonText: 'Shop Collection',
      buttonUrl: '/collections',
      promoLabel: 'Trending',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
  });

  useEffect(() => {
    if (editingCollection) {
      setFormData(editingCollection);
    } else {
      setFormData({
        name: '',
        slug: '',
        shortDescription: '',
        detailedDescription: '',
        status: 'Active',
        featured: true,
        showOnHomepage: true,
        homepagePriority: 1,
        displayOrder: 1,
        displayStyle: 'Card',
        icon: 'Palette',
        coverImage: sampleCovers[0],
        bannerImage: '',
        themeColor: '#facc15',
        marketing: {
          buttonText: 'Shop Collection',
          buttonUrl: '/collections',
          promoLabel: 'Trending',
        },
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: '',
        },
      });
    }
  }, [editingCollection, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingCollection ? generateSlug(name) : prev.slug,
      marketing: {
        ...prev.marketing!,
        buttonUrl: `/collections/${generateSlug(name)}`,
      },
      seo: {
        ...prev.seo!,
        metaTitle: !editingCollection ? `${name} Collection | BatalaBandi` : prev.seo?.metaTitle || '',
      },
    }));
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
              Marketing Collection
            </span>
            <h2 className="text-lg font-extrabold text-stone-900">
              {editingCollection ? `Edit "${editingCollection.name}"` : 'Create New Collection'}
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
            { id: 'basic', label: 'Basic Info', icon: Layers },
            { id: 'display', label: 'Display & Media', icon: ImageIcon },
            { id: 'homepage', label: 'Homepage Settings', icon: Home },
            { id: 'marketing', label: 'Marketing', icon: Megaphone },
            { id: 'seo', label: 'SEO & Search', icon: Globe },
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
        <form id="collectionForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Collection Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Painted, Thread, Limited Edition"
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
                  placeholder="e.g. painted"
                  className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Tagline shown on collection cards..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  value={formData.detailedDescription || ''}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  placeholder="Full background, craftsmanship story, and design aesthetic..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          {/* TAB 2: DISPLAY */}
          {activeTab === 'display' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Lucide Icon Name</label>
                <input
                  type="text"
                  value={formData.icon || 'Palette'}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. Palette, Needle, Printer, Sparkles, Brush"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <ImageUploadPicker
                  value={formData.coverImage || ''}
                  onChange={(url) => setFormData({ ...formData, coverImage: url, bannerImage: url })}
                  label="Upload Collection Cover Image (Saved via Multer)"
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-800 mb-1">Cover Image URL (Optional Link)</label>
                <input
                  type="text"
                  value={formData.coverImage || ''}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />

                <span className="text-[11px] font-semibold text-stone-400 block mt-3 mb-2">
                  Sample Collection Covers:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {sampleCovers.map((imgUrl, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormData({ ...formData, coverImage: imgUrl })}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                        formData.coverImage === imgUrl ? 'border-yellow-500 ring-2 ring-yellow-400/50' : 'border-stone-200'
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
                  value={formData.bannerImage || ''}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Display Style Layout</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Card', 'Banner', 'Full Width'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setFormData({ ...formData, displayStyle: style })}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        formData.displayStyle === style
                          ? 'bg-yellow-400 text-stone-950 border-yellow-500 shadow-xs'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOMEPAGE SETTINGS */}
          {activeTab === 'homepage' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Featured Collection</h4>
                    <p className="text-[11px] text-stone-400">Highlighted on top banner section.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.featured ?? true}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
                  />
                </div>

                <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Show on Homepage Grid</h4>
                    <p className="text-[11px] text-stone-400">Includes in storefront collection slider.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showOnHomepage ?? true}
                    onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Homepage Priority</label>
                  <input
                    type="number"
                    value={formData.homepagePriority || 1}
                    onChange={(e) => setFormData({ ...formData, homepagePriority: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder || 1}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MARKETING */}
          {activeTab === 'marketing' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Button Call To Action Text</label>
                <input
                  type="text"
                  value={formData.marketing?.buttonText || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketing: { ...formData.marketing!, buttonText: e.target.value },
                    })
                  }
                  placeholder="e.g. Explore Hand Artwork"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Button Target URL</label>
                <input
                  type="text"
                  value={formData.marketing?.buttonUrl || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketing: { ...formData.marketing!, buttonUrl: e.target.value },
                    })
                  }
                  placeholder="/collections/painted"
                  className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Promotional Badge Label</label>
                <div className="flex flex-wrap gap-2">
                  {(['New', 'Hot', 'Trending', 'Limited', 'Best Seller', 'Handmade'] as const).map((label) => {
                    const active = formData.marketing?.promoLabel === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            marketing: { ...formData.marketing!, promoLabel: label },
                          })
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                          active
                            ? 'bg-yellow-400 text-stone-950 border-yellow-500 shadow-xs'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
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
                  placeholder="Collection Name | BatalaBandi"
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
                  placeholder="Summary for search engine snippets..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              {/* Google Search Card Preview */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">
                  Google Search Snippet Preview
                </span>
                <h5 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer truncate">
                  {formData.seo?.metaTitle || `${formData.name || 'Collection'} | BatalaBandi`}
                </h5>
                <p className="text-[11px] font-mono text-emerald-800 truncate">
                  https://batalabandi.com{formData.marketing?.buttonUrl || '/collections'}
                </p>
                <p className="text-xs text-stone-600 line-clamp-2">
                  {formData.seo?.metaDescription || formData.shortDescription || 'Shop the latest collection at BatalaBandi.'}
                </p>
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
            form="collectionForm"
            className="flex items-center gap-2 px-5 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-sm transition"
          >
            <Save className="w-4 h-4" /> Save Collection
          </button>
        </div>
      </div>
    </div>
  );
}
