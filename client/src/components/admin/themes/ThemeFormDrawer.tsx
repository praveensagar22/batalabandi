'use client';

import { useEffect, useState } from 'react';
import {
  X,
  Save,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Home,
  Megaphone,
  Globe,
  Settings,
} from 'lucide-react';
import { Theme } from '@/lib/themes/types';
import { generateSlug } from '@/lib/categories/mock-data';
import ImageUploadPicker from '@/components/admin/common/ImageUploadPicker';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Theme>) => void;
  editingTheme: Theme | null;
}

const sampleBanners = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
];

export default function ThemeFormDrawer({
  isOpen,
  onClose,
  onSave,
  editingTheme,
}: Props) {
  const [activeTab, setActiveTab] = useState<'basic' | 'artwork' | 'collections' | 'homepage' | 'marketing' | 'seo'>('basic');

  const [formData, setFormData] = useState<Partial<Theme>>({
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    status: 'Active',
    featured: true,
    trending: true,
    showOnHomepage: true,
    homepagePriority: 1,
    showInNav: true,
    icon: 'Sparkles',
    bannerImage: '',
    thumbnailImage: '',
    themeColor: '#ef4444',
    gradientColor: 'from-red-500 to-amber-500',
    compatibleCollections: ['Painted', 'Printed', 'Limited Edition'],
    marketing: {
      tagline: 'Explore Exclusive Theme Art',
      buttonText: 'Explore Theme',
      buttonUrl: '/themes',
      campaignLabel: 'Trending',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
  });

  useEffect(() => {
    if (editingTheme) {
      setFormData(editingTheme);
    } else {
      setFormData({
        name: '',
        slug: '',
        shortDescription: '',
        fullDescription: '',
        status: 'Active',
        featured: true,
        trending: true,
        showOnHomepage: true,
        homepagePriority: 1,
        showInNav: true,
        icon: 'Sparkles',
        bannerImage: sampleBanners[0],
        thumbnailImage: sampleBanners[0],
        themeColor: '#ef4444',
        gradientColor: 'from-red-500 to-amber-500',
        compatibleCollections: ['Painted', 'Printed', 'Limited Edition'],
        marketing: {
          tagline: 'Explore Exclusive Theme Art',
          buttonText: 'Explore Theme',
          buttonUrl: '/themes',
          campaignLabel: 'Trending',
        },
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: '',
        },
      });
    }
  }, [editingTheme, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (name: string) => {
    const slug = generateSlug(name);
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingTheme ? slug : prev.slug,
      marketing: {
        ...prev.marketing!,
        buttonUrl: `/themes/${slug}`,
      },
      seo: {
        ...prev.seo!,
        metaTitle: !editingTheme ? `${name} Graphic Apparel | BatalaBandi` : prev.seo?.metaTitle || '',
      },
    }));
  };

  const handleCollectionToggle = (colName: string) => {
    setFormData((prev) => {
      const current = prev.compatibleCollections || [];
      const exists = current.includes(colName);
      const next = exists ? current.filter((c) => c !== colName) : [...current, colName];
      return { ...prev, compatibleCollections: next.length > 0 ? next : ['Printed'] };
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
              Artwork Theme Concept
            </span>
            <h2 className="text-lg font-extrabold text-stone-900">
              {editingTheme ? `Edit "${editingTheme.name}"` : 'Create New Theme'}
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
            { id: 'basic', label: 'Basic Info', icon: Sparkles },
            { id: 'artwork', label: 'Artwork & Media', icon: ImageIcon },
            { id: 'collections', label: 'Collections', icon: Layers },
            { id: 'homepage', label: 'Homepage Settings', icon: Home },
            { id: 'marketing', label: 'Marketing', icon: Megaphone },
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
        <form id="themeForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Theme Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Anime, Marvel, Nature, Quotes, Gaming"
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
                  placeholder="e.g. anime"
                  className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-800 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Tagline shown on theme cards..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Artistic concept details, inspiration, and graphics narrative..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ARTWORK & MEDIA */}
          {activeTab === 'artwork' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Lucide Icon Name</label>
                <input
                  type="text"
                  value={formData.icon || 'Sparkles'}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. Sparkles, Shield, Sun, MessageSquare, Gamepad2"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <ImageUploadPicker
                  value={formData.bannerImage || ''}
                  onChange={(url) => setFormData({ ...formData, bannerImage: url, thumbnailImage: url })}
                  label="Upload Artwork Theme Cover Image (Saved via Multer)"
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-800 mb-1">Banner Image URL (Optional Link)</label>
                <input
                  type="text"
                  value={formData.bannerImage || ''}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value, thumbnailImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />

                <span className="text-[11px] font-semibold text-stone-400 block mt-3 mb-2">
                  Sample Artwork Covers:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {sampleBanners.map((imgUrl, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormData({ ...formData, bannerImage: imgUrl, thumbnailImage: imgUrl })}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                        formData.bannerImage === imgUrl ? 'border-yellow-500 ring-2 ring-yellow-400/50' : 'border-stone-200'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Theme Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.themeColor || '#ef4444'}
                      onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-stone-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.themeColor || '#ef4444'}
                      onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                      className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Gradient Tail</label>
                  <input
                    type="text"
                    value={formData.gradientColor || 'from-red-500 to-amber-500'}
                    onChange={(e) => setFormData({ ...formData, gradientColor: e.target.value })}
                    placeholder="from-red-500 to-amber-500"
                    className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COLLECTIONS COMPATIBILITY */}
          {activeTab === 'collections' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Compatible Collections Matrix
              </label>
              <p className="text-xs text-stone-500">
                Select which catalog collections can be linked with this artwork theme:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {['Painted', 'Thread', 'Printed', 'Limited Edition', 'Hand Painted', 'Embroidery'].map((col) => {
                  const active = formData.compatibleCollections?.includes(col);
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => handleCollectionToggle(col)}
                      className={`p-3 rounded-xl text-xs font-bold transition text-left border ${
                        active
                          ? 'bg-yellow-400 text-stone-950 border-yellow-500 shadow-xs'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}{col}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: HOMEPAGE SETTINGS */}
          {activeTab === 'homepage' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Featured Theme</h4>
                    <p className="text-[11px] text-stone-400">Highlighted on top theme showcase.</p>
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
                    <h4 className="text-xs font-bold text-stone-900">Trending Theme Flag</h4>
                    <p className="text-[11px] text-stone-400">Shows trending flame badge on card.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.trending ?? true}
                    onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
                  />
                </div>

                <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Show on Homepage</h4>
                    <p className="text-[11px] text-stone-400">Visible on landing page grid.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showOnHomepage ?? true}
                    onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Homepage Priority</label>
                <input
                  type="number"
                  value={formData.homepagePriority || 1}
                  onChange={(e) => setFormData({ ...formData, homepagePriority: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                />
              </div>
            </div>
          )}

          {/* TAB 5: MARKETING */}
          {activeTab === 'marketing' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Marketing Tagline</label>
                <input
                  type="text"
                  value={formData.marketing?.tagline || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketing: { ...formData.marketing!, tagline: e.target.value },
                    })
                  }
                  placeholder="e.g. Unleash Your Inner Otaku Street Style"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={formData.marketing?.buttonText || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketing: { ...formData.marketing!, buttonText: e.target.value },
                    })
                  }
                  placeholder="Explore Anime Collection"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Campaign Label</label>
                <div className="flex flex-wrap gap-2">
                  {(['Trending', 'New', 'Limited', 'Exclusive', 'Hot', 'Bestseller'] as const).map((label) => {
                    const active = formData.marketing?.campaignLabel === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            marketing: { ...formData.marketing!, campaignLabel: label },
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

          {/* TAB 6: SEO */}
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
                  placeholder="Anime Streetwear & Graphic Apparel | BatalaBandi"
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
            form="themeForm"
            className="flex items-center gap-2 px-5 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-sm transition"
          >
            <Save className="w-4 h-4" /> Save Theme
          </button>
        </div>
      </div>
    </div>
  );
}
