'use client';

import { useEffect, useState } from 'react';
import {
  X,
  Save,
  Package,
  Layers,
  Image as ImageIcon,
  IndianRupee,
  Globe,
  Settings,
  Sparkles,
  Palette,
  Ruler,
  Tag,
  Upload,
} from 'lucide-react';
import { ProductItem } from '@/lib/products/types';
import { generateSlug } from '@/lib/categories/mock-data';
import ImageUploadPicker from '@/components/admin/common/ImageUploadPicker';
import { fetchAttributesAPI } from '@/lib/api/catalog';
import { AttributeGroup } from '@/lib/attributes/types';
import { INITIAL_ATTRIBUTES } from '@/lib/attributes/mock-data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProductItem>) => void;
  editingProduct: ProductItem | null;
  categoriesList: string[];
  productTypesList: string[];
  collectionsList: string[];
  themesList: string[];
}

export default function ProductFormDrawer({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categoriesList,
  productTypesList,
  collectionsList,
  themesList,
}: Props) {
  const [activeTab, setActiveTab] = useState<'basic' | 'taxonomy' | 'attributes' | 'pricing' | 'media' | 'seo'>('basic');

  const [formData, setFormData] = useState<Partial<ProductItem>>({
    title: '',
    subtitle: '',
    slug: '',
    description: '',
    sku: '',
    barcode: '',
    price: 1490,
    compareAtPrice: 1990,
    costPrice: 500,
    stock: 25,
    lowStockThreshold: 5,
    status: 'Active',
    isFeatured: true,
    category: categoriesList[0] || 'Tops',
    productType: productTypesList[0] || 'Shirt',
    collectionName: collectionsList[0] || 'Printed',
    themeName: themesList[0] || 'Anime',
    gender: 'Unisex',
    colors: ['Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    material: '100% Cotton',
    fitType: 'Oversized',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    },
  });

  const [availableAttributes, setAvailableAttributes] = useState<AttributeGroup[]>(INITIAL_ATTRIBUTES);

  useEffect(() => {
    async function loadAttributes() {
      try {
        const attrs = await fetchAttributesAPI();
        if (attrs && attrs.length > 0) {
          setAvailableAttributes(attrs);
        }
      } catch (err) {
        console.log('Failed to fetch attributes, using fallback state.');
      }
    }
    if (isOpen) {
      loadAttributes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData({
        title: '',
        subtitle: '',
        slug: '',
        description: '',
        sku: `BB-${Date.now().toString().slice(-4)}`,
        barcode: '',
        price: 1490,
        compareAtPrice: 1990,
        costPrice: 500,
        stock: 25,
        lowStockThreshold: 5,
        status: 'Active',
        isFeatured: true,
        category: categoriesList[0] || 'Tops',
        productType: productTypesList[0] || 'Shirt',
        collectionName: collectionsList[0] || 'Printed',
        themeName: themesList[0] || 'Anime',
        gender: 'Unisex',
        colors: ['Black', 'White'],
        sizes: ['S', 'M', 'L', 'XL'],
        material: '100% Cotton',
        fitType: 'Oversized',
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'],
        thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: '',
        },
      });
    }
  }, [editingProduct, isOpen, categoriesList, productTypesList, collectionsList, themesList]);

  if (!isOpen) return null;

  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title);
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !editingProduct ? slug : prev.slug,
      sku: !editingProduct && !prev.sku ? `BB-${title.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}` : prev.sku,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;
    onSave(formData);
  };

  // Profit Margin Calculator
  const profitMargin =
    formData.price && formData.costPrice
      ? Math.round(((formData.price - formData.costPrice) / formData.price) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
              Product Builder Engine
            </span>
            <h2 className="text-lg font-extrabold text-stone-900">
              {editingProduct ? `Edit "${editingProduct.title}"` : 'Create New Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 p-2 bg-stone-100 border-b border-stone-200 overflow-x-auto text-xs font-sans">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 flex-shrink-0 text-xs font-extrabold ${
              activeTab === 'basic' ? 'bg-white text-stone-950 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> 1. General Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('attributes')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 flex-shrink-0 text-xs font-extrabold ${
              activeTab === 'attributes' ? 'bg-white text-stone-950 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-amber-600" /> 2. Variants & SKUs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 flex-shrink-0 text-xs font-extrabold ${
              activeTab === 'pricing' ? 'bg-white text-stone-950 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> 3. Pricing & Margin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 flex-shrink-0 text-xs font-extrabold ${
              activeTab === 'media' ? 'bg-white text-stone-950 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> 4. Photos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 flex-shrink-0 text-xs font-extrabold ${
              activeTab === 'seo' ? 'bg-white text-stone-950 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> 5. SEO
          </button>
        </div>

        {/* Form Body */}
        <form id="productForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Cyber Samurai Oversized Heavyweight Tee"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. 240 GSM drop shoulder Japanese cyberpunk street tee"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none focus:border-yellow-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none focus:border-yellow-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fabric composition, fit details, artwork story..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
                />
              </div>

              {/* Catalog Classification Dropdowns */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-extrabold text-stone-900">Catalog Mapping</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">Category</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400 transition"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">Product Type</label>
                    <select
                      value={formData.productType || ''}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400 transition"
                    >
                      {productTypesList.map((pt) => (
                        <option key={pt} value={pt}>
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">Collection</label>
                    <select
                      value={formData.collectionName || ''}
                      onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 outline-none focus:border-yellow-400 transition"
                    >
                      <option value="">-- Select Collection --</option>
                      {collectionsList.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">Artwork Theme</label>
                    <select
                      value={formData.themeName || ''}
                      onChange={(e) => setFormData({ ...formData, themeName: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 outline-none focus:border-yellow-400 transition"
                    >
                      <option value="">-- Select Theme --</option>
                      {themesList.map((thm) => (
                        <option key={thm} value={thm}>
                          {thm}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Target Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Men', 'Women', 'Unisex'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`py-2 rounded-xl text-xs font-bold transition border ${
                          formData.gender === g
                            ? 'bg-yellow-400 text-stone-950 border-yellow-500 shadow-xs font-extrabold'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VARIANTS & ATTRIBUTES */}
          {activeTab === 'attributes' && (
            <div className="space-y-5">
              {/* Colors Attribute Group */}
              {(() => {
                const colorGroup = availableAttributes.find(
                  (a) => a.name.toLowerCase().includes('color') || a.slug.includes('color')
                );
                const selectedColors = formData.colors || [];

                return (
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-amber-600" /> Color Options (From Attributes Module)
                        </label>
                        <p className="text-[11px] text-stone-400">Click color swatches to select garment colors</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-400 text-stone-950 rounded">
                        {selectedColors.length} selected
                      </span>
                    </div>

                    {colorGroup && colorGroup.values.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {colorGroup.values.map((val) => {
                          const isSelected = selectedColors.includes(val.name);
                          return (
                            <button
                              type="button"
                              key={val.id}
                              onClick={() => {
                                const next = isSelected
                                  ? selectedColors.filter((c) => c !== val.name)
                                  : [...selectedColors, val.name];
                                setFormData({ ...formData, colors: next });
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                                isSelected
                                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs inline-block"
                                style={{ backgroundColor: val.colorHex || '#000000' }}
                              />
                              <span>{val.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                        Or enter custom color list (comma separated):
                      </label>
                      <input
                        type="text"
                        value={formData.colors?.join(', ') || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            colors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="e.g. Black, White, Crimson Red"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Sizes Attribute Group */}
              {(() => {
                const sizeGroup = availableAttributes.find(
                  (a) => a.name.toLowerCase().includes('size') || a.slug.includes('size')
                );
                const selectedSizes = formData.sizes || [];

                return (
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5 text-blue-600" /> Size Options (From Attributes Module)
                        </label>
                        <p className="text-[11px] text-stone-400">Click sizes to select available stock sizes</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-400 text-stone-950 rounded">
                        {selectedSizes.length} selected
                      </span>
                    </div>

                    {sizeGroup && sizeGroup.values.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {sizeGroup.values.map((val) => {
                          const isSelected = selectedSizes.includes(val.name);
                          return (
                            <button
                              type="button"
                              key={val.id}
                              onClick={() => {
                                const next = isSelected
                                  ? selectedSizes.filter((s) => s !== val.name)
                                  : [...selectedSizes, val.name];
                                setFormData({ ...formData, sizes: next });
                              }}
                              className={`px-3.5 py-1.5 rounded-xl border text-xs font-black transition ${
                                isSelected
                                  ? 'bg-yellow-400 text-stone-950 border-yellow-500 shadow-xs'
                                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              {val.name}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                        Or enter custom size list (comma separated):
                      </label>
                      <input
                        type="text"
                        value={formData.sizes?.join(', ') || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="e.g. S, M, L, XL, XXL"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Material & Fit Type */}
              <div className="grid grid-cols-2 gap-3">
                {(() => {
                  const materialGroup = availableAttributes.find(
                    (a) => a.name.toLowerCase().includes('material') || a.slug.includes('material')
                  );
                  return (
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Material Composition</label>
                      {materialGroup && materialGroup.values.length > 0 ? (
                        <select
                          value={formData.material || ''}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400 transition"
                        >
                          <option value="">-- Choose Material --</option>
                          {materialGroup.values.map((v) => (
                            <option key={v.id} value={v.name}>
                              {v.displayLabel || v.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={formData.material || ''}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          placeholder="e.g. 100% Cotton, Fleece"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                        />
                      )}
                    </div>
                  );
                })()}

                {(() => {
                  const fitGroup = availableAttributes.find(
                    (a) => a.name.toLowerCase().includes('fit') || a.slug.includes('fit')
                  );
                  return (
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">Fit Type</label>
                      {fitGroup && fitGroup.values.length > 0 ? (
                        <select
                          value={formData.fitType || ''}
                          onChange={(e) => setFormData({ ...formData, fitType: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400 transition"
                        >
                          <option value="">-- Choose Fit Type --</option>
                          {fitGroup.values.map((v) => (
                            <option key={v.id} value={v.name}>
                              {v.displayLabel || v.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={formData.fitType || ''}
                          onChange={(e) => setFormData({ ...formData, fitType: e.target.value })}
                          placeholder="e.g. Oversized, Regular Fit"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                        />
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* SKU & VARIANT MATRIX GENERATOR SECTION */}
              <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" /> SKU & Variant Matrix Generator
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Generate SKU combinations for each Color x Size pair with custom price & stock.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const colors = formData.colors && formData.colors.length > 0 ? formData.colors : ['Default'];
                      const sizes = formData.sizes && formData.sizes.length > 0 ? formData.sizes : ['Standard'];
                      const baseSku = formData.sku || 'BB-PROD';
                      const basePrice = formData.price || 1490;

                      const generatedVariants: any[] = [];
                      colors.forEach((color) => {
                        sizes.forEach((size) => {
                          const colorCode = color.slice(0, 3).toUpperCase();
                          const sizeCode = size.toUpperCase();
                          generatedVariants.push({
                            id: `v-${colorCode}-${sizeCode}-${Date.now()}-${Math.random().toString().slice(-3)}`,
                            sku: `${baseSku}-${colorCode}-${sizeCode}`,
                            color: color === 'Default' ? '' : color,
                            size: size === 'Standard' ? '' : size,
                            price: basePrice,
                            stock: 10,
                          });
                        });
                      });

                      const totalStock = generatedVariants.reduce((acc, v) => acc + v.stock, 0);
                      setFormData({ ...formData, variants: generatedVariants, stock: totalStock });
                    }}
                    className="px-3.5 py-1.5 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-xs transition flex-shrink-0"
                  >
                    ⚡ Auto-Generate ({((formData.colors?.length || 1) * (formData.sizes?.length || 1))} Variants)
                  </button>
                </div>

                {/* Variant Table */}
                {formData.variants && formData.variants.length > 0 ? (
                  <div className="border border-stone-800 rounded-xl overflow-hidden text-xs bg-stone-950/60">
                    <table className="w-full text-left">
                      <thead className="bg-stone-800/80 text-[10px] text-stone-400 font-bold uppercase">
                        <tr>
                          <th className="p-2.5">Variant SKU</th>
                          <th className="p-2.5">Color & Size</th>
                          <th className="p-2.5 text-right">Price (₹)</th>
                          <th className="p-2.5 text-center">Stock</th>
                          <th className="p-2.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800">
                        {formData.variants.map((v, idx) => (
                          <tr key={v.id || idx}>
                            <td className="p-2 text-xs">
                              <input
                                type="text"
                                value={v.sku || ''}
                                onChange={(e) => {
                                  const updated = [...formData.variants!];
                                  updated[idx] = { ...updated[idx], sku: e.target.value };
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-full font-mono bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-yellow-400"
                              />
                            </td>
                            <td className="p-2 text-xs font-bold text-stone-300">
                              {v.color || '—'} / {v.size || '—'}
                            </td>
                            <td className="p-2 text-right">
                              <input
                                type="number"
                                value={v.price || 0}
                                onChange={(e) => {
                                  const updated = [...formData.variants!];
                                  updated[idx] = { ...updated[idx], price: Number(e.target.value) };
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-20 font-mono text-right bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-xs text-yellow-400 font-bold outline-none focus:border-yellow-400"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                value={v.stock || 0}
                                onChange={(e) => {
                                  const updated = [...formData.variants!];
                                  updated[idx] = { ...updated[idx], stock: Number(e.target.value) };
                                  const newTotalStock = updated.reduce((acc, item) => acc + (item.stock || 0), 0);
                                  setFormData({ ...formData, variants: updated, stock: newTotalStock });
                                }}
                                className="w-16 font-mono text-center bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-bold outline-none focus:border-yellow-400"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = formData.variants!.filter((_, i) => i !== idx);
                                  const newTotalStock = updated.reduce((acc, item) => acc + (item.stock || 0), 0);
                                  setFormData({ ...formData, variants: updated, stock: newTotalStock });
                                }}
                                className="p-1 rounded text-stone-400 hover:text-red-400 hover:bg-stone-800 transition"
                                title="Remove Variant"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-400 italic text-center py-2">
                    No variants generated yet. Click "Auto-Generate" above to create SKU combinations for selected colors & sizes.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PRICING & INVENTORY */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Compare-At Price (₹)</label>
                  <input
                    type="number"
                    value={formData.compareAtPrice || 0}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                    className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={formData.costPrice || 0}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Profit Margin Pill */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900">Estimated Profit Margin</span>
                <span className="font-extrabold text-emerald-900 font-mono text-sm">{profitMargin}% Margin</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Total Stock Quantity</label>
                  {formData.variants && formData.variants.length > 0 ? (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-mono font-black text-sm text-stone-900">{formData.stock || 0} units</span>
                        <p className="text-[10px] text-amber-800 font-bold mt-0.5">
                          Managed via {formData.variants.length} SKU variants in Step 2
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-200 text-amber-900 rounded">
                        Auto-Summed
                      </span>
                    </div>
                  ) : (
                    <input
                      type="number"
                      required
                      value={formData.stock || 0}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Low Stock Warning Limit</label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold || 5}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                    className="w-full font-mono bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400 transition"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 mt-5">
                  <span className="text-xs font-bold text-stone-900">Featured Product</span>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured ?? true}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA & GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <ImageUploadPicker
                value={formData.thumbnail || formData.images?.[0] || ''}
                onChange={(url) => setFormData({ ...formData, thumbnail: url, images: [url, ...(formData.images || [])] })}
                label="Upload Primary Product Photo (Saved via Multer)"
              />

              <div className="pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-800 mb-1">Image URL (Optional Manual Link)</label>
                <input
                  type="text"
                  value={formData.thumbnail || ''}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value, images: [e.target.value] })}
                  placeholder="https://..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
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
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo!, metaTitle: e.target.value } })}
                  placeholder="e.g. Cyber Samurai Oversized Heavyweight Tee | BatalaBandi"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={formData.seo?.metaDescription || ''}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo!, metaDescription: e.target.value } })}
                  placeholder="Brief summary for Google search snippet..."
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
            form="productForm"
            className="flex items-center gap-2 px-5 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-xs transition"
          >
            <Save className="w-4 h-4" /> Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
