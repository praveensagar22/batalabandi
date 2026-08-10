'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ChevronsRight,
  Check,
  Copy,
  Eye,
  Layers,
  Loader2,
  MessageCircle,
  Pencil,
  PieChart,
  Plus,
  Save,
  ShoppingBag,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import type { Product } from '@/lib/products/types';
import { MOCK_PRODUCTS } from '@/lib/products/mock-data';
import { formatDate, formatPrice } from '@/lib/products/utils';
import type { ProductCreateForm, ProductVariant } from '@/lib/products/create-types';
import TextInput from '@/components/admin/products/create/ui/TextInput';
import Textarea from '@/components/admin/products/create/ui/Textarea';
import SelectInput from '@/components/admin/products/create/ui/SelectInput';
import TagInput from '@/components/admin/products/create/ui/TagInput';
import RichTextEditor from '@/components/admin/products/create/ui/RichTextEditor';
import VariantTable from '@/components/admin/products/create/VariantTable';
import { cn } from '@/lib/cn';

const statusOptions = ['Draft', 'Active', 'Scheduled', 'Archived'];
const genderOptions = ['Men', 'Women', 'Unisex'];
const categoryOptions = ['Hoodies', 'Shirts', 'Sweatshirts', 'Jackets', 'Oversized T-Shirts'];
const productTypeOptions = ['Hoodies', 'Shirts', 'Sweatshirts', 'Jackets', 'Oversized T-Shirts'];
const collectionOptions = ['Painted', 'Printed', 'Thread'];
const themeOptions = ['Anime', 'Marvel', 'Nature', 'Sports', 'Quotes'];
const brandOptions = ['BatalaBandi', 'StreetLab', 'Urban Motion', 'Canvas Club'];
const taxClassOptions = ['Standard', 'Reduced', 'Zero'];
const shippingClassOptions = ['Standard', 'Express', 'Freight'];
const warehouseOptions = ['Mumbai HQ', 'Delhi Warehouse', 'Bengaluru Hub', 'Kochi Depot'];

const tabs = [
  { id: 'variants', label: 'Variants' },
  { id: 'seo', label: 'SEO' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'orders', label: 'Order History' },
  { id: 'analytics', label: 'Analytics' },
] as const;

type ProductTab = (typeof tabs)[number]['id'];

const reviewItems = [
  {
    id: 'rev-001',
    customer: 'Akira Sharma',
    rating: 5,
    date: '2026-07-27',
    summary: 'Amazing fit and fabric quality.',
    status: 'Published',
  },
  {
    id: 'rev-002',
    customer: 'Priya Kapoor',
    rating: 4,
    date: '2026-07-24',
    summary: 'Great hoodie, slightly oversized as expected.',
    status: 'Published',
  },
];

const orderItems = [
  {
    id: 'ORD-3019',
    customer: 'Rahul Mehta',
    quantity: 2,
    date: '2026-07-27',
    payment: 'Paid',
    delivery: 'Delivered',
  },
  {
    id: 'ORD-2987',
    customer: 'Sana Ali',
    quantity: 1,
    date: '2026-07-25',
    payment: 'Paid',
    delivery: 'In transit',
  },
];

function buildProductForm(product: Product | null): ProductCreateForm {
  return {
    name: product?.title || product?.name || '',
    slug: product ? (product.title || product.name || '').toLowerCase().replace(/\s+/g, '-') : '',
    shortDescription:
      'Hand-painted anime hoodie with bold streetwear detailing and premium comfort.',
    fullDescription:
      '<p>The Naruto Painted Hoodie blends premium cotton with original anime-inspired artwork.</p><ul><li>Soft brushed interior</li><li>Strong ribbed cuffs</li><li>Relaxed fit for layering</li></ul>',
    status: (product?.status ?? 'Draft') as ProductCreateForm['status'],
    scheduledAt: '2026-08-12',
    featured: true,
    newArrival: false,
    bestSeller: true,
    trending: true,
    gender: product?.gender ?? 'Men',
    category: product?.productType ?? 'Hoodies',
    productType: product?.productType ?? 'Hoodies',
    collection: product?.collection ?? 'Painted',
    theme: product?.theme ?? 'Anime',
    brand: 'BatalaBandi',
    tags: ['Anime', 'Hoodie', 'Premium'],
    colors: ['Black', 'Red'],
    sizes: ['S', 'M', 'L'],
    variants: [
      {
        id: 'var-1',
        name: 'Black - M',
        color: 'Black',
        size: 'M',
        sku: product?.sku ?? 'HD-1001',
        barcode: 'BND-1234',
        priceOverride: product?.price ?? 1499,
        stock: 24,
        weight: 520,
        status: 'Active',
      },
      {
        id: 'var-2',
        name: 'Black - L',
        color: 'Black',
        size: 'L',
        sku: product ? `${product.sku}-L` : 'HD-1001-L',
        barcode: 'BND-1235',
        priceOverride: product?.price ?? 1499,
        stock: 16,
        weight: 530,
        status: 'Active',
      },
    ],
    mrp: product?.price ?? 1499,
    sellingPrice: product?.price ?? 1499,
    costPrice: 950,
    gst: 18,
    taxClass: 'Standard',
    masterSku: product?.sku ?? 'HD-1001',
    stockQuantity: product?.stock ?? 24,
    lowStockThreshold: 6,
    allowBackorders: false,
    trackInventory: true,
    warehouse: 'Mumbai HQ',
    weight: 520,
    length: 36,
    width: 26,
    height: 4,
    shippingClass: 'Standard',
    images: [
      {
        id: 'img-1',
        name: 'Primary front',
        url: '/product-placeholder.png',
        type: 'front',
        isPrimary: true,
      },
      {
        id: 'img-2',
        name: 'Back view',
        url: '/product-placeholder.png',
        type: 'back',
        isPrimary: false,
      },
    ],
    metaTitle: `${product?.name ?? 'Product'} — BatalaBandi`,
    metaDescription:
      'Discover premium anime hoodies at BatalaBandi with fast shipping and curated streetwear.',
    keywords: ['anime', 'hoodie', 'batala bandi'],
    canonicalUrl: 'https://batalabandi.com/products/naruto-painted-hoodie',
    ogImage: '/og-product.png',
  };
}

function OverviewBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-600">
      <p className="font-medium text-stone-900">{value}</p>
      <p>{label}</p>
    </div>
  );
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const product = useMemo(
    () => MOCK_PRODUCTS.find((item) => item.id === params.id) ?? null,
    [params.id]
  );
  const [tab, setTab] = useState<ProductTab>('variants');
  const [form, setForm] = useState<ProductCreateForm>(() => buildProductForm(product));
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (product) {
      setForm(buildProductForm(product));
    }
  }, [product]);

  useEffect(() => {
    if (!dirty) return;
    const autosave = setTimeout(() => {
      setToast('Autosaved successfully');
      setDirty(false);
    }, 2000);
    return () => clearTimeout(autosave);
  }, [dirty]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [form]);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-stone-950">Product not found</h1>
          <p className="mt-3 text-sm text-stone-500">
            The product you are looking for may have been removed or the link is invalid.
          </p>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </button>
        </div>
      </div>
    );
  }

  const setField = (updates: Partial<ProductCreateForm>) => {
    setForm((current) => ({ ...current, ...updates }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaving(false);
    setDirty(false);
    setToast('Changes saved successfully');
  };

  const handlePublish = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSaving(false);
    setDirty(false);
    setToast('Product published to the storefront');
  };

  const handleDuplicate = () => {
    setToast('Duplicate created');
  };

  const handleArchive = () => {
    setToast('Product moved to archive');
  };

  const pageTitle = product.name;
  const stockStatus = product.stock === 0 ? 'Out of stock' : product.stock < 10 ? 'Low stock' : 'In stock';

  const analyticsSeries = [72, 94, 86, 112, 132, 118, 145];

  return (
    <div className="max-w-[1600px] mx-auto pb-36 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <nav className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                <Link href="/admin" className="hover:text-stone-700 transition-colors">
                  Dashboard
                </Link>
                <ChevronsRight className="w-3.5 h-3.5 text-stone-300" />
                <Link href="/admin/products" className="hover:text-stone-700 transition-colors">
                  Products
                </Link>
                <ChevronsRight className="w-3.5 h-3.5 text-stone-300" />
                <span className="text-stone-600">{pageTitle}</span>
              </nav>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-950">
                    {pageTitle}
                  </h1>
                  <p className="mt-2 text-sm text-stone-500 max-w-2xl">
                    View and edit every detail for the product in one premium dashboard experience.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setToast('Preview opened in a new tab')}
                    className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 transition"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={handleDuplicate}
                    className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 transition"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={handleArchive}
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Archive
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {toast && (
          <div className="fixed right-4 top-24 z-50 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-lg">
            <div className="flex items-center gap-3 text-sm text-stone-700">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{toast}</span>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(320px,0.3fr)]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  <OverviewBadge label="Status" value={form.status} />
                  <OverviewBadge label="SKU" value={form.masterSku} />
                  <OverviewBadge label="Stock" value={`${form.stockQuantity} pcs`} />
                  <OverviewBadge label="Updated" value={formatDate(product.createdDate || product.createdAt || '2026-08-01')} />
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  <Star className="w-4 h-4" />
                  Trending product
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4 lg:max-w-2xl">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextInput
                      label="Product Name"
                      id="product-name"
                      value={form.name}
                      onChange={(value) => setField({ name: value })}
                      required
                    />
                    <TextInput
                      label="Slug"
                      id="product-slug"
                      value={form.slug}
                      onChange={(value) => setField({ slug: value })}
                    />
                  </div>
                  <Textarea
                    label="Short Description"
                    id="short-description"
                    value={form.shortDescription}
                    onChange={(value) => setField({ shortDescription: value })}
                    rows={4}
                  />
                  <RichTextEditor
                    label="Full Description"
                    value={form.fullDescription}
                    onChange={(value) => setField({ fullDescription: value })}
                  />
                </div>
                <div className="grid gap-4 w-full max-w-xs">
                  <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Product state</p>
                    <div className="mt-4 space-y-3">
                      {statusOptions.map((option) => (
                        <button
                          type="button"
                          key={option}
                          onClick={() => setField({ status: option as ProductCreateForm['status'] })}
                          className={cn(
                            'w-full rounded-2xl border px-3 py-2 text-left text-sm transition',
                            option === form.status
                              ? 'border-stone-900 bg-stone-950 text-white'
                              : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-stone-200 bg-white p-4">
                    <div className="flex items-center justify-between text-sm text-stone-500">
                      <span>Performance</span>
                      <span className="font-semibold text-stone-900">+28%</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
                      <div className="h-full w-[68%] rounded-full bg-stone-900" />
                    </div>
                    <p className="mt-3 text-xs text-stone-400">Inventory, price, and engagement are trending up.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SelectInput
                  label="Gender"
                  id="gender"
                  value={form.gender}
                  onChange={(value) => setField({ gender: value })}
                  options={genderOptions}
                />
                <SelectInput
                  label="Category"
                  id="category"
                  value={form.category}
                  onChange={(value) => setField({ category: value })}
                  options={categoryOptions}
                />
                <SelectInput
                  label="Product Type"
                  id="product-type"
                  value={form.productType}
                  onChange={(value) => setField({ productType: value })}
                  options={productTypeOptions}
                />
                <SelectInput
                  label="Collection"
                  id="collection"
                  value={form.collection}
                  onChange={(value) => setField({ collection: value })}
                  options={collectionOptions}
                />
                <SelectInput
                  label="Theme"
                  id="theme"
                  value={form.theme}
                  onChange={(value) => setField({ theme: value })}
                  options={themeOptions}
                />
                <SelectInput
                  label="Brand"
                  id="brand"
                  value={form.brand}
                  onChange={(value) => setField({ brand: value })}
                  options={brandOptions}
                />
              </div>
              <div className="mt-6">
                <TagInput
                  label="Tags"
                  tags={form.tags}
                  onChange={(tags) => setField({ tags })}
                  suggestions={['Anime', 'Streetwear', 'Limited', 'New Arrival']}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-stone-950">Product workspace</h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Manage variants, SEO, reviews, orders, and analytics from one place.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  {tab}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
                {tabs.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={cn(
                      'rounded-2xl px-4 py-2 text-sm font-medium transition',
                      tab === item.id
                        ? 'bg-stone-950 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-6">
                {tab === 'variants' && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-stone-950">Variants</p>
                        <p className="text-sm text-stone-500">Edit SKU, price, stock and variant status.</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setToast('Variant added')}
                          className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition"
                        >
                          <Plus className="w-4 h-4" />
                          Add Variant
                        </button>
                        <button
                          type="button"
                          onClick={() => setToast('Variants generated')}
                          className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 transition"
                        >
                          <Layers className="w-4 h-4" />
                          Generate Variants
                        </button>
                      </div>
                    </div>
                    <VariantTable
                      variants={form.variants}
                      onChange={(variants) => setField({ variants })}
                    />
                  </div>
                )}

                {tab === 'seo' && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <TextInput
                        label="Meta Title"
                        id="meta-title"
                        value={form.metaTitle}
                        onChange={(value) => setField({ metaTitle: value })}
                      />
                      <Textarea
                        label="Meta Description"
                        id="meta-description"
                        value={form.metaDescription}
                        onChange={(value) => setField({ metaDescription: value })}
                        rows={5}
                      />
                      <TextInput
                        label="Keywords"
                        id="keywords"
                        value={form.keywords.join(', ')}
                        onChange={(value) => setField({ keywords: value.split(',').map((item) => item.trim()) })}
                      />
                    </div>
                    <div className="space-y-4">
                      <TextInput
                        label="Canonical URL"
                        id="canonical-url"
                        value={form.canonicalUrl}
                        onChange={(value) => setField({ canonicalUrl: value })}
                      />
                      <TextInput
                        label="Open Graph Image"
                        id="og-image"
                        value={form.ogImage}
                        onChange={(value) => setField({ ogImage: value })}
                      />
                      <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
                        <p className="text-sm font-semibold text-stone-900">Google Preview</p>
                        <p className="mt-3 text-base font-medium text-[#1a0dab] truncate">{form.metaTitle}</p>
                        <p className="mt-1 text-sm text-stone-500 truncate">{form.canonicalUrl}</p>
                        <p className="mt-2 text-sm text-stone-500 line-clamp-2">{form.metaDescription}</p>
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'reviews' && (
                  <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <OverviewBadge label="Avg. Rating" value="4.9 / 5" />
                      <OverviewBadge label="Total Reviews" value="128" />
                      <OverviewBadge label="Hidden" value="2" />
                    </div>
                    <div className="space-y-4">
                      {reviewItems.map((review) => (
                        <div key={review.id} className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-stone-950">{review.customer}</p>
                              <p className="text-xs text-stone-500">{review.date} • {review.status}</p>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-stone-700 shadow-sm">
                              <Star className="w-3.5 h-3.5 text-amber-500" />
                              {review.rating}.0
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-stone-600">{review.summary}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" className="rounded-2xl bg-white px-3 py-2 text-sm font-medium text-stone-700 border border-stone-200 hover:bg-stone-50 transition">Reply</button>
                            <button type="button" className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 transition">Hide</button>
                            <button type="button" className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'orders' && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-sm">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-stone-50 text-stone-500 uppercase text-[11px] tracking-[0.25em]">
                          <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Qty</th>
                            <th className="px-4 py-3">Order Date</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Delivery</th>
                            <th className="px-4 py-3">Invoice</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {orderItems.map((order) => (
                            <tr key={order.id} className="hover:bg-stone-50/80">
                              <td className="px-4 py-3 font-medium text-stone-900">{order.id}</td>
                              <td className="px-4 py-3 text-stone-600">{order.customer}</td>
                              <td className="px-4 py-3 text-stone-600">{order.quantity}</td>
                              <td className="px-4 py-3 text-stone-600">{order.date}</td>
                              <td className="px-4 py-3 text-stone-600">{order.payment}</td>
                              <td className="px-4 py-3 text-stone-600">{order.delivery}</td>
                              <td className="px-4 py-3">
                                <button className="rounded-2xl bg-stone-900 px-3 py-1 text-white text-xs">Invoice</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {tab === 'analytics' && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-stone-950">Monthly performance</p>
                          <p className="text-sm text-stone-500">Views, sales and revenue.</p>
                        </div>
                        <PieChart className="w-5 h-5 text-stone-500" />
                      </div>
                      <div className="space-y-3">
                        {['Views', 'Sales', 'Revenue'].map((label, index) => (
                          <div key={label} className="space-y-1">
                            <div className="flex items-center justify-between text-sm text-stone-500">
                              <span>{label}</span>
                              <span className="font-semibold text-stone-900">{index === 0 ? '12.4k' : index === 1 ? '842' : '₹1.2M'}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                              <div className={`h-full rounded-full ${index === 0 ? 'w-5/6 bg-amber-500' : index === 1 ? 'w-4/5 bg-emerald-500' : 'w-3/4 bg-sky-500'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-stone-950">Conversion rate</p>
                          <p className="text-sm text-stone-500">From view to checkout.</p>
                        </div>
                        <div className="rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">8.2%</div>
                      </div>
                      <div className="mt-6 grid gap-3">
                        {analyticsSeries.map((value, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm text-stone-500">
                            <span className="w-12 text-right font-semibold text-stone-900">Week {index + 1}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                              <div className="h-full rounded-full bg-stone-900" style={{ width: `${value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-stone-950">Quick details</h2>
              <div className="mt-5 space-y-4 text-sm text-stone-600">
                <DetailRow label="Created" value={formatDate(product.createdDate || product.createdAt || '2026-08-01')} />
                <DetailRow label="Updated" value={formatDate(product.createdDate || product.createdAt || '2026-08-01')} />
                <DetailRow label="Published" value="2026-07-14" />
                <DetailRow label="Created by" value="Admin" />
                <DetailRow label="Updated by" value="Admin" />
              </div>
            </section>
            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-stone-950">Quick statistics</h2>
              <div className="mt-5 grid gap-3">
                <StatCard label="Views" value="12.4k" />
                <StatCard label="Orders" value="842" />
                <StatCard label="Revenue" value="₹1.2M" />
                <StatCard label="Wishlist" value="3.5k" />
                <StatCard label="Rating" value="4.9" />
              </div>
            </section>
            <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6 text-sm text-stone-600 shadow-sm">
              <p className="font-semibold text-stone-950">Product health</p>
              <div className="mt-4 space-y-3">
                <HealthBadge label="Stock" value={stockStatus} />
                <HealthBadge label="Backorders" value={form.allowBackorders ? 'Allowed' : 'Disabled'} />
                <HealthBadge label="Inventory tracking" value={form.trackInventory ? 'Active' : 'Paused'} />
              </div>
            </section>
          </aside>
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 backdrop-blur-xl px-4 py-4 shadow-[0_-1px_0_rgba(15,23,42,0.04)] sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-stone-500">
            {dirty ? 'Unsaved changes will autosave shortly.' : 'All changes are up to date.'}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setToast('Draft saved')}
              className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-stone-50 transition"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-2xl bg-stone-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition"
            >
              {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="rounded-2xl bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 transition"
            >
              Publish
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
      <span className="text-sm text-stone-500">{label}</span>
      <span className="text-sm font-semibold text-stone-900">{value}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-stone-950">{value}</p>
    </div>
  );
}

function HealthBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm text-stone-700 shadow-sm">
      <span>{label}</span>
      <span className="font-semibold text-stone-900">{value}</span>
    </div>
  );
}
