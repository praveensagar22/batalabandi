import type { ProductCreateForm } from './create-types';

export const WIZARD_STEPS = [
  { id: 1 as const, label: 'Basic Information', shortLabel: 'Basic' },
  { id: 2 as const, label: 'Classification', shortLabel: 'Classify' },
  { id: 3 as const, label: 'Variants', shortLabel: 'Variants' },
  { id: 4 as const, label: 'Pricing', shortLabel: 'Pricing' },
  { id: 5 as const, label: 'Inventory', shortLabel: 'Inventory' },
  { id: 6 as const, label: 'Images', shortLabel: 'Images' },
  { id: 7 as const, label: 'SEO', shortLabel: 'SEO' },
  { id: 8 as const, label: 'Review & Publish', shortLabel: 'Review' },
];

export const CATEGORY_OPTIONS = ['Tops', 'Bottoms', 'Accessories'];

export const WIZARD_PRODUCT_TYPES = [
  'Shirt',
  'Hoodie',
  'Oversized T-Shirt',
  'Sweatshirt',
  'Jacket',
];

export const COLOR_PRESETS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey'];
export const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const TAX_CLASS_OPTIONS = [
  'Standard (18% GST)',
  'Reduced (5% GST)',
  'Zero Rated',
  'Exempt',
];

export const SHIPPING_CLASS_OPTIONS = [
  'Standard',
  'Express',
  'Heavy / Bulky',
  'Free Shipping',
];

export const WAREHOUSE_OPTIONS = [
  'Mumbai Warehouse',
  'Delhi Warehouse',
  'Bangalore Warehouse',
];

export const BRAND_OPTIONS = [
  'BatalaBandi',
  'BatalaBandi Studio',
  'BatalaBandi Limited',
];

export const AUTOSAVE_KEY = 'batalabandi-product-draft';
export const AUTOSAVE_INTERVAL_MS = 3000;

export const DEFAULT_FORM: ProductCreateForm = {
  name: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  status: 'Draft',
  scheduledAt: '',
  featured: false,
  newArrival: false,
  bestSeller: false,
  trending: false,

  gender: '',
  category: '',
  productType: '',
  collection: '',
  theme: '',
  brand: 'BatalaBandi',
  tags: [],

  colors: [],
  sizes: [],
  variants: [],

  mrp: 0,
  sellingPrice: 0,
  costPrice: 0,
  gst: 18,
  taxClass: 'Standard (18% GST)',

  masterSku: '',
  stockQuantity: 0,
  lowStockThreshold: 5,
  allowBackorders: false,
  trackInventory: true,
  warehouse: 'Mumbai Warehouse',
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  shippingClass: 'Standard',

  images: [],

  metaTitle: '',
  metaDescription: '',
  keywords: [],
  canonicalUrl: '',
  ogImage: '',
};
